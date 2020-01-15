import {
    hasClosestBlock, hasClosestByAttribute,
    hasClosestByClassName,
    hasClosestByMatchTag,
    hasClosestByTag,
    hasTopClosestByTag,
} from "../util/hasClosest";
import {log} from "../util/log";
import {addP2Li} from "./addP2Li";
import {afterRenderEvent} from "./afterRenderEvent";
import {processCodeRender} from "./processCodeRender";
import {setRangeByWbr} from "./setRangeByWbr";

export const input = (event: IHTMLInputEvent, vditor: IVditor, range: Range) => {
    let blockElement = hasClosestBlock(range.startContainer);

    // 列表需要到最顶层
    const topUlElement = hasTopClosestByTag(range.startContainer, "UL");
    const topOlElement = hasTopClosestByTag(range.startContainer, "OL");
    let topListElement = topUlElement;
    if (topOlElement && (!topUlElement || (topUlElement && topOlElement.contains(topUlElement)))) {
        topListElement = topOlElement;
    }

    if (!blockElement) {
        // 使用顶级块元素，应使用 innerHTML
        blockElement = vditor.wysiwyg.element;
    }

    // 修正光标位于 math inline 第0个字符时，按下删除按钮 code 中内容会被删除
    blockElement.querySelectorAll('.vditor-wysiwyg__block[data-type="math-inline"]').forEach((math) => {
        if (!math.querySelector("code")) {
            const previewElement = math.querySelector(".vditor-wysiwyg__preview");
            previewElement.insertAdjacentHTML("beforebegin", `<code data-type="math-inline">${
                math.querySelector(".vditor-math").getAttribute("data-math")}</code>`);
        }
    });

    const previewCodeElement = hasClosestByClassName(range.startContainer, "vditor-wysiwyg__preview");
    const blockRenderElement = hasClosestByClassName(range.startContainer, "vditor-wysiwyg__block");
    if (previewCodeElement) {
        previewCodeElement.click();
        if (blockRenderElement) {
            processCodeRender(blockRenderElement, vditor);
        }
        return;
    }

    const codeElement = hasClosestByTag(range.startContainer, "CODE");
    if (codeElement && blockRenderElement) {
        processCodeRender(blockRenderElement, vditor);
    } else if (event.inputType !== "formatItalic"
        && event.inputType !== "formatBold"
        && event.inputType !== "formatRemove"
        && event.inputType !== "formatStrikeThrough"
        && event.inputType !== "insertUnorderedList"
        && event.inputType !== "insertOrderedList"
        && event.inputType !== "formatOutdent"
        && event.inputType !== "formatIndent"
        && event.inputType !== ""   // document.execCommand('unlink', false)
    ) {
        // 保存光标
        vditor.wysiwyg.element.querySelectorAll("wbr").forEach((wbr) => {
            wbr.remove();
        });
        const wbrNode = document.createElement("wbr");
        range.insertNode(wbrNode);

        if (topListElement) {
            addP2Li(topListElement);
            blockElement = topListElement;
        }

        let vditorHTML;
        if (blockElement.isEqualNode(vditor.wysiwyg.element)) {
            vditorHTML = blockElement.innerHTML;
        } else {
            vditorHTML = blockElement.outerHTML;
            let listElement = hasClosestByMatchTag(range.startContainer, "UL");
            if (!listElement) {
                listElement = hasClosestByMatchTag(range.startContainer, "OL");
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
            }
        }

        // 合并多个 em， strong，s。以防止多个相同元素在一起时不满足 commonmark 规范，出现标记符
        vditorHTML = vditorHTML.replace(/<\/strong><strong data-marker="\W{2}">/g, "")
            .replace(/<\/em><em data-marker="\W{1}">/g, "")
            .replace(/<\/s><s data-marker="~{1,2}">/g, "");
        log("SpinVditorDOM", vditorHTML, "argument", vditor.options.debugger);
        vditorHTML = vditor.lute.SpinVditorDOM(vditorHTML) || '<p data-block="0">\n</p>';
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

        blockElement = hasClosestByAttribute(range.startContainer, "data-block", "0");
        if (blockElement && blockElement.querySelectorAll("code").length > 0) {
            // TODO: 目前为全局渲染。可优化为只选取当前列表、当前列表紧邻的前后列表；最顶层列表；当前块进行渲染
            vditor.wysiwyg.element.querySelectorAll(".vditor-wysiwyg__block").forEach(
                (blockRenderItem: HTMLElement) => {
                    processCodeRender(blockRenderItem, vditor);
                });
        }
    }

    afterRenderEvent(vditor, true, true);
};
