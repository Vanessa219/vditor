import {afterRenderEvent} from "./afterRenderEvent";
import {processCodeRender} from "./processCodeRender";

export const renderDomByMd = (vditor: IVditor, md: string, enableInput = true) => {
    const editorElement = vditor.wysiwyg.element;
    editorElement.innerHTML = vditor.lute.Md2VditorDOM(md);

    editorElement.querySelectorAll(".vditor-wysiwyg__block").forEach((blockElement: HTMLElement) => {
        processCodeRender(blockElement, vditor);
        blockElement.firstElementChild.setAttribute("style", "display:none");
    });

    afterRenderEvent(vditor, {
        enableAddUndoStack: true,
        enableHint: false,
        enableInput,
    });
};
