import {code160to32} from "../util/code160to32";

export const getText = (vditor: IVditor) => {
    if (vditor.currentMode === "markdown") {
        // last char must be a `\n`.
        return code160to32(`${vditor.editor.element.textContent}\n`.replace(/\n\n$/, "\n"));
    } else if (vditor.wysiwyg) {
        const cloneEditorElement = document.createElement("pre");
        cloneEditorElement.innerHTML = vditor.wysiwyg.element.innerHTML;
        cloneEditorElement.querySelectorAll("code").forEach((codeElement) => {
            codeElement.setAttribute("data-code",
                decodeURIComponent(codeElement.getAttribute("data-code") || ""));
        });
        return vditor.lute.VditorDOM2Md(cloneEditorElement.innerHTML);
    }
    return "";
};
