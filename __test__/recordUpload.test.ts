/** @jest-environment jsdom */
import {Record} from "../src/ts/toolbar/Record";

jest.mock("../src/ts/constants", () => ({Constants: {CLASS_MENU_DISABLED: "disabled"}}));
jest.mock("../src/ts/toolbar/MenuItem", () => ({MenuItem: class {
    public element = document.createElement("div");
    constructor() { this.element.appendChild(document.createElement("button")); }
}}));
jest.mock("../src/ts/util/compatibility", () => ({getEventName: () => "click"}));
jest.mock("../src/ts/util/RecordMedia", () => ({RecordMedia: class {
    public recorder = {};
    public isRecording = false;
    public startRecordingNewWavFile() { this.isRecording = true; }
    public stopRecording() { this.isRecording = false; }
    public buildWavFileBlob() { return new Blob(["audio"]); }
}}));
jest.mock("../src/ts/sv/process", () => ({processAfterRender: jest.fn(), processPaste: jest.fn()}));
jest.mock("../src/ts/util/selection", () => ({}));

describe("recording with custom upload", () => {
    it.each(["sv", "ir", "wysiwyg"])("restores %s editing before handing off upload", async (mode) => {
        Object.defineProperty(navigator, "mediaDevices", {configurable: true, value: {
            getUserMedia: () => Promise.resolve({}),
        }});
        (window as any).VditorI18n = {recording: "recording"};
        (globalThis as any).DataTransferItem = class {};
        const element = document.createElement(mode === "sv" ? "textarea" : "div");
        element.setAttribute("contenteditable", "true");
        let lockedDuringUpload = true;
        const handler = jest.fn(async () => {
            lockedDuringUpload = !!(element as HTMLTextAreaElement).disabled || element.getAttribute("contenteditable") === "false";
        });
        const vditor = {
            currentMode: mode, [mode]: {element},
            options: {upload: {handler, multiple: true}}, tip: {show: jest.fn(), hide: jest.fn()},
        } as any;
        const record = new Record(vditor, {name: "record"});
        const button = record.element.firstElementChild as HTMLElement;
        button.click();
        await Promise.resolve();
        await Promise.resolve();
        expect(mode === "sv" ? (element as HTMLTextAreaElement).disabled : element.getAttribute("contenteditable") === "false").toBe(true);
        button.click();
        await Promise.resolve();
        expect(handler).toHaveBeenCalledTimes(1);
        expect(lockedDuringUpload).toBe(false);
        expect(mode === "sv" ? (element as HTMLTextAreaElement).disabled : element.getAttribute("contenteditable") === "false").toBe(false);
    });
});
