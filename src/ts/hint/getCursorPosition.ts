import {isSafari} from "../util/isSafari";

export const getCursorPosition = (editor: HTMLElement) => {
    const parentRect = editor.parentElement.getBoundingClientRect();
    const range = window.getSelection().getRangeAt(0);
    const startNode = range.startContainer.childNodes[range.startOffset] as HTMLElement;
    let cursorRect;
    if (startNode) {
        if (startNode.nodeType === 3 && startNode.textContent === "" && startNode.nextElementSibling &&
            startNode.nextElementSibling.getClientRects().length > 0) {
            cursorRect = startNode.nextElementSibling.getClientRects()[0];
        } else {
            let parentElement = startNode
            while (!parentElement.getClientRects ||
            (parentElement.getClientRects && parentElement.getClientRects().length === 0)) {
                parentElement = parentElement.parentElement
            }
            cursorRect = parentElement.getClientRects()[0];
        }
    } else {
        const startOffset = range.startOffset;
        // fix Safari
        if (isSafari()) {
            range.setStart(range.startContainer, Math.max(0, startOffset - 1));
        }
        cursorRect = range.getBoundingClientRect();
        // fix Safari
        if (isSafari()) {
            range.setStart(range.startContainer, startOffset);
        }
    }
    return {
        left: cursorRect.left - parentRect.left,
        top: cursorRect.top - parentRect.top,
    };
};
