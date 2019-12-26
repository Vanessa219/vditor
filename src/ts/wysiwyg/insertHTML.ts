import {processPreCode} from "./processPreCode";

export const insertHTML = (html: string, editor: {
    element: HTMLPreElement,
    popover: HTMLDivElement,
}) => {
    const pasteElement = document.createElement("template");
    pasteElement.innerHTML = html;

    const range = getSelection().getRangeAt(0);
    range.insertNode(pasteElement.content.cloneNode(true));
    range.collapse(false);

    editor.element.insertAdjacentElement("beforeend", editor.popover);
    processPreCode(editor.element);
};
