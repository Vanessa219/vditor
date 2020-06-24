import {hasClosestBlock} from "../util/hasClosest";
import {log} from "../util/log";
import {setRangeByWbr} from "../util/selection";
import {processAfterRender} from "./process";

export const inputEvent = (vditor: IVditor) => {
    const range = getSelection().getRangeAt(0).cloneRange();
    range.insertNode(document.createElement("wbr"));
    let blockElement = hasClosestBlock(range.startContainer);
    if (!blockElement) {
        blockElement = vditor.sv.element;
    }
    const isSVElement = blockElement.isEqualNode(vditor.sv.element);

    let html = blockElement.innerHTML;
    log("SpinVditorSVDOM", html, "argument", vditor.options.debugger);
    html = vditor.lute.SpinVditorSVDOM(html);
    log("SpinVditorSVDOM", html, "result", vditor.options.debugger);
    if (isSVElement) {
        blockElement.innerHTML = html;
    } else {
        blockElement.outerHTML = html;
    }
    setRangeByWbr(vditor.sv.element, range);

    processAfterRender(vditor, {
        enableAddUndoStack: true,
        enableHint: false,
        enableInput: true,
    });
};
