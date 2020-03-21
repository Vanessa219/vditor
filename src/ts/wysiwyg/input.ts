import {
    getTopList,
    hasClosestBlock, hasClosestByAttribute,
    hasClosestByClassName,
    hasClosestByTag,
} from "../util/hasClosest";
import {log} from "../util/log";
import {setRangeByWbr} from "../util/selection";
import {afterRenderEvent} from "./afterRenderEvent";
import {previoueIsEmptyA} from "./inlineTag";
import {processCodeRender} from "./processCodeRender";
import {isToC, renderToc} from "./processMD";

export const input = (vditor: IVditor, range: Range, event?: InputEvent) => {
    let blockElement = hasClosestBlock(range.startContainer);

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

        let html = "";
        if (blockElement.getAttribute("data-type") === "link-ref-defs-block" || isToC(blockElement.innerText)) {
            // 修改链接引用或 ToC
            blockElement = vditor.wysiwyg.element;
        }

        const isWYSIWYGElement = blockElement.isEqualNode(vditor.wysiwyg.element);

        if (!isWYSIWYGElement) {
            // 列表需要到最顶层
            const topListElement = getTopList(range.startContainer);
            if (topListElement) {
                const blockquoteElement = hasClosestByTag(range.startContainer, "BLOCKQUOTE");
                if (blockquoteElement) {
                    // li 中有 blockquote 就只渲染 blockquote
                    blockElement = hasClosestBlock(range.startContainer) || blockElement;
                } else {
                    blockElement = topListElement;
                }
            }

            // 修改脚注
            const footnoteElement = hasClosestByAttribute(blockElement, "data-type", "footnotes-block");
            if (footnoteElement) {
                blockElement = footnoteElement;
            }

            html = blockElement.outerHTML;

            if (blockElement.tagName === "UL" || blockElement.tagName === "OL") {
                // 如果为列表的话，需要把上下的列表都重绘
                const listPrevElement = blockElement.previousElementSibling;
                const listNextElement = blockElement.nextElementSibling;
                if (listPrevElement && (listPrevElement.tagName === "UL" || listPrevElement.tagName === "OL")) {
                    html = listPrevElement.outerHTML + html;
                    listPrevElement.remove();
                }
                if (listNextElement && (listNextElement.tagName === "UL" || listNextElement.tagName === "OL")) {
                    html = html + listNextElement.outerHTML;
                    listNextElement.remove();
                }
                // firefox 列表回车不会产生新的 list item https://github.com/Vanessa219/vditor/issues/194
                html = html.replace("<div><wbr><br></div>", "<li><p><wbr><br></p></li>");
            }

            // 添加链接引用
            const allLinkRefDefsElement = vditor.wysiwyg.element.querySelector("[data-type='link-ref-defs-block']");
            if (allLinkRefDefsElement && !blockElement.isEqualNode(allLinkRefDefsElement)) {
                html += allLinkRefDefsElement.outerHTML;
                allLinkRefDefsElement.remove();
            }
            // 添加脚注
            const allFootnoteElement = vditor.wysiwyg.element.querySelector("[data-type='footnotes-block']");
            if (allFootnoteElement && !blockElement.isEqualNode(allFootnoteElement)) {
                html += allFootnoteElement.outerHTML;
                allFootnoteElement.remove();
            }
        } else {
            html = blockElement.innerHTML;
        }

        // 合并多个 em， strong，s。以防止多个相同元素在一起时不满足 commonmark 规范，出现标记符
        html = html.replace(/<\/(strong|b)><strong data-marker="\W{2}">/g, "")
            .replace(/<\/(em|i)><em data-marker="\W{1}">/g, "")
            .replace(/<\/(s|strike)><s data-marker="~{1,2}">/g, "");

        log("SpinVditorDOM", html, "argument", vditor.options.debugger);

        html = vditor.lute.SpinVditorDOM(html);

        log("SpinVditorDOM", html, "result", vditor.options.debugger);

        if (isWYSIWYGElement) {
            blockElement.innerHTML = html;
        } else {
            blockElement.outerHTML = html;
            const allLinkRefDefsElement = vditor.wysiwyg.element.querySelector("[data-type='link-ref-defs-block']");
            if (allLinkRefDefsElement) {
                vditor.wysiwyg.element.insertAdjacentElement("beforeend", allLinkRefDefsElement);
            }

            const allFootnoteElement = vditor.wysiwyg.element.querySelector("[data-type='footnotes-block']");
            if (allFootnoteElement) {
                vditor.wysiwyg.element.insertAdjacentElement("beforeend", allFootnoteElement);
            }
        }

        // 设置光标
        setRangeByWbr(vditor.wysiwyg.element, range);

        // TODO: 目前为全局渲染。可优化为只选取当前列表、当前列表紧邻的前后列表；最顶层列表；当前块进行渲染
        vditor.wysiwyg.element.querySelectorAll(".vditor-wysiwyg__block").forEach((blockRenderItem: HTMLElement) => {
            processCodeRender(blockRenderItem, vditor);
        });
    }

    afterRenderEvent(vditor, {
        enableAddUndoStack: true,
        enableHint: true,
        enableInput: true,
    });
};
