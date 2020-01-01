import {hasClosestBlock, hasClosestByAttribute, hasClosestByClassName, hasClosestByTag} from "../util/hasClosest";
import {afterRenderEvent} from "./afterRenderEvent";
import {processCodeData} from "./processCodeData";
import {processCodeRender} from "./processCodeRender";
import {setRangeByWbr} from "./setRangeByWbr";

export const input = (event: IHTMLInputEvent, vditor: IVditor, range: Range) => {
    let typeElement = range.startContainer as HTMLElement;
    if (range.startContainer.nodeType === 3) {
        typeElement = range.startContainer.parentElement;
    }

    let blockElement = hasClosestByAttribute(typeElement, "data-block", "0");
    if (!blockElement) {
        // 使用工具栏无 data-code
        blockElement = hasClosestBlock(typeElement);
        if (!blockElement) {
            // 使用顶级块元素，应使用 innerHTML
            blockElement = vditor.wysiwyg.element;
        }
    }

    const codeElement = hasClosestByTag(typeElement, "CODE");
    if (codeElement) {
        codeElement.setAttribute("data-code", encodeURIComponent(codeElement.innerText));

        const blockRenderElement = hasClosestByClassName(typeElement, "vditor-wysiwyg__block");
        if (blockRenderElement) {
            processCodeRender(blockRenderElement, vditor);
        }
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

        // 修正 inline code, inline math 中删除第一个字符，range 不为 inline 的错误
        const inlineCodeElement = blockElement.querySelector("CODE") as HTMLElement;
        if (inlineCodeElement) {
            inlineCodeElement.setAttribute("data-code", encodeURIComponent(inlineCodeElement.innerText));
        }

        let vditorHTML;
        if (blockElement.isEqualNode(vditor.wysiwyg.element)) {
            vditorHTML = blockElement.innerHTML;
        } else {
            vditorHTML = blockElement.outerHTML;
        }
        // 合并多个 em， strong，s。以防止多个相同元素在一起时不满足 commonmark 规范，出现标记符
        vditorHTML = vditorHTML.replace(/<\/strong><strong data-marker="\W{2}">/g, "")
            .replace(/<\/em><em data-marker="\W{1}">/g, "")
            .replace(/<\/s><s data-marker="~{1,2}">/g, "");
        vditorHTML = vditor.lute.SpinVditorDOM(vditorHTML) || '<p data-block="0"></p>';
        if (blockElement.isEqualNode(vditor.wysiwyg.element)) {
            blockElement.innerHTML = vditorHTML;
        } else {
            blockElement.outerHTML = vditorHTML;
        }

        // 设置光标
        setRangeByWbr(vditor.wysiwyg.element, range);

        blockElement = getBlockByRange(range);
        if (blockElement && blockElement.querySelectorAll("code").length > 0) {
            // 对返回值中包含 inline-code, inline math 的进行 decode
            processCodeData(blockElement);
            // 对返回值中需要渲染的代码块进行处理
            if (blockElement.classList.contains("vditor-wysiwyg__block")) {
                processCodeRender(blockElement, vditor);
            }
            blockElement.querySelectorAll(".vditor-wysiwyg__block").forEach((blockRenderElement: HTMLElement) => {
                processCodeRender(blockRenderElement, vditor);
            });
        }
    }

    afterRenderEvent(vditor, true, true);
};

const getBlockByRange = (range: Range) => {
    let e =
        range.startContainer.nodeType === 3 ? range.startContainer.parentElement : range.startContainer as HTMLElement;
    let isClosest = false;
    while (e && !isClosest && !e.classList.contains("vditor-wysiwyg")) {
        if (e.getAttribute("data-block") === "0") {
            isClosest = true;
        } else {
            e = e.parentElement;
        }
    }
    return isClosest && e;
};
