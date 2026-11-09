const fs = require("fs");
const os = require("os");
const path = require("path");
const http = require("http");
const {execFile} = require("child_process");
const {promisify} = require("util");
const {launchBrowser} = require("./util/launchBrowser");

jest.setTimeout(120000);

describe("ESM and UMD package builds", () => {
    let directory;
    let server;
    let browser;
    let origin;
    beforeAll(async () => {
        directory = fs.mkdtempSync(path.join(os.tmpdir(), "vditor-esm-build-"));
        const buildScript = path.join(directory, "build.cjs");
        fs.writeFileSync(buildScript, `const webpack = require(${JSON.stringify(require.resolve("webpack"))});
const configs = require(${JSON.stringify(path.resolve(__dirname, "../webpack.config.js"))}).map(config => ({
    ...config, output: {...config.output, path: ${JSON.stringify(directory)}},
    plugins: config.plugins.filter(plugin => !["CleanWebpackPlugin", "CopyPlugin"].includes(plugin.constructor.name)),
    module: {...config.module, rules: config.module.rules.map(rule => rule.use === "ts-loader" ?
        {...rule, use: {loader: "ts-loader", options: {compilerOptions: {outDir: ${JSON.stringify(directory)}}}}} : rule)},
}));
const compiler = webpack(configs);
compiler.run((error, stats) => compiler.close(closeError => {
    if (error || closeError || stats.hasErrors()) {console.error(error || closeError || stats.toString({all:false,errors:true})); process.exitCode=1;}
}));`);
        await promisify(execFile)(process.execPath, [buildScript], {cwd: path.resolve(__dirname, ".."), windowsHide: true, timeout: 110000});
        server = http.createServer((request, response) => {
            const name = new URL(request.url, "http://localhost").pathname;
            response.setHeader("Access-Control-Allow-Origin", "*");
            if (name === "/") {response.setHeader("Content-Type", "text/html"); response.end("<html><body></body></html>"); return;}
            const file = path.resolve(directory, "." + name);
            if (!file.startsWith(directory + path.sep) || !fs.existsSync(file)) {response.writeHead(404).end(); return;}
            response.setHeader("Content-Type", name.endsWith(".css") ? "text/css" : "text/javascript");
            response.end(fs.readFileSync(file));
        });
        await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
        origin = `http://127.0.0.1:${server.address().port}`;
        browser = await launchBrowser();
    });
    afterAll(async () => {
        await browser?.close();
        if (server) await new Promise(resolve => server.close(resolve));
        if (directory) {
            if (path.dirname(path.resolve(directory)) !== path.resolve(os.tmpdir()) || !path.basename(directory).startsWith("vditor-esm-build-")) throw new Error("Unexpected build directory");
            fs.rmSync(directory, {recursive: true, force: true});
        }
    });

    it("imports native ESM editor and method entry points", async () => {
        expect(require("../package.json").module).toBe("dist/index.mjs");
        for (const file of ["index.js", "index.min.js", "method.js", "method.min.js", "index.mjs", "method.mjs", "index.css"]) {
            expect(fs.existsSync(path.join(directory, file))).toBe(true);
        }
        const page = await browser.newPage();
        await page.goto(origin);
        await page.addScriptTag({path: path.resolve(__dirname, "../src/js/i18n/en_US.js")});
        await page.addScriptTag({path: path.resolve(__dirname, "../src/js/lute/lute.min.js")});
        const result = await page.evaluate(async () => {
            const {default: Vditor} = await import("/index.mjs");
            const {default: methods} = await import("/method.mjs");
            const script = document.createElement("script"); script.id = "vditorLuteScript"; document.head.appendChild(script);
            const root = document.createElement("div"); document.body.appendChild(root);
            const editor = await new Promise(resolve => {
                const instance = new Vditor(root, {mode: "wysiwyg", value: "# module", icon: "", cache: {enable: false},
                    i18n: window.VditorI18n, after: () => resolve(instance)});
            });
            const value = {markdown: editor.getValue(), method: typeof methods.preview};
            editor.destroy(); return value;
        });
        expect(result).toEqual({markdown: "# module\n", method: "function"});
        await page.close();
    });

    it("retains global UMD and CommonJS exports", async () => {
        for (const commonJS of [false, true]) {
            const page = await browser.newPage();
            await page.goto(origin);
            if (commonJS) await page.evaluate(() => { window.module = {exports: {}}; window.exports = window.module.exports; });
            await page.addScriptTag({url: `${origin}/index.js`});
            expect(await page.evaluate(commonJS => typeof (commonJS ? window.module.exports : window.Vditor), commonJS)).toBe("function");
            await page.close();
        }
    });
});
