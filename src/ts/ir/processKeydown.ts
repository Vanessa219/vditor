import {hidePanel} from "../toolbar/setToolbar";
import {isCtrl} from "../util/compatibility";
import {
    fixBlockquote, fixCJKPosition,
    fixCodeBlock, fixCursorDownInlineMath,
    fixDelete, fixHR,
    fixList,
    fixMarkdown,
    fixTab,
    fixTable,
    fixTask,
    insertAfterBlock, insertBeforeBlock, isFirstCell, isLastCell,
} from "../util/fixBrowserBehavior";
import {
    hasClosestBlock,
    hasClosestByAttribute,
    hasClosestByClassName,
    hasClosestByMatchTag,
} from "../util/hasClosest";
import {hasClosestByHeadings} from "../util/hasClosestByHeadings";
import {getEditorRange, getSelectPosition} from "../util/selection";

export const processKeydown = (vditor: IVditor, event: KeyboardEvent) => {
    vditor.ir.composingLock = event.isComposing;
    if (event.isComposing) {
        return false;
    }

    // 添加第一次记录 undo 的光标
    if (event.key.indexOf("Arrow") === -1) {
        vditor.irUndo.recordFirstWbr(vditor, event);
    }

    const range = getEditorRange(vditor.ir.element);
    const startContainer = range.startContainer;

    fixCJKPosition(range, event.key);

    fixHR(range);

    // 仅处理以下快捷键操作
    if (event.key !== "Enter" && event.key !== "Tab" && event.key !== "Backspace" && event.key.indexOf("Arrow") === -1
        && !isCtrl(event) && event.key !== "Escape") {
        return false;
    }

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
    // toc 前无元素，插入空块
    if (pElement && pElement.previousElementSibling &&
        pElement.previousElementSibling.classList.contains("vditor-toc")) {
        if (insertBeforeBlock(vditor, event, range, pElement, pElement.previousElementSibling as HTMLElement)) {
            return true;
        }
    }

    // 代码块
    const preRenderElement = hasClosestByClassName(startContainer, "vditor-ir__marker--pre");
    if (preRenderElement && preRenderElement.tagName === "PRE") {
        const codeRenderElement = preRenderElement.firstChild as HTMLElement;
        if (fixCodeBlock(vditor, event, preRenderElement, range)) {
            return true;
        }
        // 数学公式上无元素，按上或左将添加新块
        if ((codeRenderElement.getAttribute("data-type") === "math-block"
            || codeRenderElement.getAttribute("data-type") === "html-block") &&
            insertBeforeBlock(vditor, event, range, codeRenderElement, preRenderElement.parentElement)) {
            return true;
        }

        // 代码块下无元素或者为代码块/table 元素，添加空块
        if (insertAfterBlock(vditor, event, range, codeRenderElement, preRenderElement.parentElement)) {
            return true;
        }
    }
    // 代码块语言
    const preBeforeElement = hasClosestByAttribute(startContainer, "data-type", "code-block-info");
    if (preBeforeElement) {
        if (event.key === "Enter" || event.key === "Tab") {
            range.selectNodeContents(preBeforeElement.nextElementSibling.firstChild);
            range.collapse(true);
            event.preventDefault();
            return true;
        }

        if (event.key === "Backspace") {
            const start = getSelectPosition(preBeforeElement).start;
            if (start === 1) { // 删除零宽空格
                range.setStart(startContainer, 0);
            }
            if (start === 2) { // 删除时清空自动补全语言
                vditor.hint.recentLanguage = "";
            }
        }
        if (insertBeforeBlock(vditor, event, range, preBeforeElement, preBeforeElement.parentElement)) {
            // 上无元素，按上或左将添加新块
            hidePanel(vditor, ["hint"]);
            return true;
        }
    }

    // table
    const cellElement = hasClosestByMatchTag(startContainer, "TD") ||
        hasClosestByMatchTag(startContainer, "TH");
    if (event.key.indexOf("Arrow") > -1 && cellElement) {
        const tableElement = isFirstCell(cellElement);
        if (tableElement && insertBeforeBlock(vditor, event, range, cellElement, tableElement)) {
            return true;
        }

        const table2Element = isLastCell(cellElement);
        if (table2Element && insertAfterBlock(vditor, event, range, cellElement, table2Element)) {
            return true;
        }
    }
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

    if (event.key === "Backspace" && !isCtrl(event) && !event.shiftKey && !event.altKey && range.toString() === "") {
        if (fixDelete(vditor, range, event, pElement)) {
            return true;
        }
        // 光标位于标题前，marker 后
        const headingElement = hasClosestByHeadings(startContainer);
        if (headingElement) {
            const headingLength = headingElement.firstElementChild.textContent.length;
            if (getSelectPosition(headingElement).start === headingLength) {
                range.setStart(headingElement.firstElementChild.firstChild, headingLength - 1);
                range.collapse(true);
            }
        }
    }

    const blockElement = hasClosestBlock(startContainer);
    if ((event.key === "ArrowUp" || event.key === "ArrowDown") && blockElement) {
        // https://github.com/Vanessa219/vditor/issues/358
        blockElement.querySelectorAll(".vditor-ir__node").forEach((item: HTMLElement) => {
            if (!item.contains(startContainer)) {
                item.classList.add("vditor-ir__node--hidden");
            }
        });
    }
    fixCursorDownInlineMath(range, event.key);

    return false;
};
