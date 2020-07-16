import {getMarkdown} from "../markdown/getMarkdown";
import {accessLocalStorage} from "../util/compatibility";
import {hasClosestBlock, hasClosestByAttribute} from "../util/hasClosest";
import {log} from "../util/log";
import {getEditorRange, setRangeByWbr} from "../util/selection";
import {inputEvent} from "./inputEvent";

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
    const headingElement = hasClosestByAttribute(range.startContainer, "data-type", "heading") ||
        range.startContainer as HTMLElement;
    if (headingElement) {
        const headingMarkerElement = headingElement.querySelector(".vditor-sv__marker--heading");
        if (headingMarkerElement) {
            range.selectNodeContents(headingMarkerElement);
        }
        if (value === "") {
            document.execCommand("delete");
        } else {
            document.execCommand("insertHTML", false, value);
        }
    }
};

export const processToolbar = (vditor: IVditor, actionBtn: Element, prefix: string, suffix: string) => {
    const range = getEditorRange(vditor.sv.element);
    const commandName = actionBtn.getAttribute("data-type");
    let typeElement = range.startContainer as HTMLElement;
    if (typeElement.nodeType === 3) {
        typeElement = typeElement.parentElement;
    }
    // 添加
    if (vditor.sv.element.childNodes.length === 0) {
        vditor.sv.element.innerHTML = `<span data-type="p" data-block="0"><span data-type="text"><wbr></span></span><span data-type="newline"><br><span style="display: none">
</span></span>`;
        setRangeByWbr(vditor.sv.element, range);
    }
    const blockElement = hasClosestBlock(range.startContainer);
    if (commandName === "line") {
        if (blockElement) {
            const hrHTML = `<div data-type="thematic-break" class="vditor-sv__marker"><span class="vditor-sv__marker">---

</span></div><wbr>`;
            if (blockElement.textContent.trim() === "") {
                blockElement.outerHTML = hrHTML;
            } else {
                blockElement.insertAdjacentHTML("afterend", hrHTML);
            }
        }
    } else if (commandName === "quote") {
        if (blockElement) {
            blockElement.insertAdjacentText("afterbegin", "> ");
            inputEvent(vditor);
            return;
        }
    } else if (commandName === "link") {
        let html;
        if (range.toString() === "") {
            html = `${prefix}${Lute.Caret}${suffix}`;
        } else {
            html = `${prefix}${range.toString()}${suffix.replace(")", Lute.Caret + ")")}`;
        }
        document.execCommand("insertHTML", false, html);
        return;
    } else if (commandName === "italic" || commandName === "bold" || commandName === "strike"
        || commandName === "inline-code" || commandName === "code" || commandName === "table") {
        let html;
        // https://github.com/Vanessa219/vditor/issues/563 代码块不需要后面的 ```
        if (range.toString() === "") {
            html = `${prefix}${Lute.Caret}${commandName === "code" ? "" : suffix}`;
        } else {
            html = `${prefix}${range.toString()}${Lute.Caret}${commandName === "code" ? "" : suffix}`;
        }
        if (commandName === "table") {
            html = "\n" + html;
        }
        document.execCommand("insertHTML", false, html);
        return;
    } else if (commandName === "check" || commandName === "list" || commandName === "ordered-list") {
        if (blockElement) {
            const type = blockElement.getAttribute("data-type");
            let listMarker = "* ";
            if (commandName === "check") {
                listMarker = "* [ ] ";
            } else if (commandName === "ordered-list") {
                listMarker = "1. ";
            }
            if (type !== "ul" && type !== "ol" && type !== "task") {
                blockElement.insertAdjacentText("afterbegin", listMarker);
            } else {
                blockElement.querySelectorAll('[data-type="li-marker"').forEach((item: HTMLElement) => {
                    item.textContent = listMarker;
                });
                if (commandName !== "check") {
                    blockElement.querySelectorAll('[data-type="task-marker"').forEach((item: HTMLElement) => {
                        item.remove();
                    });
                }
            }
            inputEvent(vditor);
            return;
        }
    }
    setRangeByWbr(vditor.sv.element, range);
    processAfterRender(vditor);
};
