import {Constants} from "../constants";
import {isCtrl} from "../util/compatibility";
import {scrollCenter} from "../util/editorCommenEvent";
import {hasClosestByAttribute, hasClosestByClassName, hasClosestByMatchTag} from "../util/hasClosest";
import {getSelectPosition, setRangeByWbr} from "../util/selection";
import {processAfterRender} from "./process";

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
    if (event.key !== "Enter" && event.key !== "Tab" && event.key !== "Backspace" && event.key !== "ArrowLeft" &&
        event.key !== "ArrowUp" && !isCtrl(event) && event.key !== "Escape") {
        return false;
    }

    const range = getSelection().getRangeAt(0);
    const startContainer = range.startContainer;

    const newlineElement = hasClosestByAttribute(startContainer, "data-newline", "1");

    if (!isCtrl(event) && !event.altKey && !event.shiftKey && event.key === "Enter" && newlineElement
        && range.startOffset < newlineElement.textContent.length) {
        // 斜体、粗体、内联代码块中换行
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
    const preRenderElement = hasClosestByClassName(startContainer, "vditor-ir__marker--pre");
    if (preRenderElement) {
        const codeRenderElement = preRenderElement.firstChild as HTMLElement;

        // 换行
        if (!isCtrl(event) && !event.altKey && event.key === "Enter") {
            if (!codeRenderElement.textContent.endsWith("\n")) {
                codeRenderElement.insertAdjacentText("beforeend", "\n");
            }
            range.insertNode(document.createTextNode("\n"));
            range.collapse(false);
            processAfterRender(vditor);
            scrollCenter(vditor.ir.element);
            event.preventDefault();
            return true;
        }

        // tab
        if (vditor.options.tab && event.key === "Tab" && !event.shiftKey && range.toString() === "") {
            range.insertNode(document.createTextNode(vditor.options.tab));
            range.collapse(false);
            processAfterRender(vditor);
            event.preventDefault();
            return true;
        }

        // TODO shift + tab, shift and 选中文字

        if (event.key === "Backspace" && !isCtrl(event) && !event.shiftKey && !event.altKey) {
            const codePosition = getSelectPosition(codeRenderElement, range);
            if ((codePosition.start === 0 ||
                (codePosition.start === 1 && codeRenderElement.innerText === "\n")) // 空代码块，光标在 \n 后
                && range.toString() === "") {
                // Backspace: 光标位于第零个字符，仅删除代码块标签
                preRenderElement.parentElement.outerHTML =
                    `<p data-block="0"><wbr>${codeRenderElement.innerHTML}</p>`;
                setRangeByWbr(vditor.wysiwyg.element, range);
                processAfterRender(vditor);
                event.preventDefault();
                return true;
            }
        }
        // 数学公式上无元素，按上或左将添加新块
        if ((event.key === "ArrowUp" || event.key === "ArrowLeft") &&
            codeRenderElement.getAttribute("data-type") === "math-block"
            && !preRenderElement.parentElement.previousElementSibling &&
            getSelectPosition(codeRenderElement, range).start === 0) {
            preRenderElement.parentElement.insertAdjacentHTML("beforebegin",
                `<p data-block="0">${Constants.ZWSP}<wbr></p>`);
            setRangeByWbr(vditor.ir.element, range);
            event.preventDefault();
            return true;
        }
    }
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

        if (!preBeforeElement.parentElement.previousElementSibling && (event.key === "ArrowUp" || event.key === "ArrowLeft")
            && getSelectPosition(preBeforeElement, range).start < 2) {
            preBeforeElement.parentElement.insertAdjacentHTML("beforebegin",
                `<p data-block="0">${Constants.ZWSP}<wbr></p>`);
            setRangeByWbr(vditor.ir.element, range);
            event.preventDefault();
            return true;
        }
    }
    const preAfterElement = hasClosestByAttribute(startContainer, "data-type", "code-block-close-marker-zwsp")
        || hasClosestByAttribute(startContainer, "data-type", "math-block-close-marker-zwsp");
    if (preAfterElement) {
        if (event.key === "Enter") {
            preAfterElement.parentElement.insertAdjacentHTML("afterend",
                `<p data-block="0">${Constants.ZWSP}<wbr></p>`);
            setRangeByWbr(vditor.ir.element, range);
            event.preventDefault();
            return true;
        }
    }

    const liElement = hasClosestByMatchTag(startContainer, "LI");
    if (liElement) {
        if (!isCtrl(event) && !event.altKey && event.key === "Enter" &&
            (event.shiftKey // 软换行
                // fix li 中有多个 P 时，在第一个 P 中换行会在下方生成新的 li
                || (!event.shiftKey && pElement && liElement.contains(pElement) && pElement.nextElementSibling))) {
            if (liElement && !liElement.textContent.endsWith("\n")) {
                // li 结尾需 \n
                liElement.insertAdjacentText("beforeend", "\n");
            }
            range.insertNode(document.createTextNode("\n"));
            range.collapse(false);
            processAfterRender(vditor);
            // processCodeRender(liElement, vditor);
            event.preventDefault();
            return true;
        }

        if (!isCtrl(event) && !event.shiftKey && !event.altKey && event.key === "Backspace" &&
            !liElement.previousElementSibling && range.toString() === "" &&
            getSelectPosition(liElement, range).start === 0) {
            // 光标位于点和第一个字符中间时，无法删除 li 元素
            if (liElement.nextElementSibling) {
                liElement.parentElement.insertAdjacentHTML("beforebegin",
                    `<p data-block="0"><wbr>${liElement.innerHTML}</p>`);
                liElement.remove();
            } else {
                liElement.parentElement.outerHTML = `<p data-block="0"><wbr>${liElement.innerHTML}</p>`;
            }
            setRangeByWbr(vditor.ir.element, range);
            processAfterRender(vditor);
            event.preventDefault();
            return true;
        }
    }

    // blockquote
    const blockquoteElement = hasClosestByMatchTag(startContainer, "BLOCKQUOTE");
    if (blockquoteElement && range.toString() === "") {
        if (event.key === "Backspace" && !isCtrl(event) && !event.shiftKey && !event.altKey &&
            getSelectPosition(blockquoteElement, range).start === 0) {
            // Backspace: 光标位于引用中的第零个字符，仅删除引用标签
            range.insertNode(document.createElement("wbr"));
            blockquoteElement.outerHTML = blockquoteElement.innerHTML;
            setRangeByWbr(vditor.ir.element, range);
            processAfterRender(vditor);
            event.preventDefault();
            return true;
        }

        if (pElement && event.key === "Enter" && !isCtrl(event) && !event.shiftKey && !event.altKey
            && pElement.parentElement.tagName === "BLOCKQUOTE") {
            // Enter: 空行回车应逐层跳出
            let isEmpty = false;
            if (pElement.innerHTML.replace(Constants.ZWSP, "") === "\n") {
                // 空 P
                isEmpty = true;
                pElement.remove();
            } else if (pElement.innerHTML.endsWith("\n\n") &&
                getSelectPosition(pElement, range).start === pElement.textContent.length - 1) {
                // 软换行
                pElement.innerHTML = pElement.innerHTML.substr(0, pElement.innerHTML.length - 2);
                isEmpty = true;
            }
            if (isEmpty) {
                // 需添加零宽字符，否则的话无法记录 undo
                blockquoteElement.insertAdjacentHTML("afterend", `<p data-block="0">${Constants.ZWSP}<wbr>\n</p>`);
                setRangeByWbr(vditor.ir.element, range);
                processAfterRender(vditor);
                event.preventDefault();
                return true;
            }
        }
    }
};
