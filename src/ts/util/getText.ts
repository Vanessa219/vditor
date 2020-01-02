import {code160to32} from "../util/code160to32";
import {log} from "./log";

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
        log("VditorDOM2Md", cloneEditorElement.innerHTML, "arguments", vditor.options.debugger);
        const text = vditor.lute.VditorDOM2Md(cloneEditorElement.innerHTML);
        log("VditorDOM2Md", text, "result", vditor.options.debugger);
        return text;
    }
    return "";
};
