export const getCursorPosition = (editor: HTMLElement) => {
    const parentRect = editor.parentElement.getBoundingClientRect();
    const range = window.getSelection().getRangeAt(0);
    let cursorRect;
    if (range.getClientRects().length === 0) {
        if (range.startContainer.childNodes[range.startOffset] &&
            (range.startContainer.childNodes[range.startOffset] as HTMLElement).getClientRects().length > 0) {
            // markdown 模式回车
            cursorRect = (range.startContainer.childNodes[range.startOffset] as HTMLElement).getClientRects()[0];
        } else {
            cursorRect = (range.startContainer as HTMLElement).getClientRects()[0]; // <td></td>
        }
        if (!cursorRect) {
            let parentElement = range.startContainer.childNodes[range.startOffset] as HTMLElement;
            while (!parentElement.getClientRects ||
            (parentElement.getClientRects && parentElement.getClientRects().length === 0)) {
                parentElement = parentElement.parentElement;
            }
            cursorRect = parentElement.getClientRects()[0];
        }
    } else {
        cursorRect = range.getClientRects()[0];
    }

    return {
        left: cursorRect.left - parentRect.left,
        top: cursorRect.top - parentRect.top,
    };
};
