import {isHeadingMD, isHrMD, renderToc} from "../util/fixBrowserBehavior";
import {
    getTopList,
    hasClosestBlock, hasClosestByAttribute,
    hasClosestByClassName,
} from "../util/hasClosest";
import {hasClosestByTag} from "../util/hasClosestByHeadings";
import {log} from "../util/log";
import {processCodeRender} from "../util/processCode";
import {getSelectPosition, setRangeByWbr} from "../util/selection";
import {processAfterRender} from "./process";

export const input = (vditor: IVditor, range: Range, ignoreSpace = false) => {
    let blockElement = hasClosestBlock(range.startContainer);
    // 前后可以输入空格
    if (blockElement && !ignoreSpace) {
        if (isHrMD(blockElement.innerHTML) || isHeadingMD(blockElement.innerHTML)) {
            return;
        }

        // 前后空格处理
        const startOffset = getSelectPosition(blockElement, range).start;

        // 开始可以输入空格
        let startSpace = true;
        for (let i = startOffset - 1;
            // 软换行后有空格
             i > blockElement.textContent.substr(0, startOffset).lastIndexOf("\n");
             i--) {
            if (blockElement.textContent.charAt(i) !== " " &&
                // 多个 tab 前删除不形成代码块 https://github.com/Vanessa219/vditor/issues/162 1
                blockElement.textContent.charAt(i) !== "\t") {
                startSpace = false;
                break;
            }
        }
        if (startOffset === 0) {
            startSpace = false;
        }

        // 结尾可以输入空格
        let endSpace = true;
        for (let i = startOffset - 1; i < blockElement.textContent.length; i++) {
            if (blockElement.textContent.charAt(i) !== " " && blockElement.textContent.charAt(i) !== "\n") {
                endSpace = false;
                break;
            }
        }

        if ((startSpace && !blockElement.querySelector(".language-mindmap")) || endSpace) {
            if (endSpace) {
                const markerElement = hasClosestByClassName(range.startContainer, "vditor-ir__marker");
                if (markerElement) {
                    // inline marker space https://github.com/Vanessa219/vditor/issues/239
                } else {
                    const previousNode = range.startContainer.previousSibling as HTMLElement;
                    if (previousNode && previousNode.nodeType !== 3 && previousNode.classList.contains("vditor-ir__node--expand")) {
                        // FireFox https://github.com/Vanessa219/vditor/issues/239
                        previousNode.classList.remove("vditor-ir__node--expand");
                    }
                    return;
                }
            } else {
                return;
            }
        }
    }

    vditor.ir.element.querySelectorAll(".vditor-ir__node--expand").forEach((item) => {
        item.classList.remove("vditor-ir__node--expand");
    });

    if (!blockElement) {
        // 使用顶级块元素，应使用 innerHTML
        blockElement = vditor.ir.element;
    }

    if (!blockElement.querySelector("wbr")) {
        const previewRenderElement = hasClosestByClassName(range.startContainer, "vditor-ir__preview");
        if (previewRenderElement) {
            // 光标如果落在预览区域中，则重置到代码区域
            if (previewRenderElement.previousElementSibling.firstElementChild) {
                range.selectNodeContents(previewRenderElement.previousElementSibling.firstElementChild);
            } else {
                range.selectNodeContents(previewRenderElement.previousElementSibling);
            }
            range.collapse(false);
        }
        // document.exeComment insertHTML 会插入 wbr
        range.insertNode(document.createElement("wbr"));
    }
    // 清除浏览器自带的样式
    blockElement.querySelectorAll("[style]").forEach((item) => {
        item.removeAttribute("style");
    });

    if (blockElement.getAttribute("data-type") === "link-ref-defs-block") {
        // 修改链接引用
        blockElement = vditor.ir.element;
    }

    const isIRElement = blockElement.isEqualNode(vditor.ir.element);
    const footnoteElement = hasClosestByAttribute(blockElement, "data-type", "footnotes-block");
    let html = "";
    if (!isIRElement) {
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
        } else if (blockElement.previousElementSibling && blockElement.previousElementSibling.textContent !== "") {
            // 换行时需要处理上一段落
            html = blockElement.previousElementSibling.outerHTML + html;
            blockElement.previousElementSibling.remove();
        }

        // 添加链接引用
        const allLinkRefDefsElement = vditor.ir.element.querySelector("[data-type='link-ref-defs-block']");
        if (allLinkRefDefsElement && !blockElement.isEqualNode(allLinkRefDefsElement)) {
            html += allLinkRefDefsElement.outerHTML;
            allLinkRefDefsElement.remove();
        }
        // 添加脚注
        const allFootnoteElement = vditor.ir.element.querySelector("[data-type='footnotes-block']");
        if (allFootnoteElement && !blockElement.isEqualNode(allFootnoteElement)) {
            html += allFootnoteElement.outerHTML;
            allFootnoteElement.remove();
        }
    } else {
        html = blockElement.innerHTML;
    }

    log("SpinVditorIRDOM", html, "argument", vditor.options.debugger);
    html = vditor.lute.SpinVditorIRDOM(html);
    log("SpinVditorIRDOM", html, "result", vditor.options.debugger);

    if (isIRElement) {
        blockElement.innerHTML = html;
    } else {
        blockElement.outerHTML = html;

        const allLinkRefDefsElement = vditor.ir.element.querySelector("[data-type='link-ref-defs-block']");
        if (allLinkRefDefsElement) {
            vditor.ir.element.insertAdjacentElement("beforeend", allLinkRefDefsElement);
        }

        const allFootnoteElement = vditor.ir.element.querySelector("[data-type='footnotes-block']");
        if (allFootnoteElement) {
            vditor.ir.element.insertAdjacentElement("beforeend", allFootnoteElement);
        }

        // 更新正文中的 tip
        if (footnoteElement) {
            const footnoteItemElement = hasClosestByAttribute(vditor.ir.element.querySelector("wbr"),
                "data-type", "footnotes-def");
            if (footnoteItemElement) {
                const footnoteItemText = footnoteItemElement.textContent;
                const marker = footnoteItemText.substring(1, footnoteItemText.indexOf("]:"));
                const footnoteRefElement = vditor.ir.element.querySelector(`sup[data-type="footnotes-ref"][data-footnotes-label="${marker}"]`);
                if (footnoteRefElement) {
                    footnoteRefElement.setAttribute("aria-label", footnoteItemText.substr(marker.length + 3).trim());
                }
            }
        }
    }
    setRangeByWbr(vditor.ir.element, range);

    vditor.ir.element.querySelectorAll(".vditor-ir__preview[data-render='2']").forEach((item: HTMLElement) => {
        processCodeRender(item, vditor);
    });

    renderToc(vditor);

    processAfterRender(vditor, {
        enableAddUndoStack: true,
        enableHint: true,
        enableInput: true,
    });
};
