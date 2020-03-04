import {
    getTopList,
    hasClosestBlock, hasClosestByAttribute,
    hasClosestByClassName,
    hasClosestByMatchTag,
    hasClosestByTag,
} from "../util/hasClosest";
import {log} from "../util/log";
import {addP2Li} from "./addP2Li";
import {afterRenderEvent} from "./afterRenderEvent";
import {processCodeRender} from "./processCodeRender";
import {setRangeByWbr} from "./setRangeByWbr";
import {previoueIsEmptyA} from "./inlineTag";

export const input = (vditor: IVditor, range: Range, event: IHTMLInputEvent) => {
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
    } else if (event.inputType !== "formatItalic"
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
    ) {
        const previousAEmptyElement = previoueIsEmptyA(range.startContainer)
        if (previousAEmptyElement) {
            // 链接结尾回车不应该复制到下一行 https://github.com/Vanessa219/vditor/issues/163
            previousAEmptyElement.remove();
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
                addP2Li(topListElement);
                blockElement = topListElement;
            }
        }

        let vditorHTML;
        if (blockElement.isEqualNode(vditor.wysiwyg.element)) {
            vditorHTML = blockElement.innerHTML;
        } else {
            vditorHTML = blockElement.outerHTML;
            let listElement = hasClosestByMatchTag(topListElement || range.startContainer, "UL");
            if (!listElement) {
                listElement = hasClosestByMatchTag(topListElement || range.startContainer, "OL");
            }
            if (listElement) {
                const listPrevElement = listElement.previousElementSibling;
                const listNextElement = listElement.nextElementSibling;
                if (listPrevElement && (listPrevElement.tagName === "UL" || listPrevElement.tagName === "OL")) {
                    addP2Li(listPrevElement);
                    vditorHTML = listPrevElement.outerHTML + vditorHTML;
                    listPrevElement.remove();
                }
                if (listNextElement && (listNextElement.tagName === "UL" || listNextElement.tagName === "OL")) {
                    addP2Li(listNextElement);
                    vditorHTML = vditorHTML + listNextElement.outerHTML;
                    listNextElement.remove();
                }
                // firefox 列表回车不会产生新的 list item https://github.com/Vanessa219/vditor/issues/194
                vditorHTML = vditorHTML.replace("<div><wbr><br></div>", "<li><p><wbr><br></p></li>");
            }
        }

        // 合并多个 em， strong，s。以防止多个相同元素在一起时不满足 commonmark 规范，出现标记符
        vditorHTML = vditorHTML.replace(/<\/(strong|b)><strong data-marker="\W{2}">/g, "")
            .replace(/<\/(em|i)><em data-marker="\W{1}">/g, "")
            .replace(/<\/(s|strike)><s data-marker="~{1,2}">/g, "");
        log("SpinVditorDOM", vditorHTML, "argument", vditor.options.debugger);
        vditorHTML = vditor.lute.SpinVditorDOM(vditorHTML);
        if (vditorHTML === '<hr data-block="0" />') {
            vditorHTML = '<hr data-block="0" /><p data-block="0">\n<wbr></p>';
        }
        log("SpinVditorDOM", vditorHTML, "result", vditor.options.debugger);
        if (blockElement.isEqualNode(vditor.wysiwyg.element)) {
            blockElement.innerHTML = vditorHTML;
        } else {
            blockElement.outerHTML = vditorHTML;
        }

        // 设置光标
        setRangeByWbr(vditor.wysiwyg.element, range);

        // 列表返回多个 block 时，应统一处理 https://github.com/Vanessa219/vditor/issues/112
        blockElement = getTopList(range.startContainer);
        if (!blockElement) {
            // BLOCKQUOTE 中存在列表，且列表中有代码块。回车，回车形成新 p
            // https://github.com/Vanessa219/vditor/issues/156#issuecomment-588318896
            blockElement = hasClosestByTag(range.startContainer, "BLOCKQUOTE");
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
