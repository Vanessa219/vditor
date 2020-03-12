import {
    getTopList,
    hasClosestBlock, hasClosestByAttribute,
    hasClosestByClassName,
    hasClosestByTag,
} from "../util/hasClosest";
import {afterRenderEvent} from "./afterRenderEvent";
import {previoueIsEmptyA} from "./inlineTag";
import {processCodeRender} from "./processCodeRender";
import {renderToc} from "./processMD";
import {setRangeByWbr} from "./setRangeByWbr";

export const input = (vditor: IVditor, range: Range, event?: InputEvent) => {
    let blockElement = hasClosestBlock(range.startContainer);

    // 列表需要到最顶层
    const topListElement = getTopList(range.startContainer);

    if (!blockElement) {
        // 使用顶级块元素，应使用 innerHTML
        blockElement = vditor.wysiwyg.element;
    }

    const renderElement = hasClosestByClassName(range.startContainer, "vditor-wysiwyg__block");
    const codeElement = hasClosestByTag(range.startContainer, "CODE");
    if (codeElement && renderElement && renderElement.getAttribute("data-block") === "0") {
        if (renderElement.firstElementChild.tagName === "PRE") {
            processCodeRender(renderElement, vditor);
        } else {
            // 代码块前为空行，按下向后删除键，代码块内容会被删除
            renderElement.outerHTML = `<p data-block="0">${renderElement.textContent}</p>`;
        }
    } else if (event && event.inputType !== "formatItalic"
        && event.inputType !== "deleteByDrag"
        && event.inputType !== "insertFromDrop"
        && event.inputType !== "formatBold"
        && event.inputType !== "formatRemove"
        && event.inputType !== "formatStrikeThrough"
        && event.inputType !== "insertUnorderedList"
        && event.inputType !== "insertOrderedList"
        && event.inputType !== "formatOutdent"
        && event.inputType !== "formatIndent"
        && event.inputType !== ""   // document.execCommand('unlink', false)
        || !event
    ) {
        const previousAEmptyElement = previoueIsEmptyA(range.startContainer);
        if (previousAEmptyElement) {
            // 链接结尾回车不应该复制到下一行 https://github.com/Vanessa219/vditor/issues/163
            previousAEmptyElement.remove();
        }

        if (blockElement.tagName.indexOf("H") === 0 && blockElement.tagName.length === 2) {
            renderToc(vditor.wysiwyg.element);
        }

        // 保存光标
        vditor.wysiwyg.element.querySelectorAll("wbr").forEach((wbr) => {
            wbr.remove();
        });
        range.insertNode(document.createElement("wbr"));

        // 在行首进行删除，后面的元素会带有样式，需清除
        blockElement.querySelectorAll("[style]").forEach((item) => {
            item.removeAttribute("style");
        });

        if (topListElement) {
            const blockquoteElement = hasClosestByTag(range.startContainer, "BLOCKQUOTE");
            if (blockquoteElement) {
                // li 中有 blockquote 就只渲染 blockquote
                blockElement = hasClosestBlock(range.startContainer) || blockElement;
            } else {
                blockElement = topListElement;
            }
        }

        blockElement = vditor.wysiwyg.spinVditorDOM(vditor, blockElement);

        // 设置光标
        setRangeByWbr(vditor.wysiwyg.element, range);

        const tempTopListElement = getTopList(range.startContainer);
        if (tempTopListElement) {
            // 列表返回多个 block 时，应统一处理 https://github.com/Vanessa219/vditor/issues/112
            blockElement = tempTopListElement;
        }

        const tempBlockquoteElement = hasClosestByTag(range.startContainer, "BLOCKQUOTE");
        if (tempBlockquoteElement) {
            // BLOCKQUOTE 中存在列表，且列表中有代码块。回车，回车形成新 p
            // https://github.com/Vanessa219/vditor/issues/156#issuecomment-588318896
            blockElement = tempBlockquoteElement;
        }

        if (!blockElement) {
            blockElement = hasClosestByAttribute(range.startContainer, "data-block", "0");
        }

        if (range.startContainer.nodeType !== 3 && !blockElement) {
            blockElement = (range.startContainer as HTMLElement).children[range.startOffset] as HTMLElement;
        }
        if (blockElement && blockElement.querySelectorAll("code").length > 0) {
            // TODO: 目前为全局渲染。可优化为只选取当前列表、当前列表紧邻的前后列表；最顶层列表；当前块进行渲染
            vditor.wysiwyg.element.querySelectorAll(".vditor-wysiwyg__block").forEach(
                (blockRenderItem: HTMLElement) => {
                    processCodeRender(blockRenderItem, vditor);
                });
        }
    }

    afterRenderEvent(vditor, {
        enableAddUndoStack: true,
        enableHint: true,
        enableInput: true,
    });
};
