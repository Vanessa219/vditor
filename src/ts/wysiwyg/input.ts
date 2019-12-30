import {hasClosestByAttribute, hasClosestByClassName} from "../util/hasClosest";
import {afterRenderEvent} from "./afterRenderEvent";
import {setRangeByWbr} from "./setRangeByWbr";

export const input = (event: IHTMLInputEvent, vditor: IVditor, range: Range) => {
    let typeElement = range.startContainer as HTMLElement;
    if (range.startContainer.nodeType === 3) {
        typeElement = range.startContainer.parentElement;
    }
    let element = hasClosestByAttribute(typeElement, "data-block", "0");
    if (!element) {
        element = document.createElement("p");
        range.insertNode(element);
        range.selectNodeContents(element);
    }

    if (!hasClosestByClassName(typeElement, "vditor-wysiwyg__block")
        && event.inputType !== "formatItalic"
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
        const vditorHTML = element.outerHTML.replace(/<\/strong><strong data-marker="\W{2}">/g, "")
            .replace(/<\/em><em data-marker="\W{1}">/g, "")
            .replace(/<\/s><s data-marker="~{1,2}">/g, "");
        element.outerHTML = vditor.lute.SpinVditorDOM(vditorHTML) || '<p data-block="0"></p>';

        // 设置光标
        setRangeByWbr(vditor.wysiwyg.element, range);

        if (vditor.hint) {
            vditor.hint.render(vditor);
        }
    }

    afterRenderEvent(vditor);
};
