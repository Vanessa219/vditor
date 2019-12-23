import {afterRenderEvent} from "./afterRenderEvent";
import {processPreCode} from "./processPreCode";

export const renderDomByMd = (vditor: IVditor, md: string) => {
    const blockElement = vditor.wysiwyg.element;
    blockElement.innerHTML = vditor.lute.Md2VditorDOM(md);
    processPreCode(blockElement);
    vditor.wysiwyg.element.insertAdjacentElement("beforeend", vditor.wysiwyg.popover);

    afterRenderEvent(vditor);
};
