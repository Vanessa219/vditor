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

    for (const mode of ["wysiwyg", "ir", "sv"]) {
        const createDelayedEditor = async (toolbar) => {
            await page.goto(origin);
            await page.evaluate(async ({mode, origin, toolbar}) => {
                window.editor = await new Promise(resolve => {
                    const editor = new Vditor("editor", {mode, cdn: origin,
                        _lutePath: origin + "/js/lute/lute.min.js", i18n: window.VditorI18n,
                        undoDelay: 60000, cache: {enable: false}, toolbar, value: "base",
                        after: () => resolve(editor)});
                });
                const state = window.editor.vditor;
                state.undo.addToUndoStack(state);
                window.editor.setValue("start");
                const surface = state[mode].element;
                surface.focus();
                if (mode === "sv") surface.setSelectionRange(surface.value.length, surface.value.length);
                else {
                    const range = document.createRange();
                    range.selectNodeContents(surface.lastElementChild);
                    range.collapse(false);
                    getSelection().removeAllRanges();
                    getSelection().addRange(range);
                }
                state.undo.addToUndoStack(state);
            }, {mode, origin, toolbar});
        };

        it(`undoes pending native keystrokes with visible and hidden toolbar actions in ${mode}`, async () => {
            for (const toolbar of [["undo", "redo"], []]) {
                await createDelayedEditor(toolbar);
                await page.keyboard.type("abc");
                await page.keyboard.down("Control");
                await page.keyboard.press("z");
                await page.keyboard.up("Control");
                expect(await page.evaluate(() => window.editor.getValue().trimEnd())).toBe("start");
                await page.keyboard.down("Control");
                await page.keyboard.press("y");
                await page.keyboard.up("Control");
                expect(await page.evaluate(() => window.editor.getValue().trimEnd())).toBe("startabc");
            }
        });

        it(`routes native history events through one editor history action in ${mode}`, async () => {
            await createDelayedEditor(["undo", "redo"]);
            await page.keyboard.type("abc");
            expect(await page.evaluate(() => {
                const state = window.editor.vditor;
                const surface = state[state.currentMode].element;
                const values = [];
                const cancelled = [];
                for (const inputType of ["historyUndo", "historyRedo"]) {
                    cancelled.push(!surface.dispatchEvent(new InputEvent("beforeinput", {
                        inputType, bubbles: true, cancelable: true,
                    })));
                    values.push(window.editor.getValue().trimEnd());
                }
                return {values, cancelled};
            })).toEqual({values: ["start", "startabc"], cancelled: [true, true]});
        });

        it(`preserves composition and read-only state for native history events in ${mode}`, async () => {
            await createDelayedEditor(["undo", "redo"]);
            await page.keyboard.type("abc");
            expect(await page.evaluate(() => {
                const state = window.editor.vditor;
                const surface = state[state.currentMode].element;
                state[state.currentMode].composingLock = true;
                surface.dispatchEvent(new InputEvent("beforeinput", {
                    inputType: "historyUndo", cancelable: true, bubbles: true,
                }));
                const composing = window.editor.getValue().trimEnd();
                state[state.currentMode].composingLock = false;
                window.editor.disabled();
                surface.dispatchEvent(new InputEvent("beforeinput", {
                    inputType: "historyUndo", cancelable: true, bubbles: true,
                }));
                return {composing, disabled: window.editor.getValue().trimEnd()};
            })).toEqual({composing: "startabc", disabled: "startabc"});
        });

        for (const initialValue of ["", "start"]) {
            it(`keeps the caret inside a markerless ${JSON.stringify(initialValue)} undo snapshot in ${mode}`, async () => {
                await page.goto(origin);
                await page.evaluate(async ({mode, origin, initialValue}) => {
                    window.editor = await new Promise(resolve => {
                        let editor;
                        editor = new Vditor("editor", {mode, cdn: origin, _lutePath: origin + "/js/lute/lute.min.js",
                            i18n: window.VditorI18n, undoDelay: 0, cache: {enable: false},
                            toolbar: ["undo", "redo"], value: initialValue, after: () => resolve(editor)});
                    });
                    const surface = window.editor.vditor[mode].element;
                    surface.focus();
                    if (mode === "sv") surface.setSelectionRange(surface.value.length, surface.value.length);
                    else {
                        const range = document.createRange();
                        range.selectNodeContents(surface);
                        range.collapse(false);
                        getSelection().removeAllRanges();
                        getSelection().addRange(range);
                    }
                }, {mode, origin, initialValue});
                await page.keyboard.type("a");
                for (let iteration = 0; iteration < 2; iteration++) {
                    expect(await page.evaluate((iteration) => {
                        const state = window.editor.vditor;
                        // The fallback must also work without an existing selection.
                        if (iteration === 0) getSelection().removeAllRanges();
                        else {
                            const outside = document.createElement("input");
                            document.body.append(outside);
                            outside.focus();
                        }
                        state.undo.undo(state);
                        const surface = state[state.currentMode].element;
                        return {value: window.editor.getValue().trim(), focused: document.activeElement === surface,
                            caret: state.currentMode === "sv" ? surface.selectionStart === surface.value.length :
                                surface.contains(getSelection().anchorNode)};
                    }, iteration)).toEqual({value: initialValue, focused: true, caret: true});
                    if (iteration === 0) {
                        expect(await page.evaluate(() => {
                            window.editor.vditor.undo.redo(window.editor.vditor);
                            return window.editor.getValue().trim();
                        })).toBe(initialValue + "a");
                    }
                }
                await page.keyboard.type("next");
                expect(await page.evaluate(() => window.editor.getValue().trim())).toBe(initialValue + "next");
            });
        }
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
