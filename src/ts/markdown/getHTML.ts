import {getMarkdown} from "./getMarkdown";
import {renderImageCaptionHTML} from "./imageCaptionRender";

export const getHTML = (vditor: IVditor) => {
    let html = "";
    if (vditor.currentMode === "sv") {
        html = vditor.lute.Md2HTML(getMarkdown(vditor));
    } else if (vditor.currentMode === "wysiwyg") {
        html = vditor.lute.VditorDOM2HTML(vditor.wysiwyg.element.innerHTML);
    } else if (vditor.currentMode === "ir") {
        html = vditor.lute.VditorIRDOM2HTML(vditor.ir.element.innerHTML);
    }
    return renderImageCaptionHTML(html, vditor.options.preview.markdown.imageCaption);
};
