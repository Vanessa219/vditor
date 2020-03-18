import {getTopList, hasClosestBlock, hasClosestByTag} from "../util/hasClosest";
import {log} from "../util/log";
import {setRangeByWbr} from "../wysiwyg/setRangeByWbr";
import {processAfterRender} from "./process";

export const input = (vditor: IVditor, range: Range) => {
    Array.from(vditor.ir.element.querySelectorAll(".vditor-ir__node--expand")).forEach((item) => {
        item.classList.remove("vditor-ir__node--expand");
    });
    range.insertNode(document.createElement("wbr"));

    let blockElement = hasClosestBlock(range.startContainer);

    if (!blockElement) {
        // 使用顶级块元素，应使用 innerHTML
        blockElement = vditor.ir.element;
    }

    const isIRElement = blockElement.isEqualNode(vditor.ir.element);
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
        } else if (blockElement.previousElementSibling) {
            // 换行时需要处理上一段落
            html = blockElement.previousElementSibling.outerHTML + html;
            blockElement.previousElementSibling.remove();
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
    }

    setRangeByWbr(vditor.ir.element, range);
    processAfterRender(vditor, {
        enableAddUndoStack: true,
        enableHint: true,
        enableInput: true,
    });
};
