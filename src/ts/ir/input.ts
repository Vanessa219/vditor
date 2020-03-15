import {log} from "../util/log";
import {setRangeByWbr} from "../wysiwyg/setRangeByWbr";
import {processAfterRender} from "./process";

export const input = (vditor: IVditor, range: Range) => {
    range.insertNode(document.createElement("wbr"));
    log("SpinVditorIRDOM", vditor.ir.element.innerHTML, "argument", vditor.options.debugger);
    vditor.ir.element.innerHTML = vditor.lute.SpinVditorIRDOM(vditor.ir.element.innerHTML);
    log("SpinVditorIRDOM", vditor.ir.element.innerHTML, "result", vditor.options.debugger);
    setRangeByWbr(vditor.ir.element, range);
    processAfterRender(vditor, {
        enableAddUndoStack: true,
        enableHint: true,
        enableInput: true,
    });
};
