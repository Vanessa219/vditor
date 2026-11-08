const fs = require("fs");
const http = require("http");
const path = require("path");
const ts = require("typescript");
const {launchBrowser} = require("../util/launchBrowser");

const compile = file => ts.transpileModule(fs.readFileSync(path.resolve(__dirname, file), "utf8"), {
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019},
}).outputText;

describe.each(["desktop", "mobile"])("Graphviz Worker rendering on %s", platform => {
    let server;
    let browser;
    let page;
    let origin;
    let requests;
    beforeAll(async () => {
        requests = [];
        const runtime = fs.readFileSync(path.resolve(__dirname, "../../src/js/graphviz/viz.js"));
        server = http.createServer((request, response) => {
            requests.push(request.url);
            if (request.url === "/dist/js/graphviz/viz.js") {
                response.writeHead(200, {"Content-Type": "application/javascript"});
                response.end(runtime);
            } else if (request.url.startsWith("/missing/")) {
                response.writeHead(404);
                response.end();
            } else {
                response.writeHead(200, {"Content-Type": "text/html"});
                response.end("<div id='preview'></div>");
            }
        });
        await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
        origin = `http://127.0.0.1:${server.address().port}`;
        browser = await launchBrowser();
        page = await browser.newPage();
        if (platform === "mobile") {
            await page.setViewport({width: 390, height: 844, isMobile: true, hasTouch: true});
        }
        await page.goto(origin);
        await page.addScriptTag({content: `(() => {
            const adapters = {};
            new Function("exports", ${JSON.stringify(compile("../../src/ts/markdown/adapterRender.ts"))})(adapters);
            const renderer = {};
            new Function("exports", "require", ${JSON.stringify(compile("../../src/ts/markdown/graphvizRender.ts"))})(renderer,
                name => name === "../constants" ? {Constants: {CDN: ${JSON.stringify(origin)}}} : adapters);
            window.renderGraphviz = renderer.graphvizRender;
            window.workerCount = 0;
            window.terminatedCount = 0;
            window.revokedCount = 0;
            const NativeWorker = Worker;
            window.Worker = class extends NativeWorker {
                constructor(...args) { super(...args); window.workerCount++; }
                terminate() { window.terminatedCount++; return super.terminate(); }
            };
            const revoke = URL.revokeObjectURL.bind(URL);
            URL.revokeObjectURL = value => { window.revokedCount++; revoke(value); };
        })();`});
    });
    afterAll(async () => {
        await browser?.close();
        await new Promise(resolve => server?.close(resolve));
    });

    it.each([
        "digraph { A -> B }", "graph { A -- B }",
        'digraph { subgraph cluster_0 { A; B } A -> B [label="edge"] }',
        'digraph { A [label=<<B>bold</B>>]; A -> B }',
    ])("renders %s and releases the Worker", async code => {
        const before = await page.evaluate(code => {
            document.querySelector("#preview").innerHTML = "<pre><code class='language-graphviz'></code></pre>";
            document.querySelector("code").textContent = code;
            const before = window.workerCount;
            window.renderGraphviz(document.querySelector("#preview"));
            return before;
        }, code);
        await page.waitForSelector("#preview svg");
        const result = await page.evaluate(() => {
            window.renderGraphviz(document.querySelector("#preview"));
            return {count: window.workerCount, terminated: window.terminatedCount, revoked: window.revokedCount,
                text: document.querySelector("svg").textContent};
        });
        expect(result.text).toContain("A");
        expect(result.text).toContain("B");
        expect(result.count).toBe(before + 1);
        expect(result.terminated).toBe(result.count);
        expect(result.revoked).toBe(result.count);
        expect(requests.some(url => /full\.render|\.wasm/.test(url))).toBe(false);
    });

    it.each(["invalid graph <img src=x onerror=alert(1)>", "missing-runtime"])("reports %s safely", async code => {
        await page.evaluate(({code, origin}) => {
            document.querySelector("#preview").innerHTML = "<pre><code class='language-graphviz'></code></pre>";
            document.querySelector("code").textContent = code === "missing-runtime" ? "digraph { A -> B }" : code;
            window.renderGraphviz(document.querySelector("#preview"), code === "missing-runtime" ? `${origin}/missing` : origin);
        }, {code, origin});
        await page.waitForSelector(".vditor-reset--error");
        const result = await page.evaluate(() => ({
            text: document.querySelector("code").textContent, images: document.querySelectorAll("img").length,
            count: window.workerCount, terminated: window.terminatedCount, revoked: window.revokedCount,
        }));
        expect(result.text).toContain("graphviz render error:");
        expect(result.images).toBe(0);
        expect(result.terminated).toBe(result.count);
        expect(result.revoked).toBe(result.count);
    });
});
