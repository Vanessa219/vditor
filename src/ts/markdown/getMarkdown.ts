import {code160to32} from "../util/code160to32";

export const getMarkdown = (vditor: IVditor) => {
    if (vditor.currentMode === "sv") {
        return code160to32(`${vditor.sv.element.value}\n`.replace(/\n\n$/, "\n"));
    } else if (vditor.currentMode === "wysiwyg") {
        return code160to32(vditor.lute.VditorDOM2Md(vditor.wysiwyg.element.innerHTML));
    } else if (vditor.currentMode === "ir") {
        return code160to32(vditor.lute.VditorIRDOM2Md(vditor.ir.element.innerHTML));
    }
    return "";
};
