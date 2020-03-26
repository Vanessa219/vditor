import {Constants} from "../constants";
import {isCtrl} from "../util/compatibility";
import {scrollCenter} from "../util/editorCommenEvent";
import {fixBlockquote, fixCodeBlock, fixList, fixMarkdown, fixTab, fixTable, fixTask} from "../util/fixBrowserBehavior";
import {hasClosestByAttribute, hasClosestByClassName, hasClosestByMatchTag} from "../util/hasClosest";
import {getSelectPosition, setRangeByWbr} from "../util/selection";

export const processKeydown = (vditor: IVditor, event: KeyboardEvent) => {
    vditor.ir.composingLock = event.isComposing;
    if (event.isComposing) {
        return false;
    }

    // 添加第一次记录 undo 的光标
    if (event.key.indexOf("Arrow") === -1) {
        vditor.irUndo.recordFirstWbr(vditor, event);
    }

    // 仅处理以下快捷键操作
    if (event.key !== "Enter" && event.key !== "Tab" && event.key !== "Backspace" && event.key.indexOf("Arrow") === -1
        && !isCtrl(event) && event.key !== "Escape") {
        return false;
    }

    const range = getSelection().getRangeAt(0);
    const startContainer = range.startContainer;

    // 斜体、粗体、内联代码块中换行
    const newlineElement = hasClosestByAttribute(startContainer, "data-newline", "1");
    if (!isCtrl(event) && !event.altKey && !event.shiftKey && event.key === "Enter" && newlineElement
        && range.startOffset < newlineElement.textContent.length) {
        const beforeMarkerElement = newlineElement.previousElementSibling;
        if (beforeMarkerElement) {
            range.insertNode(document.createTextNode(beforeMarkerElement.textContent));
            range.collapse(false);
        }
        const afterMarkerElement = newlineElement.nextSibling;
        if (afterMarkerElement) {
            range.insertNode(document.createTextNode(afterMarkerElement.textContent));
            range.collapse(true);
        }
    }

    const pElement = hasClosestByMatchTag(startContainer, "P");
    // md 处理
    if (fixMarkdown(event, vditor, pElement, range)) {
        return true;
    }
    // li
    if (fixList(range, vditor, pElement, event)) {
        return true;
    }
    // blockquote
    if (fixBlockquote(vditor, range, event, pElement)) {
        return true;
    }

    // 代码块
    const preRenderElement = hasClosestByClassName(startContainer, "vditor-ir__marker--pre");
    if (preRenderElement && preRenderElement.tagName === "PRE") {
        const codeRenderElement = preRenderElement.firstChild as HTMLElement;
        const codePosition = getSelectPosition(codeRenderElement, range);
        // 数学公式上无元素，按上或左将添加新块
        if ((event.key === "ArrowUp" || event.key === "ArrowLeft") &&
            codeRenderElement.getAttribute("data-type") === "math-block"
            && !preRenderElement.parentElement.previousElementSibling &&
            codePosition.start === 0) {
            preRenderElement.parentElement.insertAdjacentHTML("beforebegin",
                `<p data-block="0">${Constants.ZWSP}<wbr></p>`);
            setRangeByWbr(vditor.ir.element, range);
            event.preventDefault();
            return true;
        }

        // 代码块下无元素或者为代码块元素，添加空块
        if ((event.key === "ArrowDown" && codeRenderElement.textContent.trimRight().substr(codePosition.start).indexOf("\n") === -1) ||
            (event.key === "ArrowRight" && codePosition.start >= codeRenderElement.textContent.trimRight().length)) {
            const nextElement = preRenderElement.parentElement.nextElementSibling;
            if (!nextElement || (nextElement && nextElement.getAttribute("data-type"))) {
                preRenderElement.parentElement.insertAdjacentHTML("afterend",
                    `<p data-block="0">${Constants.ZWSP}<wbr></p>`);
                setRangeByWbr(vditor.ir.element, range);
            } else {
                range.selectNodeContents(preRenderElement.parentElement.nextElementSibling);
                range.collapse(true);
            }
            event.preventDefault();
            return true;
        }

        if (fixCodeBlock(vditor, event, preRenderElement, range)) {
            return true;
        }
    }
    // 代码块语言
    const preBeforeElement = hasClosestByAttribute(startContainer, "data-type", "code-block-info");
    if (preBeforeElement && range.toString() === "") {
        if (event.key === "Backspace" && preBeforeElement.textContent.replace(Constants.ZWSP, "").trim() === "") {
            event.preventDefault();
            return true;
        }
        if (event.key === "Enter") {
            range.selectNodeContents(preBeforeElement.nextElementSibling.firstChild);
            range.collapse(true);
            event.preventDefault();
            return true;
        }

        // 上无元素，按上或左将添加新块
        if (!preBeforeElement.parentElement.previousElementSibling && (event.key === "ArrowUp" || event.key === "ArrowLeft")
            && getSelectPosition(preBeforeElement, range).start < 2) {
            preBeforeElement.parentElement.insertAdjacentHTML("beforebegin",
                `<p data-block="0">${Constants.ZWSP}<wbr></p>`);
            setRangeByWbr(vditor.ir.element, range);
            event.preventDefault();
            return true;
        }
    }

    // table
    if (fixTable(vditor, event, range)) {
        return true;
    }

    // task list
    if (fixTask(vditor, range, event)) {
        return true;
    }

    // tab
    if (fixTab(vditor, range, event)) {
        return true;
    }

    if (event.key === "Enter") {
        scrollCenter(vditor.ir.element);
    }

    return false;
};
