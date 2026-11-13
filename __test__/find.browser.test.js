const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const webpack = require("webpack");
const {launchBrowser} = require("./util/launchBrowser");

jest.setTimeout(90000);

describe("find and replace", () => {
    let directory;
    let server;
    let browser;
    let page;
    let origin;

    beforeAll(async () => {
        directory = fs.mkdtempSync(path.join(os.tmpdir(), "vditor-find-browser-"));
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
                response.end('<meta charset="utf-8"><link rel="stylesheet" href="/index.css"><div id="editor"></div>' +
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


    test("source highlights stay visible with input focus and follow scrolling", async () => {
        await page.goto(origin);
        await page.evaluate(async origin => {
            const editor = await new Promise(resolve => {
                const instance = new Vditor("editor", {cdn: origin, i18n: window.VditorI18n, mode: "sv", height: 300,
                    cache: {enable: false}, preview: {mode: "editor"}, value: "Alpha ".repeat(2000),
                    after: () => resolve(instance)});
            });
            const surface = editor.vditor.sv.element;
            surface.style.fontSize = "28px";
            editor.openFind();
            const query = editor.vditor.find.element.querySelector('input[type="search"]');
            query.value = "Alpha";
            query.dispatchEvent(new Event("input", {bubbles: true}));
            await new Promise(resolve => setTimeout(resolve, 160));
            editor.find("Alpha", {index: 1999});
            const mark = document.querySelector(".vditor-find__source mark");
            const bounds = mark.getBoundingClientRect();
            const viewport = surface.getBoundingClientRect();
            const check = (condition, message) => {if (!condition) throw new Error(message);};
            check(document.activeElement === query, "find retains query focus");
            check(mark.textContent === "Alpha" && getComputedStyle(mark).backgroundColor !== "rgba(0, 0, 0, 0)", "current source match is painted");
            check(surface.scrollTop > 0 && bounds.top >= viewport.top && bounds.bottom <= viewport.bottom, "wrapped match is revealed");
            const before = bounds.top;
            const oldScroll = surface.scrollTop;
            surface.scrollTop -= 40;
            surface.dispatchEvent(new Event("scroll"));
            check(Math.abs(mark.getBoundingClientRect().top - before - (oldScroll - surface.scrollTop)) < 1, "highlight follows native scrolling");
            editor.closeFind();
            check(!document.querySelector(".vditor-find__source"), "close removes source overlay");
            editor.destroy();
        }, origin);
    });

    test("mode changes and separate editors retain independent find state", async () => {
        await page.goto(origin);
        await page.evaluate(async origin => {
            const i18n = {...window.VditorI18n};
            delete i18n.find;
            const create = element => new Promise(resolve => {
                const editor = new Vditor(element, {cdn: origin, i18n, mode: "ir", undoDelay: 0,
                    cache: {enable: false}, value: "Alpha [Alpha](https://example.com/Alpha)",
                    toolbar: ["find", "edit-mode"], after: () => resolve(editor)});
            });
            const first = await create(document.getElementById("editor"));
            const host = document.createElement("div");
            document.body.appendChild(host);
            const second = await create(host);
            const check = (condition, message) => {if (!condition) throw new Error(message);};
            check(first.vditor.toolbar.elements.find.querySelector("button").getAttribute("aria-label").startsWith("Find"), "custom dictionaries have a find fallback");
            first.find("Alpha");
            second.find("Alpha");
            check(CSS.highlights.size === 2, "independent highlights");
            first.closeFind();
            check(CSS.highlights.size === 1, "closing one editor preserves the other highlight");
            first.openFind();
            const query = first.vditor.find.element.querySelector('input[type="search"]');
            query.value = "Alpha";
            query.dispatchEvent(new Event("input", {bubbles: true}));
            await new Promise(resolve => setTimeout(resolve, 160));
            const item = first.vditor.toolbar.elements["edit-mode"].querySelector('[data-mode="sv"]');
            item.dispatchEvent(new Event(navigator.userAgent.includes("iPhone") ? "touchstart" : "click", {cancelable: true}));
            check(first.getCurrentMode() === "sv", "mode switch uses toolbar");
            check(first.vditor.find.element.querySelector("output").textContent === "1/3", "source scope includes link destinations");
            first.setValue("new document");
            check(first.vditor.find.element.hidden, "setting a new document closes find");
            first.destroy();
            check(CSS.highlights.size === 1, "destroying one editor preserves the other highlight");
            second.destroy();
            check(CSS.highlights.size === 0, "destroy clears remaining highlights");
        }, origin);
    });

    for (const mode of ["wysiwyg", "ir"]) {
        test(`${mode} literal code replacement survives Markdown round trips`, async () => {
            await page.goto(origin);
            await page.evaluate(async ({mode, origin}) => {
                const editor = await new Promise(resolve => {
                    const instance = new Vditor("editor", {mode, cdn: origin, i18n: window.VditorI18n,
                        undoDelay: 0, cache: {enable: false}, value: "`Alpha`\n\n```txt\nBravo\n```\n",
                        after: () => resolve(instance)});
                });
                const check = (condition, message) => {if (!condition) throw new Error(mode + ": " + message);};
                check(editor.replace("Alpha", "`*literal*`") === 1, "inline code replacement");
                check(editor.find("`*literal*`").total === 1, "inline code stays literal");
                const inline = editor.getValue();
                editor.setValue(inline);
                check(editor.find("`*literal*`").total === 1, "inline code round trip");
                check(editor.replace("Bravo", "```\n<tag> &") === 1, "fenced code replacement");
                const block = editor.getValue();
                editor.setValue(block);
                check(editor.find("```\n<tag> &").total === 1, "fenced code round trip");
                editor.destroy();
            }, {mode, origin});
        });
    }

    for (const mode of ["wysiwyg", "ir", "sv"]) {
        test(`${mode} replacement records pending input and preserves redo`, async () => {
            await page.goto(origin);
            await page.evaluate(async ({mode, origin}) => {
                const editor = await new Promise(resolve => {
                    const instance = new Vditor("editor", {mode, cdn: origin, i18n: window.VditorI18n,
                        undoDelay: 60000, cache: {enable: false}, value: "base", toolbar: ["undo", "redo"],
                        after: () => resolve(instance)});
                });
                const state = editor.vditor;
                const check = (condition, message) => {if (!condition) throw new Error(mode + ": " + message);};
                state.undo.addToUndoStack(state);
                editor.setValue("Alpha Alpha");
                editor.replace("Alpha", "Omega");
                state.undo.undo(state);
                check(editor.getValue().trim() === "Alpha Alpha", "one undo restores pending input");
                state.undo.undo(state);
                check(editor.getValue().trim() === "base", "second undo restores baseline");
                state.undo.redo(state);
                check(editor.getValue().trim() === "Alpha Alpha", "first redo restores input");
                state.undo.redo(state);
                check(editor.getValue().trim() === "Omega Omega", "second redo restores replacement");
                editor.destroy();
            }, {mode, origin});
        });

        for (const width of [1000, 360]) {
            test(`${mode} literal search and replacement at ${width}px`, async () => {
                await page.setViewport({width, height: 720});
                await page.setUserAgent(width === 360 ? "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148" :
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36");
                await page.goto(origin);
                const result = await page.evaluate(async ({mode, origin}) => {
                    const markdown = "# Alpha\n\nAlpha **be**ta and [Alpha](https://example.com/Alpha)\n\n- Alpha\n\n| Name | Value |\n| ---- | ----- |\n| A | Alpha |\n\n```js\nAlpha <tag>\n```\n";
                    const inputs = [];
                    const editor = await new Promise(resolve => {
                        const instance = new Vditor("editor", {mode, cdn: origin, i18n: window.VditorI18n,
                            undoDelay: 0, cache: {enable: false}, value: markdown,
                            toolbar: ["find", "undo", "redo", "edit-mode"],
                            input: value => inputs.push(value), after: () => resolve(instance)});
                    });
                    const tick = () => new Promise(resolve => setTimeout(resolve, 160));
                    await tick();
                    const check = (condition, message) => {if (!condition) throw new Error(mode + ": " + message);};
                    const expected = mode === "sv" ? 7 : 6;
                    check(editor.find("Alpha").total === expected, "counts each code block once and respects link scope");
                    check(editor.find("alpha", {caseSensitive: true}).total === 0, "case-sensitive search");
                    check(editor.find("alpha").total === expected, "case-insensitive search");
                    check(editor.find("").index === -1, "empty query");
                    check(editor.find("Alpha", {index: 100}).index === 0, "out-of-range wraps");
                    check(editor.find("https://example.com/Alpha").total === (mode === "sv" ? 1 : 0), "link destination scope");
                    check(editor.find("beta").total === (mode === "sv" ? 0 : 1), "cross-inline matching");
                    check(editor.find("ValueA").total === 0, "table cell boundary");
                    check(inputs.length === 0, "find does not notify input");
                    if (mode !== "sv") {
                        check(editor.replace("beta", "NEW", {index: 0}) === 1, "cross-inline replacement");
                        check(editor.getValue().includes("**NEW**"), "inline formatting survives");
                    }
                    const before = editor.getValue();
                    check(editor.replace("Alpha", "Omega") === expected, "replace all count");
                    check(editor.find("Omega").total === expected, "replace all changes every result");
                    await tick();
                    const after = editor.getValue();
                    editor.vditor.undo.undo(editor.vditor);
                    await tick();
                    check(editor.getValue() === before, "replace all undoes in one step");
                    editor.vditor.undo.redo(editor.vditor);
                    await tick();
                    check(editor.getValue() === after, "replace all redoes in one step");
                    check(editor.replace("Omega", "*literal* <b> & $&", {index: 0}) === 1, "literal replacement");
                    check(editor.find("*literal* <b> & $&").total === 1, "replacement remains literal");
                    editor.disabled();
                    check(editor.replace("Omega", "blocked") === 0, "disabled replacement");
                    editor.enable();
                    editor.vditor[mode].composingLock = true;
                    check(editor.replace("Omega", "blocked") === 0, "composition replacement");
                    editor.vditor[mode].composingLock = false;
                    const surface = editor.vditor[mode].element;
                    editor.vditor.options.beforeReplace = markdown => {
                        check(markdown.includes("blocked"), "host receives complete replacement");
                        return false;
                    };
                    check(editor.replace("Omega", "blocked") === 0, "host cancellation");
                    editor.vditor.options.beforeReplace = undefined;
                    const findButton = editor.vditor.toolbar.elements.find.querySelector("button");
                    findButton.dispatchEvent(new Event(navigator.userAgent.includes("iPhone") ? "touchstart" : "click", {bubbles: true, cancelable: true}));
                    const panel = editor.vditor.find.element;
                    check(!panel.querySelector(".vditor-find__scope"), "find panel omits the range hint");
                    check(!panel.hidden, "toolbar opens panel");
                    const query = panel.querySelector('input[type="search"]');
                    const navigation = Array.from(panel.querySelector(".vditor-find__row").querySelectorAll("button")).slice(0, 2);
                    check(navigation.map(button => button.textContent).join("/") === "Previous/Next", "navigation uses concise labels");
                    check(navigation.every(button => button.disabled), "empty queries disable navigation");
                    query.value = "no-result";
                    query.dispatchEvent(new Event("input", {bubbles: true}));
                    await tick();
                    check(panel.querySelector("output").textContent === "0/0" && navigation.every(button => button.disabled), "zero matches disable navigation");
                    query.value = "Omega";
                    query.dispatchEvent(new Event("input", {bubbles: true}));
                    await tick();
                    check(panel.querySelector("output").textContent === `1/${expected - 1}`, "panel count");
                    check(navigation.every(button => !button.disabled), "matches enable navigation");
                    navigation[0].click();
                    check(panel.querySelector("output").textContent === `${expected - 1}/${expected - 1}`, "previous wraps to the last match");
                    navigation[1].click();
                    check(panel.querySelector("output").textContent === `1/${expected - 1}`, "next wraps to the first match");
                    query.value = "";
                    query.dispatchEvent(new Event("input", {bubbles: true}));
                    await tick();
                    check(navigation.every(button => button.disabled), "clearing the query disables navigation");
                    query.value = "Omega";
                    query.dispatchEvent(new Event("input", {bubbles: true}));
                    await tick();
                    check(document.activeElement === query, "search keeps input focus");
                    check(panel.scrollWidth <= panel.clientWidth, "narrow panel does not overflow");
                    panel.querySelector('button[aria-expanded]').click();
                    const replacement = panel.querySelector('input:not([type="search"]):not([type="checkbox"])');
                    replacement.value = "OmegaOmega";
                    replacement.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter", bubbles: true, cancelable: true}));
                    check(panel.querySelector("output").textContent === `3/${expected}`, "single replacement skips its inserted matches");
                    const beforeAll = editor.getValue();
                    const row = replacement.parentElement;
                    row.querySelectorAll("button")[1].click();
                    check(editor.find("Omega").total === expected * 2, "panel replace all");
                    editor.vditor.undo.undo(editor.vditor);
                    await tick();
                    check(editor.getValue() === beforeAll, "panel replace all undo");
                    editor.setTheme("dark");
                    const highlightCount = CSS.highlights?.size || 0;
                    editor.closeFind();
                    check(panel.hidden, "public close");
                    check(!CSS.highlights?.size, "close clears highlight");
                    check(!document.querySelector(".vditor-find__source"), "close clears source highlight");
                    surface.dispatchEvent(new KeyboardEvent("keydown", {key: "f", ctrlKey: true, bubbles: true, cancelable: true}));
                    check(!panel.hidden, "scoped shortcut opens panel");
                    query.dispatchEvent(new KeyboardEvent("keydown", {key: "Escape", bubbles: true, cancelable: true}));
                    check(panel.hidden, "escape closes panel");
                    editor.destroy();
                    check(!document.querySelector(".vditor-find"), "destroy removes panel");
                    check(!CSS.highlights?.size, "destroy clears highlight");
                    return {inputs: inputs.length, highlightCount};
                }, {mode, origin});
                expect(result.inputs).toBeGreaterThan(0);
            });
        }
    }
});
