import {getMarkdown} from "../markdown/getMarkdown";
import {accessLocalStorage} from "../util/compatibility";
import {hasClosestBlock} from "../util/hasClosest";
import {hasClosestByTag} from "../util/hasClosestByHeadings";
import {log} from "../util/log";
import {getEditorRange, setRangeByWbr} from "../util/selection";
import {inputEvent} from "./inputEvent";

const getPreviousNL = (spanElement: Element) => {
    let previousElement = spanElement;
    while (previousElement && previousElement.getAttribute("data-type") !== "newline") {
        previousElement = previousElement.previousElementSibling;
    }
    if (previousElement && previousElement.getAttribute("data-type") === "newline") {
        return previousElement;
    }
    return false;
};
export const processSpinVditorSVDOM = (html: string, vditor: IVditor) => {
    log("SpinVditorSVDOM", html, "argument", vditor.options.debugger);
    html = "<div data-block='0'>" +
        vditor.lute.SpinVditorSVDOM(html).replace(/<span data-type="newline"><br \/><span style="display: none">\n<\/span><\/span><span data-type="newline"><br \/><span style="display: none">\n<\/span><\/span></g, '<span data-type="newline"><br /><span style="display: none">\n</span></span><span data-type="newline"><br /><span style="display: none">\n</span></span></div><div data-block="0"><') +
        "</div>";
    log("SpinVditorSVDOM", html, "result", vditor.options.debugger);
    return html;
};

export const processPreviousMarkers = (textElement: HTMLElement) => {
    let previousElement = textElement.previousElementSibling;
    let markerText = "";
    while (previousElement && (previousElement.getAttribute("data-type") === "li-marker" ||
        previousElement.getAttribute("data-type") === "blockquote-marker" ||
        previousElement.getAttribute("data-type") === "task-marker" ||
        previousElement.getAttribute("data-type") === "padding")) {
        markerText = previousElement.textContent + markerText;
        previousElement = previousElement.previousElementSibling;
    }
    return markerText;
};

export const processAfterRender = (vditor: IVditor, options = {
    enableAddUndoStack: true,
    enableHint: false,
    enableInput: true,
}) => {
    if (options.enableHint) {
        vditor.hint.render(vditor);
    }

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
    }, 800);
};

export const processHeading = (vditor: IVditor, value: string) => {
    const range = getEditorRange(vditor.sv.element);
    const headingElement = hasClosestByTag(range.startContainer, "SPAN");
    if (headingElement && headingElement.textContent.trim() !== "") {
        value = "\n" + value;
    }
    range.collapse(true);
    document.execCommand("insertHTML", false, value);
};

export const processToolbar = (vditor: IVditor, actionBtn: Element, prefix: string, suffix: string) => {
    const range = getEditorRange(vditor.sv.element);
    const commandName = actionBtn.getAttribute("data-type");
    // 添加
    if (vditor.sv.element.childNodes.length === 0) {
        vditor.sv.element.innerHTML = `<span data-type="p" data-block="0"><span data-type="text"><wbr></span></span><span data-type="newline"><br><span style="display: none">
</span></span>`;
        setRangeByWbr(vditor.sv.element, range);
    }
    const blockElement = hasClosestBlock(range.startContainer);
    const spanElement = hasClosestByTag(range.startContainer, "SPAN");
    if (!blockElement) {
        return;
    }
    if (commandName === "link") {
        let html;
        if (range.toString() === "") {
            html = `${prefix}${Lute.Caret}${suffix}`;
        } else {
            html = `${prefix}${range.toString()}${suffix.replace(")", Lute.Caret + ")")}`;
        }
        document.execCommand("insertHTML", false, html);
        return;
    } else if (commandName === "italic" || commandName === "bold" || commandName === "strike" ||
        commandName === "inline-code" || commandName === "code" || commandName === "table" || commandName === "line") {
        let html;
        // https://github.com/Vanessa219/vditor/issues/563 代码块不需要后面的 ```
        if (range.toString() === "") {
            html = `${prefix}${Lute.Caret}${commandName === "code" ? "" : suffix}`;
        } else {
            html = `${prefix}${range.toString()}${Lute.Caret}${commandName === "code" ? "" : suffix}`;
        }
        if (commandName === "table" || (commandName === "code" && spanElement && spanElement.textContent !== "")) {
            html = "\n\n" + html;
        } else if (commandName === "line") {
            html = `\n\n${prefix}\n${Lute.Caret}`;
        }
        document.execCommand("insertHTML", false, html);
        return;
    } else if (commandName === "check" || commandName === "list" || commandName === "ordered-list" ||
        commandName === "quote") {
        if (spanElement) {
            let marker = "* ";
            if (commandName === "check") {
                marker = "* [ ] ";
            } else if (commandName === "ordered-list") {
                marker = "1. ";
            } else if (commandName === "quote") {
                marker = "> ";
            }
            const newLine = getPreviousNL(spanElement);
            if (newLine) {
                newLine.insertAdjacentText("afterend", marker);
            } else {
                blockElement.insertAdjacentText("afterbegin", marker);
            }
            inputEvent(vditor);
            return;
        }
    }
    setRangeByWbr(vditor.sv.element, range);
    processAfterRender(vditor);
};
