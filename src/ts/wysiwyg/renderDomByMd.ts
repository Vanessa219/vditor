import {afterRenderEvent} from "./afterRenderEvent";

export const renderDomByMd = (vditor: IVditor, md: string) => {
    const blockElement = vditor.wysiwyg.element;
    blockElement.innerHTML =  vditor.lute.Md2VditorDOM(md);
    vditor.wysiwyg.element.insertAdjacentElement("beforeend", vditor.wysiwyg.popover);

    afterRenderEvent(vditor);
};
