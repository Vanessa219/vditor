import {processCodeData} from "./processCodeData";

export const insertHTML = (html: string, vditor: IVditor) => {
    const pasteElement = document.createElement("template");
    pasteElement.innerHTML = html;

    const range = getSelection().getRangeAt(0);
    if (!range.collapsed) {
        vditor.wysiwyg.preventInput = true;
        document.execCommand("delete", false, "");

    }
    range.insertNode(pasteElement.content.cloneNode(true));
    range.collapse(false);
    processCodeData(vditor.wysiwyg.element);
};
