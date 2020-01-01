export const insertHTML = (html: string) => {
    const pasteElement = document.createElement("template");
    pasteElement.innerHTML = html;

    const range = getSelection().getRangeAt(0);
    if (!range.collapsed) {
        range.extractContents();
    }
    range.insertNode(pasteElement.content.cloneNode(true));
    range.collapse(false);
};
