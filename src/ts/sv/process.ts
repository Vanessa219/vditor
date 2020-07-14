import {getMarkdown} from "../markdown/getMarkdown";
import {accessLocalStorage} from "../util/compatibility";
import {hasClosestBlock, hasClosestByAttribute} from "../util/hasClosest";
import {getEditorRange, setRangeByWbr} from "../util/selection";
import {highlightToolbarSV} from "./highlightToolbarSV";
import {inputEvent} from "./inputEvent";

export const processAfterRender = (vditor: IVditor, options = {
    enableAddUndoStack: true,
    enableHint: false,
    enableInput: true,
}) => {
    if (options.enableHint) {
        vditor.hint.render(vditor);
    }
    vditor.preview.render(vditor);
    clearTimeout(vditor.sv.processTimeoutId);
    vditor.sv.processTimeoutId = window.setTimeout(() => {
        if (vditor.sv.composingLock) {
            return;
        }

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

        if (options.enableAddUndoStack) {
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
        highlightToolbarSV(vditor);
    }
};

const removeInline = (range: Range, vditor: IVditor, type: string) => {
    const inlineElement = hasClosestByAttribute(range.startContainer, "data-type", type) as HTMLElement;
    if (inlineElement) {
        inlineElement.firstElementChild.remove();
        inlineElement.lastElementChild.remove();
        range.insertNode(document.createElement("wbr"));
        inlineElement.outerHTML = inlineElement.firstElementChild.innerHTML;
    }
};

export const processToolbar = (vditor: IVditor, actionBtn: Element, prefix: string, suffix: string) => {
    const range = getEditorRange(vditor.sv.element);
    const commandName = actionBtn.getAttribute("data-type");
    let typeElement = range.startContainer as HTMLElement;
    if (typeElement.nodeType === 3) {
        typeElement = typeElement.parentElement;
    }
    // 移除
    if (actionBtn.classList.contains("vditor-menu--current")) {
        if (commandName === "quote") {
            const quoteElement = hasClosestByAttribute(range.startContainer, "data-type", "blockquote");
            if (quoteElement) {
                quoteElement.querySelectorAll('[data-type="blockquote-line"]').forEach((item: HTMLElement) => {
                    item.firstElementChild.remove();
                });
                inputEvent(vditor);
                highlightToolbarSV(vditor);
                return;
            }
        } else if (commandName === "link") {
            const aElement = hasClosestByAttribute(range.startContainer, "data-type", "a") as HTMLElement;
            if (aElement) {
                const aTextElement = hasClosestByAttribute(range.startContainer, "data-type", "link-text");
                if (aTextElement) {
                    range.insertNode(document.createElement("wbr"));
                    aElement.outerHTML = aTextElement.innerHTML;
                } else {
                    aElement.outerHTML = aElement.querySelector('[data-type="link-text"]').innerHTML + "<wbr>";
                }
            }
        } else if (commandName === "italic") {
            removeInline(range, vditor, "em");
        } else if (commandName === "bold") {
            removeInline(range, vditor, "strong");
        } else if (commandName === "strike") {
            removeInline(range, vditor, "s");
        } else if (commandName === "inline-code") {
            removeInline(range, vditor, "code");
        } else if (commandName === "check" || commandName === "list" || commandName === "ordered-list") {
            const listElement = hasClosestBlock(range.startContainer);
            if (listElement) {
                listElement.querySelectorAll('[data-type="li-marker"').forEach((item: HTMLElement) => {
                    item.remove();
                });
                listElement.querySelectorAll('[data-type="task-marker"').forEach((item: HTMLElement) => {
                    item.remove();
                });
                inputEvent(vditor);
                highlightToolbarSV(vditor);
                return;
            }
        }
    } else {
        // 添加
        if (vditor.sv.element.childNodes.length === 0) {
            vditor.sv.element.innerHTML = `<div data-type="p" data-block="0"><span data-type="text"><wbr></span><span data-type="newline"><br><span style="display: none">
</span></span></div>`;
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
                highlightToolbarSV(vditor);
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
            highlightToolbarSV(vditor);
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
            highlightToolbarSV(vditor);
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
                highlightToolbarSV(vditor);
                return;
            }
        }
    }
    setRangeByWbr(vditor.sv.element, range);
    processAfterRender(vditor);
    highlightToolbarSV(vditor);
};
