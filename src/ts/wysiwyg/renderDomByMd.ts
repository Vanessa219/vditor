import {enableToolbar} from "../toolbar/enableToolbar";
import {removeCurrentToolbar} from "../toolbar/removeCurrentToolbar";
import {log} from "../util/log";
import {afterRenderEvent} from "./afterRenderEvent";
import {processCodeRender} from "./processCodeRender";

export const renderDomByMd = (vditor: IVditor, md: string) => {
    const allToolbar = ["headings", "bold", "italic", "strike", "line", "quote",
        "list", "ordered-list", "check", "code", "inline-code", "upload", "link", "table", "record"];
    removeCurrentToolbar(vditor.toolbar.elements, allToolbar);
    enableToolbar(vditor.toolbar.elements, allToolbar);

    const editorElement = vditor.wysiwyg.element;
    const innerHTML = vditor.lute.Md2VditorDOM(md) || '<p data-block="0">\n</p>';
    log("Md2VditorDOM", md, "arguments", vditor.options.debugger);
    log("Md2VditorDOM", innerHTML, "result", vditor.options.debugger);
    editorElement.innerHTML = innerHTML;

    editorElement.querySelectorAll(".vditor-wysiwyg__block").forEach((blockElement: HTMLElement) => {
        processCodeRender(blockElement, vditor);
        blockElement.firstElementChild.setAttribute("style", "display:none");
    });

    afterRenderEvent(vditor);
};
