import {code160to32} from "../util/code160to32";

export const getText = (vditor: IVditor) => {
    if (vditor.currentMode === "markdown") {
        // last char must be a `\n`.
        return code160to32(`${vditor.editor.element.textContent}\n`.replace(/\n\n$/, "\n"));
    } else if (vditor.wysiwyg) {
        const md = vditor.lute.Html2Md(vditor.wysiwyg.element.innerHTML.replace("<wbr>", ""));
        return md[0] || md[1];
    }
    return "";
};
