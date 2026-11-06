/** @jest-environment jsdom */

(global as any).VDITOR_VERSION = "test";
(global as any).TextDecoder = require("util").TextDecoder;
(global as any).TextEncoder = require("util").TextEncoder;

jest.mock("../../src/ts/toolbar/setToolbar", () => ({
    enableToolbar: jest.fn(), disableToolbar: jest.fn(), hidePanel: jest.fn(), removeCurrentToolbar: jest.fn(),
}));
jest.mock("../../src/ts/util/editorCommonEvent", () => ({scrollCenter: jest.fn()}));
jest.mock("../../src/ts/util/highlightToolbar", () => ({highlightToolbar: jest.fn()}));
jest.mock("../../src/ts/util/toc", () => ({renderToc: jest.fn()}));
jest.mock("diff-match-patch", () => {
    const implementation = jest.requireActual("diff-match-patch");
    implementation.__esModule = true;
    return implementation;
});

import {Undo} from "../../src/ts/undo";
import {getMarkdown} from "../../src/ts/markdown/getMarkdown";
import {processAfterRender as renderIR} from "../../src/ts/ir/process";
import {processAfterRender as renderSV} from "../../src/ts/sv/process";
import {afterRenderEvent as renderWysiwyg} from "../../src/ts/wysiwyg/afterRenderEvent";

require("../../src/js/lute/lute.min.js");

describe.each(["wysiwyg", "ir", "sv"] as const)("undo granularity in %s", (mode) => {
    let vditor: IVditor;
    let element: HTMLElement | HTMLTextAreaElement;
    let render: typeof renderIR;

    const setValue = (value: string, offset?: number) => {
        if (mode === "sv") {
            const textarea = element as HTMLTextAreaElement;
            textarea.value = value;
            textarea.setSelectionRange(offset ?? value.length, offset ?? value.length);
        } else {
            element.innerHTML = mode === "ir" ? vditor.lute.Md2VditorIRDOM(value) : vditor.lute.Md2VditorDOM(value);
            const range = document.createRange();
            range.selectNodeContents(element.lastElementChild || element);
            range.collapse(false);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
        }
    };
    const edit = (value: string) => {setValue(value); render(vditor);};
    const value = () => getMarkdown(vditor).trimEnd();

    beforeEach(() => {
        jest.useFakeTimers();
        element = document.createElement(mode === "sv" ? "textarea" : "div");
        element.setAttribute("contenteditable", "true");
        document.body.replaceChildren(element);
        render = mode === "ir" ? renderIR : mode === "sv" ? renderSV : renderWysiwyg;
        vditor = {
            currentMode: mode, [mode]: {element, composingLock: false}, lute: (global as any).Lute.New(),
            undo: new Undo(), toolbar: {elements: {}}, preview: {render: jest.fn()},
            options: {input: jest.fn(), undoDelay: 0, counter: {enable: false}, cache: {enable: false},
                preview: {markdown: {imageCaption: false}}},
        } as unknown as IVditor;
        setValue("start");
        vditor.undo.addToUndoStack(vditor);
    });
    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        document.body.replaceChildren();
    });

    it("records rapid edits synchronously and supports immediate undo and redo", () => {
        edit("starta");
        edit("startab");
        edit("startabc");
        for (const expected of ["startab", "starta", "start"]) {
            vditor.undo.undo(vditor);
            expect(value()).toBe(expected);
        }
        for (const expected of ["starta", "startab", "startabc"]) {
            vditor.undo.redo(vditor);
            expect(value()).toBe(expected);
        }
        jest.runOnlyPendingTimers();
        vditor.undo.undo(vditor);
        expect(value()).toBe("startab");
    });

    it("keeps deletion, paste and formatting as separate completed edits", () => {
        edit("star");
        edit("star pasted text");
        edit("**star pasted text**");
        for (const expected of ["star pasted text", "star", "start"]) {
            vditor.undo.undo(vditor);
            expect(value()).toBe(expected);
        }
    });

    it("ignores composition candidates and records one completed composition", () => {
        vditor[mode].composingLock = true;
        edit("startn");
        edit("startni");
        vditor[mode].composingLock = false;
        edit("start你");
        render(vditor);
        vditor.undo.undo(vditor);
        expect(value()).toBe("start");
        vditor.undo.redo(vditor);
        expect(value()).toBe("start你");
    });

    it("does not create history for caret movement or discard redo without content changes", () => {
        edit("starta");
        vditor.undo.undo(vditor);
        if (mode === "sv") {
            (element as HTMLTextAreaElement).setSelectionRange(0, 0);
        } else {
            const range = document.createRange();
            range.selectNodeContents(element.firstElementChild);
            range.collapse(true);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
        }
        render(vditor);
        vditor.undo.redo(vditor);
        expect(value()).toBe("starta");
        vditor.undo.undo(vditor);
        edit("replacement");
        vditor.undo.redo(vditor);
        expect(value()).toBe("replacement");
    });

    it("preserves positive undoDelay batching", () => {
        vditor.options.undoDelay = 800;
        edit("starta");
        edit("startab");
        jest.advanceTimersByTime(800);
        vditor.undo.undo(vditor);
        expect(value()).toBe("start");
    });
});
