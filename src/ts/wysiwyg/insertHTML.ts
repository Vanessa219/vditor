import {processCodeData} from "./processCodeData";

export const insertHTML = (html: string, editor: {
    element: HTMLPreElement,
    popover: HTMLDivElement,
},                         targetElement: HTMLElement, textPlain: string) => {
    const pasteElement = document.createElement("template");
    pasteElement.innerHTML = targetElement.tagName === "CODE" ? textPlain : html;

    const range = getSelection().getRangeAt(0);
    if (!range.collapsed) {
        range.extractContents();
    }
    range.insertNode(pasteElement.content.cloneNode(true));
    range.collapse(false);

    if (targetElement.tagName === "CODE") {
        targetElement.setAttribute("data-code", encodeURIComponent(targetElement.innerText));
    } else {
        processCodeData(editor.element);
    }

};
