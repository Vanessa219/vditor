export const getCursorPosition = (editor: HTMLDivElement) => {
    const parentRect = editor.parentElement.getBoundingClientRect();
    const range = window.getSelection().getRangeAt(0);
    const startNode = range.startContainer.childNodes[range.startOffset] as HTMLElement;
    let cursorRect;
    if (startNode) {
        if (startNode.nodeType === 3 && startNode.textContent === "") {
            cursorRect = startNode.nextElementSibling.getClientRects()[0];
        } else if (startNode.getClientRects) {
            cursorRect = startNode.getClientRects()[0];
        }
    } else {
        cursorRect = range.getBoundingClientRect();
    }
    return {
        left: cursorRect.left - parentRect.left,
        top: cursorRect.top - parentRect.top,
    };
};
