import {hasClosestBlock} from "../util/hasClosest";
import {log} from "../util/log";
import {setRangeByWbr} from "../wysiwyg/setRangeByWbr";
import {processAfterRender} from "./process";

export const input = (vditor: IVditor, range: Range) => {
    range.insertNode(document.createElement("wbr"));

    let blockElement = hasClosestBlock(range.startContainer);

    if (!blockElement) {
        // 使用顶级块元素，应使用 innerHTML
        blockElement = vditor.ir.element;
    }

    const isIRElement = blockElement.isEqualNode(vditor.ir.element);
    let html = "";
    if (!isIRElement) {
        html = blockElement.outerHTML;
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
