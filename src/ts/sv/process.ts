import {getMarkdown} from "../markdown/getMarkdown";
import {accessLocalStorage} from "../util/compatibility";

export const replaceSelection = (vditor: IVditor, text: string, selectionMode: SelectionMode = "end") => {
    const element = vditor.sv.element;
    element.setRangeText(text, element.selectionStart, element.selectionEnd, selectionMode);
    element.focus();
};

export const processPaste = (vditor: IVditor, text: string) => {
    replaceSelection(vditor, text);
};

export const processAfterRender = (vditor: IVditor, options = {
    enableAddUndoStack: true,
    enableHint: false,
    enableInput: true,
}) => {
    vditor.preview.render(vditor);

    const text = getMarkdown(vditor);
    if (typeof vditor.options.input === "function" && options.enableInput) {
        vditor.options.input(text);
    }

    if (vditor.options.counter.enable) {
        vditor.counter.render(vditor, text);
    }

    if (vditor.options.cache.enable && accessLocalStorage()) {
        localStorage.setItem(vditor.options.cache.id, text);
        if (vditor.options.cache.after) {
            vditor.options.cache.after(text);
        }
    }

    if (vditor.devtools) {
        vditor.devtools.renderEchart(vditor);
    }

    clearTimeout(vditor.sv.processTimeoutId);
    vditor.sv.processTimeoutId = window.setTimeout(() => {
        if (options.enableAddUndoStack && !vditor.sv.composingLock) {
            vditor.undo.addToUndoStack(vditor);
        }
    }, vditor.options.undoDelay);
};

export const processHeading = (vditor: IVditor, value: string) => {
    const element = vditor.sv.element;
    const lineStart = element.value.lastIndexOf("\n", element.selectionStart - 1) + 1;
    const lineEndIndex = element.value.indexOf("\n", element.selectionEnd);
    const lineEnd = lineEndIndex === -1 ? element.value.length : lineEndIndex;
    const selectedLines = element.value.substring(lineStart, lineEnd);
    const heading = value ? value + selectedLines.replace(/^#{1,6}\s+/, "") : selectedLines.replace(/^#{1,6}\s+/, "");
    element.setRangeText(heading, lineStart, lineEnd, "select");
    element.focus();
    processAfterRender(vditor);
};

export const processToolbar = (vditor: IVditor, actionBtn: Element, prefix: string, suffix: string) => {
    const element = vditor.sv.element;
    const commandName = actionBtn.getAttribute("data-type");
    const start = element.selectionStart;
    const end = element.selectionEnd;
    const selectedText = element.value.substring(start, end);
    let text = "";
    let selectionStart = start + prefix.length;
    let selectionEnd = selectionStart + selectedText.length;

    if (commandName === "check" || commandName === "list" || commandName === "ordered-list" ||
        commandName === "quote") {
        const lineStart = element.value.lastIndexOf("\n", start - 1) + 1;
        const lineEndIndex = element.value.indexOf("\n", end);
        const lineEnd = lineEndIndex === -1 ? element.value.length : lineEndIndex;
        const lines = element.value.substring(lineStart, lineEnd);
        text = lines.split("\n").map((line) => prefix + line).join("\n");
        element.setRangeText(text, lineStart, lineEnd, "select");
    } else if (commandName === "line") {
        text = `${start === 0 ? "" : "\n\n"}${prefix}\n`;
        element.setRangeText(text, start, end, "end");
    } else if (commandName === "code") {
        text = `${prefix}\n${selectedText}${suffix}`;
        element.setRangeText(text, start, end, "end");
        selectionStart = start + prefix.length + 1;
        selectionEnd = selectionStart + selectedText.length;
        element.setSelectionRange(selectionStart, selectionEnd);
    } else if (commandName === "table") {
        text = `${start === 0 ? "" : "\n\n"}${prefix}${suffix}`;
        element.setRangeText(text, start, end, "end");
    } else {
        text = `${prefix}${selectedText}${suffix}`;
        element.setRangeText(text, start, end, "end");
        element.setSelectionRange(selectionStart, selectionEnd);
    }

    element.focus();
    processAfterRender(vditor);
};
