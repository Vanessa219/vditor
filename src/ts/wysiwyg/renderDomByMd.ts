import {processCodeRender} from "../util/processCode";
import {afterRenderEvent} from "./afterRenderEvent";

export const renderDomByMd = (vditor: IVditor, md: string, enableInput = true) => {
    const editorElement = vditor.wysiwyg.element;
    editorElement.innerHTML = vditor.lute.Md2VditorDOM(md);

    editorElement.querySelectorAll(".vditor-wysiwyg__preview[data-render='2']").forEach((item: HTMLElement) => {
        processCodeRender(item, vditor);
        item.previousElementSibling.setAttribute("style", "display:none");
    });

    afterRenderEvent(vditor, {
        enableAddUndoStack: true,
        enableHint: false,
        enableInput,
    });
};
