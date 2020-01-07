import {code160to32} from "../util/code160to32";
import {log} from "./log";
import {addP2Li} from "../wysiwyg/addP2Li";

export const getMarkdown = (vditor: IVditor) => {
    if (vditor.currentMode === "markdown") {
        // last char must be a `\n`.
        return code160to32(`${vditor.editor.element.textContent}\n`.replace(/\n\n$/, "\n"));
    } else if (vditor.wysiwyg) {
        const tempEditorElement = vditor.wysiwyg.element.cloneNode(true) as HTMLElement
        addP2Li(tempEditorElement)
        log("VditorDOM2Md", tempEditorElement.innerHTML, "arguments", vditor.options.debugger);
        const text = vditor.lute.VditorDOM2Md(tempEditorElement.innerHTML);
        log("VditorDOM2Md", text, "result", vditor.options.debugger);
        return text;
    }
    return "";
};
