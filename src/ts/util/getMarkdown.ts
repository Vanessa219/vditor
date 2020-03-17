import {code160to32} from "../util/code160to32";
import {addP2Li} from "../wysiwyg/addP2Li";

export const getMarkdown = (vditor: IVditor) => {
    if (vditor.currentMode === "sv") {
        // last char must be a `\n`.
        return code160to32(`${vditor.sv.element.textContent}\n`.replace(/\n\n$/, "\n"));
    } else if (vditor.currentMode === "wysiwyg") {
        const tempEditorElement = vditor.wysiwyg.element.cloneNode(true) as HTMLElement;
        addP2Li(tempEditorElement);
        return vditor.lute.VditorDOM2Md(tempEditorElement.innerHTML);
    } else if (vditor.currentMode === "ir") {
        return vditor.lute.VditorIRDOM2Md(vditor.ir.element.innerHTML);
    }
    return "";
};
