import {enableToolbar} from "../toolbar/enableToolbar";
import {removeCurrentToolbar} from "../toolbar/removeCurrentToolbar";
import {afterRenderEvent} from "./afterRenderEvent";
import {processPreCode} from "./processPreCode";

export const renderDomByMd = (vditor: IVditor, md: string) => {
    const allToolbar = ["headings", "bold", "italic", "strike", "line", "quote",
        "list", "ordered-list", "check", "code", "inline-code", "upload", "link", "table", "record"];
    removeCurrentToolbar(vditor.toolbar.elements, allToolbar);
    enableToolbar(vditor.toolbar.elements, allToolbar);

    const blockElement = vditor.wysiwyg.element;
    blockElement.innerHTML = vditor.lute.Md2VditorDOM(md);
    processPreCode(blockElement);

    afterRenderEvent(vditor);
};
