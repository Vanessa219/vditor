import {isCtrl} from "../util/compatibility";
import {fixTab} from "../util/fixBrowserBehavior";
import {hasClosestByAttribute, hasClosestByClassName} from "../util/hasClosest";
import {getEditorRange, getSelectPosition, setRangeByWbr} from "../util/selection";
import {inputEvent} from "./inputEvent";
import {processAfterRender} from "./process";

export const processKeydown = (vditor: IVditor, event: KeyboardEvent) => {
    vditor.sv.composingLock = event.isComposing;
    if (event.isComposing) {
        return false;
    }

    if (event.key.indexOf("Arrow") === -1) {
        vditor.undo.recordFirstPosition(vditor, event);
    }
    // 仅处理以下快捷键操作
    if (event.key !== "Enter" && event.key !== "Tab" && event.key !== "Backspace" && event.key.indexOf("Arrow") === -1
        && !isCtrl(event) && event.key !== "Escape") {
        return false;
    }
    const range = getEditorRange(vditor.sv.element);
    const startContainer = range.startContainer;

    // blockquote
    const blockquoteLineElement = hasClosestByAttribute(startContainer, "data-type", "blockquote-line");
    if (blockquoteLineElement) {
        const startIndex = getSelectPosition(blockquoteLineElement, range).start;
        if (event.key === "Enter" && !isCtrl(event) && !event.altKey) {
            if (startIndex === 2 && blockquoteLineElement.firstElementChild) {
                // 在 marker 中换行，删除 marker 标记
                blockquoteLineElement.firstElementChild.remove();
                event.preventDefault();
                return true;
            } else if (blockquoteLineElement.textContent.trim() !== "") {
                // 换行应延续 >
                range.insertNode(document.createTextNode("\n>"));
                range.collapse(false);
                inputEvent(vditor);
                event.preventDefault();
                return true;
            }
        }
        // 光标在每一行的第一个字符后删除
        if (event.key === "Backspace" && !isCtrl(event) && !event.altKey && !event.shiftKey && startIndex === 1) {
            range.setStart(startContainer, 0);
            range.extractContents();
            if (blockquoteLineElement.firstElementChild.textContent === "") {
                blockquoteLineElement.firstElementChild.remove();
            }
            event.preventDefault();
            return true;
        }
    }

    // list item
    const listElement = hasClosestByAttribute(startContainer, "data-type", "li");
    if (listElement) {
        const markerElement = listElement.querySelector('[data-type="li-marker"]');
        const startIndex = getSelectPosition(listElement, range).start;
        const space = listElement.getAttribute("data-space");
        // 回车
        if (event.key === "Enter" && !isCtrl(event) && !event.altKey) {
            if (markerElement && startIndex ===
                markerElement.textContent.length + space.length) {
                // 清空列表标记符
                if (space === "") {
                    markerElement.remove();
                } else {
                    markerElement.previousElementSibling.remove();
                    inputEvent(vditor);
                }
            } else {
                // 添加标记符号
                range.insertNode(document.createTextNode("\n" +
                    (markerElement ? space + markerElement.textContent : "")));
                range.collapse(false);
                inputEvent(vditor);
            }
            event.preventDefault();
            return true;
        }
        // 光标在每一行的第一个字符后删除
        if (event.key === "Backspace" && !isCtrl(event) && !event.altKey && !event.shiftKey) {
            const firstElement = hasClosestByAttribute(startContainer, "data-type", "li-marker") ||
                hasClosestByAttribute(startContainer, "data-type", "li-space");
            if (firstElement && startIndex === 1) {
                range.setStart(startContainer, 0);
                range.extractContents();
                if (firstElement.textContent === "") {
                    firstElement.remove();
                }
                event.preventDefault();
                return true;
            }
        }
        if (event.key === "Tab" && markerElement && startIndex === markerElement.textContent.length + space.length) {
            markerElement.insertAdjacentHTML("beforebegin",
                `<span data-type="li-space">${markerElement.textContent.replace(/\S/g, " ")}</span>`);
            inputEvent(vditor);
            event.preventDefault();
            return true;
        }
    }

    // 代码块
    const preElement = hasClosestByClassName(startContainer, "vditor-sv__marker--pre");
    if (preElement && event.key === "Backspace" && !isCtrl(event) && !event.shiftKey && !event.altKey) {
        // Backspace: 光标位于第零个字符，仅删除代码块标签
        const codePosition = getSelectPosition(preElement, range);
        if ((codePosition.start === 0 ||
            (codePosition.start === 1 && preElement.innerText === "\n")) // 空代码块，光标在 \n 后
            && range.toString() === "") {
            preElement.parentElement.outerHTML =
                `<p data-block="0"><wbr>${preElement.firstElementChild.innerHTML}</p>`;
            setRangeByWbr(vditor[vditor.currentMode].element, range);
            processAfterRender(vditor);
            event.preventDefault();
            return true;
        }
    }

    // 代码块语言或飘号后
    const codeInfoElement = hasClosestByAttribute(startContainer, "data-type", "code-block-info") ||
        hasClosestByAttribute(startContainer, "data-type", "code-block-open-marker") ||
        hasClosestByAttribute(startContainer, "data-type", "math-block-open-marker");
    if (codeInfoElement && (event.key === "Enter" || event.key === "Tab")) {
        // 回车/tab 到代码块中
        range.selectNodeContents(codeInfoElement.parentElement.querySelector("code"));
        range.collapse(true);
        event.preventDefault();
        return true;
    }

    // tab
    if (fixTab(vditor, range, event)) {
        return true;
    }

    // 回车，除 list item 外
    if (event.key === "Enter" && !isCtrl(event) && !event.altKey) {
        // 添加 \n
        range.insertNode(document.createTextNode("\n"));
        range.collapse(false);
        event.preventDefault();
        return true;
    }

    // 删除后光标前有 newline 的处理
    const blockElement = hasClosestByAttribute(startContainer, "data-block", "0");
    if (blockElement && event.key === "Backspace" && !isCtrl(event) && !event.altKey && !event.shiftKey) {
        const startIndex = getSelectPosition(blockElement, range).start;
        // 光标在每一行的开始位置
        if (startIndex === 0 && blockElement.previousElementSibling &&
            blockElement.previousElementSibling.lastElementChild.getAttribute("data-type") === "newline") {
            blockElement.previousElementSibling.lastElementChild.remove();
            if (blockElement.textContent.trim() !== "") {
                inputEvent(vditor);
            }
            event.preventDefault();
            return true;
        }
        // 光标在每一行的第一个字符后, list item、blockquote line 处理在上方
        const textElement = hasClosestByAttribute(startContainer, "data-type", "text");
        if (textElement && range.startOffset === 1 && textElement.previousElementSibling &&
            textElement.previousElementSibling.getAttribute("data-type") === "newline") {
            range.setStart(startContainer, 0);
            range.extractContents();
            event.preventDefault();
            return true;
        }
    }
    return false;
};
