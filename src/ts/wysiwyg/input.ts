import {hasClosestBlock, hasClosestByAttribute, hasClosestByClassName, hasClosestByTag} from "../util/hasClosest";
import {afterRenderEvent} from "./afterRenderEvent";
import {precessCodeRender} from "./processCodeRender";
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
            blockElement = document.createElement("p");
            blockElement.setAttribute("data-block", "0");
            range.insertNode(blockElement);
            range.selectNodeContents(blockElement);
        }
    }

    const codeElement = hasClosestByTag(typeElement, "CODE");
    if (codeElement) {
        codeElement.setAttribute("data-code", encodeURIComponent(codeElement.innerText));
        if (codeElement.getAttribute("data-type") === "math-inline") {
            precessCodeRender(codeElement.parentElement, vditor);
        } else {
            precessCodeRender(codeElement.parentElement.parentElement, vditor);
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

        // markdown 纠正
        // 合并多个 em， strong，s。以防止多个相同元素在一起时不满足 commonmark 规范，出现标记符
        const vditorHTML = blockElement.outerHTML.replace(/<\/strong><strong data-marker="\W{2}">/g, "")
            .replace(/<\/em><em data-marker="\W{1}">/g, "")
            .replace(/<\/s><s data-marker="~{1,2}">/g, "");
        console.log(vditorHTML);
        console.log(vditor.lute.SpinVditorDOM(vditorHTML) || '<p data-block="0"></p>');
        blockElement.outerHTML = vditor.lute.SpinVditorDOM(vditorHTML) || '<p data-block="0"></p>';

        // 设置光标
        setRangeByWbr(vditor.wysiwyg.element, range);
    }

    afterRenderEvent(vditor, true, true);
};
