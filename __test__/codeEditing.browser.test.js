const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const webpack = require("webpack");
const {launchBrowser} = require("./util/launchBrowser");

jest.setTimeout(90000);

describe("highlighted code editing", () => {
    let directory;
    let server;
    let browser;
    let page;
    let origin;
    const markdown = "```js\nconst answer = 1;\n```\n\noutside\n";

    beforeAll(async () => {
        directory = fs.mkdtempSync(path.join(os.tmpdir(), "vditor-code-browser-"));
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
                response.end('<meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/index.css"><div id="editor"></div><input id="outside">' +
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
        page.setDefaultTimeout(10000);
        page.on("pageerror", error => console.log(error.message));
    });

    afterAll(async () => {
        await browser?.close();
        if (server) await new Promise(resolve => server.close(resolve));
        if (directory) fs.rmSync(directory, {recursive: true, force: true});
    });

    const openEditor = async (mode, extra = {}) => {
        await page.goto(origin);
        await page.evaluate(async ({mode, origin, markdown, extra}) => {
            window.editor = await new Promise(resolve => {
                let editor;
                editor = new Vditor("editor", {mode, cdn: origin, _lutePath: origin + "/js/lute/lute.min.js",
                    i18n: window.VditorI18n, undoDelay: 0, cache: {enable: false},
                    toolbar: ["undo", "redo"], value: markdown, ...extra, after: () => resolve(editor)});
            });
            window.source = () => window.editor.vditor[mode].element.querySelector('[data-type="code-block"] > pre > code');
            window.place = (start, end = start) => {
                const code = window.source();
                window.editor.vditor[mode].element.focus();
                const point = offset => {
                    const walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT);
                    let node;
                    while ((node = walker.nextNode())) {
                        if (offset <= node.length) return [node, offset];
                        offset -= node.length;
                    }
                    return [code, code.childNodes.length];
                };
                getSelection().setBaseAndExtent(...point(start), ...point(end));
            };
        }, {mode, origin, markdown, extra});
    };

    for (const mode of ["ir", "wysiwyg"]) {
        it(`keeps native typing, composition and undo in highlighted ${mode} code`, async () => {
            await openEditor(mode);
            await page.waitForFunction(() => window.source()?.querySelector(".hljs-keyword"));
            await page.click(`.vditor-${mode}__preview`);
            await page.evaluate(() => window.place(6));
            await page.keyboard.type("new");
            expect(await page.evaluate(() => window.editor.getValue())).toBe(markdown.replace("answer", "newanswer"));
            for (const name of ["neanswer", "nanswer", "answer"]) {
                expect(await page.evaluate(() => {
                    window.editor.vditor.undo.undo(window.editor.vditor);
                    return window.editor.getValue();
                })).toBe(markdown.replace("answer", name));
            }
            for (const name of ["nanswer", "neanswer", "newanswer"]) {
                expect(await page.evaluate(() => {
                    window.editor.vditor.undo.redo(window.editor.vditor);
                    return window.editor.getValue();
                })).toBe(markdown.replace("answer", name));
            }
            await page.waitForFunction(() => window.source().querySelector(".hljs-keyword"));
            await page.evaluate(() => window.place(9));
            const session = await page.target().createCDPSession();
            await session.send("Input.imeSetComposition", {text: "n", selectionStart: 1, selectionEnd: 1});
            await session.send("Input.imeSetComposition", {text: "ni", selectionStart: 2, selectionEnd: 2});
            await session.send("Input.insertText", {text: "你"});
            await session.detach();
            expect(await page.evaluate(() => window.editor.getValue())).toBe(markdown.replace("answer", "new你answer"));
            await page.waitForFunction(() => window.source().querySelector(".hljs-keyword"));
            expect(await page.evaluate(() => {
                window.editor.vditor.undo.undo(window.editor.vditor);
                return window.editor.getValue();
            })).toBe(markdown.replace("answer", "newanswer"));
            await page.screenshot({path: path.join(os.tmpdir(), `vditor-21256-${mode}-editing.png`)});
        });

        it(`preserves ${mode} code through replacement, newlines, deletion and export`, async () => {
            await openEditor(mode);
            await page.waitForFunction(() => window.source()?.querySelector(".hljs-keyword"));
            expect(await page.evaluate(() => window.editor.getValue())).toBe(markdown);
            expect(await page.evaluate(() => window.editor.getHTML())).toContain("const answer = 1;");
            await page.click(`.vditor-${mode}__preview`);
            await page.evaluate(() => window.place(6, 12));
            await page.keyboard.type("value");
            expect(await page.evaluate(() => window.editor.getValue())).toBe(markdown.replace("answer", "value"));
            await page.keyboard.press("End");
            await page.keyboard.press("Enter");
            await page.keyboard.type("let second = 2;");
            expect(await page.evaluate(() => window.editor.getValue())).toBe(markdown.replace("const answer = 1;", "const value = 1;\nlet second = 2;"));
            await page.keyboard.press("Backspace");
            expect(await page.evaluate(() => window.editor.getValue())).toBe(markdown.replace("const answer = 1;", "const value = 1;\nlet second = 2"));
            await page.waitForFunction(() => window.source().querySelector(".hljs-keyword"));
            expect(await page.evaluate(() => window.source().querySelectorAll(".vditor-linenumber__temp").length)).toBe(0);
        });

        it(`uses light and dark highlighting while editing ${mode} on a narrow touch viewport`, async () => {
            await page.setViewport({width: 390, height: 844, isMobile: true, hasTouch: true});
            try {
                await openEditor(mode);
                await page.waitForFunction(() => window.source()?.querySelector(".hljs-keyword"));
                await page.tap(`.vditor-${mode}__preview`);
                const colors = [];
                for (const [theme, codeTheme] of [["classic", "github"], ["dark", "github-dark"]]) {
                    await page.evaluate(({theme, codeTheme}) => window.editor.setTheme(theme, theme === "dark" ? "dark" : "light", codeTheme), {theme, codeTheme});
                    await page.waitForFunction(codeTheme => Array.from(document.styleSheets).some(sheet => {
                        try {return sheet.href?.endsWith(`/${codeTheme}.min.css`) && sheet.cssRules.length > 0;} catch {return false;}
                    }), {}, codeTheme);
                    colors.push(await page.evaluate(() => ({
                        code: getComputedStyle(window.source()).color,
                        keyword: getComputedStyle(window.source().querySelector(".hljs-keyword")).color,
                    })));
                    await page.screenshot({path: path.join(os.tmpdir(), `vditor-21256-${mode}-${theme}.png`)});
                }
                expect(colors[0].keyword).not.toBe(colors[0].code);
                expect(colors[1].keyword).not.toBe(colors[1].code);
                expect(colors[0].keyword).not.toBe(colors[1].keyword);
                expect(await page.evaluate(() => window.editor.getValue())).toBe(markdown);
            } finally {
                await page.setViewport({width: 1000, height: 720, isMobile: false, hasTouch: false});
            }
        });

        it(`closes ${mode} language hints outside the field and accepts a candidate`, async () => {
            await openEditor(mode);
            await page.waitForFunction(() => window.source()?.querySelector(".hljs-keyword"));
            await page.click(`.vditor-${mode}__preview`);
            if (mode === "ir") {
                await page.evaluate(() => {
                    const info = window.editor.vditor.ir.element.querySelector('[data-type="code-block-info"]');
                    const range = document.createRange();
                    range.selectNodeContents(info); getSelection().removeAllRanges(); getSelection().addRange(range);
                });
            } else {
                await page.waitForSelector('.vditor-wysiwyg .vditor-panel .vditor-input', {visible: true});
                await page.click('.vditor-wysiwyg .vditor-panel .vditor-input', {clickCount: 3});
            }
            await page.keyboard.type("jav");
            await page.waitForSelector(".vditor-hint button", {visible: true});
            await page.click(`.vditor-${mode} .vditor-reset > p`);
            expect(await page.evaluate(() => window.editor.vditor.hint.element.style.display)).toBe("none");
            // 候选按钮使用鼠标选择时应保留语言字段的选区。
            await openEditor(mode);
            await page.waitForFunction(() => window.source()?.querySelector(".hljs-keyword"));
            await page.click(`.vditor-${mode}__preview`);
            if (mode === "ir") {
                await page.evaluate(() => {
                    const info = window.editor.vditor.ir.element.querySelector('[data-type="code-block-info"]');
                    const range = document.createRange(); range.selectNodeContents(info);
                    getSelection().removeAllRanges(); getSelection().addRange(range);
                });
            } else {
                await page.waitForSelector('.vditor-wysiwyg .vditor-panel .vditor-input', {visible: true});
                await page.click('.vditor-wysiwyg .vditor-panel .vditor-input', {clickCount: 3});
            }
            await page.keyboard.type("jav");
            await page.waitForSelector(".vditor-hint button", {visible: true});
            await page.click('.vditor-hint button[data-value="javascript "]');
            expect(await page.evaluate(() => window.editor.getValue())).toContain("```javascript\n");
            expect(await page.evaluate(() => window.editor.vditor.hint.element.style.display)).toBe("none");
            await page.waitForFunction(() => window.source().querySelector(".hljs-keyword"));
        });
    }
});
