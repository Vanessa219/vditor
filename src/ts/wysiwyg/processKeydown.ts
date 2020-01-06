import {setSelectionFocus} from "../editor/setSelection";
import {hasClosestByAttribute, hasClosestByClassName, hasClosestByMatchTag} from "../util/hasClosest";
import {processCodeRender} from "./processCodeRender";
import {afterRenderEvent} from "./afterRenderEvent";

export const deleteKey = (vditor: IVditor, event: KeyboardEvent) => {
    const range = getSelection().getRangeAt(0);
    const startContainer = range.startContainer as HTMLElement;

    if (startContainer.nodeType === 3 && range.startOffset === 0) {
        // 光标位于第零个位置进行删除
        if (startContainer.parentElement.tagName === "CODE" &&
            startContainer.parentElement.parentElement.parentElement.classList
                .contains("vditor-wysiwyg__block") && !startContainer.previousSibling) {
            // 光标位于渲染代码块内，仅删除代码块，内容保持不变
            const text = document.createTextNode(startContainer.parentElement.textContent);
            range.setStartBefore(startContainer.parentElement.parentElement.parentElement);
            range.insertNode(text);
            range.collapse(true);
            (vditor.wysiwyg.popover.firstElementChild as HTMLElement).click();
            event.preventDefault();
            return;
        }

        const blockquoteElement = hasClosestByMatchTag(startContainer, "BLOCKQUOTE");
        if (blockquoteElement) {
            // 光标位于引用中的第零个字符
            blockquoteElement.outerHTML = `<p data-block="0">${blockquoteElement.innerHTML}</p>`;
            event.preventDefault();
            return;
        }

        const liElement = hasClosestByMatchTag(startContainer, "LI");
        const blockElement = hasClosestByAttribute(startContainer, "data-block", "0");
        if (blockElement) {
            const blockRenderElement = blockElement.previousElementSibling as HTMLElement;
            if (blockRenderElement && blockRenderElement.classList.contains("vditor-wysiwyg__block") &&
                blockElement.tagName !== "TABLE" &&
                (!liElement ||
                    (liElement && liElement.isEqualNode(liElement.parentElement.firstElementChild)))) {
                // 删除后光标落在代码渲染块的预览部分且光标后有内容
                (blockRenderElement.lastElementChild as HTMLElement).click();
                event.preventDefault();
            }
        }
    } else if (startContainer.nodeType !== 3) {
        // 光标位于 table 前，table 前有内容
        const tableElemnt = startContainer.childNodes[range.startOffset] as HTMLElement;
        if (tableElemnt && range.startOffset > 0 &&
            tableElemnt.tagName === "TABLE") {
            range.selectNodeContents(tableElemnt.previousElementSibling);
            range.collapse(false);
            setSelectionFocus(range);
            event.preventDefault();
            return;
        }

        // 段落前为代码渲染块，从段落中间开始删除，一直删除头再继续删除一次
        if (range.startOffset === 0 && startContainer.tagName === "P") {
            const pPrevElement = startContainer.previousElementSibling;
            if (pPrevElement && pPrevElement.classList.contains("vditor-wysiwyg__block")) {
                (pPrevElement.lastElementChild as HTMLElement).click();
                event.preventDefault();
            }
            return;
        }

        // 渲染代码块为空
        if (startContainer.tagName === "CODE" &&
            startContainer.textContent === "" &&
            startContainer.parentElement.parentElement.classList.contains("vditor-wysiwyg__block")) {
            startContainer.parentElement.parentElement.outerHTML = '<p data-block="0">\n</p>';
            event.preventDefault();
            return;
        }

        const preElement = startContainer.childNodes[range.startOffset - 1] as HTMLElement;
        if (preElement && preElement.nodeType !== 3 &&
            preElement.classList.contains("vditor-wysiwyg__block")) {
            // 光标从代码块向后移动到下一个段落前，进行删除
            (preElement.querySelector(".vditor-wysiwyg__preview") as HTMLElement).click();
            event.preventDefault();
        }
    }
};

export const tabKey = (vditor: IVditor, event: KeyboardEvent) => {
    const range = getSelection().getRangeAt(0)
    const codeElement = hasClosestByMatchTag(range.startContainer, 'CODE')
    if (event.shiftKey) {
        if (codeElement) {
            // TODO 代码块缩进
        }
    } else {
        if (range.collapsed) {
            range.insertNode(document.createTextNode(vditor.options.tab));
            range.collapse(false);
        } else {
            if (codeElement) {
                // TODO 代码块缩进
            } else {
                range.extractContents();
                range.insertNode(document.createTextNode(vditor.options.tab));
                range.collapse(false);
            }
        }
    }

    const blockRenderElement = hasClosestByClassName(range.startContainer, 'vditor-wysiwyg__block')
    if (blockRenderElement) {
        processCodeRender(blockRenderElement, vditor);
    }

    afterRenderEvent(vditor);
}
