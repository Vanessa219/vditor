import {isSafari} from "../util/isSafari";

export const getCursorPosition = (editor: HTMLPreElement) => {
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
        const startOffset = range.startOffset;
        // fix Safari
        if (isSafari()) {
            range.setStart(range.startContainer, startOffset - 1);
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
