const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const webpack = require("webpack");
const {launchBrowser} = require("./util/launchBrowser");

jest.setTimeout(90000);

describe("native input undo granularity", () => {
    let directory;
    let server;
    let browser;
    let page;
    let origin;

    beforeAll(async () => {
        directory = fs.mkdtempSync(path.join(os.tmpdir(), "vditor-undo-browser-"));
        const root = path.resolve(__dirname, "..");
        const base = require("../webpack.config")[0];
        const compiler = webpack({...base, context: root, mode: "development", devtool: false,
            entry: {index: path.join(root, "src/index.ts")}, output: {...base.output, path: directory},
            optimization: {minimize: false},
            plugins: base.plugins.filter(plugin => plugin.constructor.name !== "CleanWebpackPlugin"),
            module: {rules: base.module.rules.filter(rule => String(rule.test) !== String(/\.js$/)).map(rule => String(rule.test) === String(/\.ts$/) ?
                {...rule, use: {loader: "ts-loader", options: {compilerOptions: {declaration: false}}}} : rule)},
        });
        await new Promise((resolve, reject) => compiler.run((error, stats) => {
            compiler.close(() => {});
            if (error || stats.hasErrors()) reject(error || new Error(stats.toString({all: false, errors: true})));
            else resolve();
        }));
        server = http.createServer((request, response) => {
            const pathname = new URL(request.url, "http://localhost").pathname.replace(/^\/dist\//, "/");
            if (pathname === "/") {
                response.setHeader("Content-Type", "text/html");
                response.end('<link rel="stylesheet" href="/index.css"><div id="editor"></div>' +
                    '<script src="/index.js"></script><script src="/js/i18n/en_US.js"></script>');
                return;
            }
            const file = path.resolve(directory, "." + pathname);
            if (!file.startsWith(directory + path.sep) || !fs.existsSync(file)) {
                response.writeHead(404); response.end(); return;
            }
            response.setHeader("Content-Type", file.endsWith(".js") ? "application/javascript" :
                file.endsWith(".css") ? "text/css" : "application/octet-stream");
            fs.createReadStream(file).pipe(response);
        });
        await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
        origin = `http://127.0.0.1:${server.address().port}`;
        browser = await launchBrowser();
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser?.close();
        if (server) await new Promise(resolve => server.close(resolve));
        if (directory) fs.rmSync(directory, {recursive: true, force: true});
    });

    for (const mode of ["wysiwyg", "ir", "sv"]) {
        it(`undoes rapid native keystrokes separately in ${mode}`, async () => {
            await page.goto(origin);
            await page.evaluate(async ({mode, origin}) => {
                window.editor = await new Promise(resolve => {
                    let editor;
                    editor = new Vditor("editor", {mode, cdn: origin, _lutePath: origin + "/js/lute/lute.min.js",
                        i18n: window.VditorI18n, undoDelay: 0, cache: {enable: false},
                        toolbar: ["undo", "redo"], value: "start", after: () => resolve(editor)});
                });
                const state = window.editor.vditor;
                window.editor.setValue("start", true);
                const surface = state[mode].element;
                surface.focus();
                if (mode === "sv") surface.setSelectionRange(surface.value.length, surface.value.length);
                else {
                    const range = document.createRange();
                    range.selectNodeContents(surface.lastElementChild);
                    range.collapse(false);
                    getSelection().removeAllRanges(); getSelection().addRange(range);
                }
            }, {mode, origin});
            await page.keyboard.type("abc");
            for (const expected of ["startab", "starta", "start"]) {
                const value = await page.evaluate(() => {
                    window.editor.vditor.undo.undo(window.editor.vditor);
                    return window.editor.getValue().trimEnd();
                });
                expect(value).toBe(expected);
            }
            for (const expected of ["starta", "startab", "startabc"]) {
                const value = await page.evaluate(() => {
                    window.editor.vditor.undo.redo(window.editor.vditor);
                    return window.editor.getValue().trimEnd();
                });
                expect(value).toBe(expected);
            }
            const session = await page.target().createCDPSession();
            await session.send("Input.imeSetComposition", {text: "n", selectionStart: 1, selectionEnd: 1});
            await session.send("Input.imeSetComposition", {text: "ni", selectionStart: 2, selectionEnd: 2});
            await session.send("Input.insertText", {text: "你"});
            expect(await page.evaluate(() => window.editor.getValue().trimEnd())).toBe("startabc你");
            expect(await page.evaluate(() => {
                window.editor.vditor.undo.undo(window.editor.vditor);
                return window.editor.getValue().trimEnd();
            })).toBe("startabc");
            await session.detach();
        });
    }
});
