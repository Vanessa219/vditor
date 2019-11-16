export const getCursorPosition = (editor: HTMLElement) => {
    const parentRect = editor.parentElement.getBoundingClientRect();
    const range = window.getSelection().getRangeAt(0);
    let cursorRect;
    if (range.getClientRects().length === 0) {
        let parentElement = range.startContainer.childNodes[range.startOffset] as HTMLElement;
        while (!parentElement.getClientRects ||
        (parentElement.getClientRects && parentElement.getClientRects().length === 0)) {
            parentElement = parentElement.parentElement;
        }
        cursorRect = parentElement.getClientRects()[0];
    } else {
        cursorRect = range.getClientRects()[0]
    }

    return {
        left: cursorRect.left - parentRect.left,
        top: cursorRect.top - parentRect.top,
    };
};
