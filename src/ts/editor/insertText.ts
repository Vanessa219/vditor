import {inputEvent} from "./inputEvent";

const genNode = (text: string) => {
    const spanElement = document.createElement("span");
    spanElement.innerText = text;
    return spanElement
}

export const insertText = (vditor: IVditor, prefix: string, suffix: string, replace: boolean = false, toggle: boolean = true,
                           range: Range = window.getSelection().getRangeAt(0)) => {
    if (range.collapsed) {
        // no selection
        range.insertNode(genNode(prefix + suffix));
        range.setStart(range.endContainer, range.endOffset)
        // textarea.selectionStart = textarea.selectionEnd = textarea.selectionStart - suffix.length;
    } else {
        if (replace) {
            range.deleteContents();
            range.insertNode(genNode(prefix + suffix));
        } else {
            const selectDom = range.commonAncestorContainer.textContent
            const selectString = range.toString()
            if (selectDom.substring(range.startOffset - prefix.length, range.startOffset) === prefix &&
                selectDom.substring(range.endOffset, range.endOffset + suffix.length) === suffix && toggle) {
                range.setStart(range.startContainer, range.startOffset - prefix.length)
                range.setEnd(range.endContainer, range.endOffset + suffix.length)
                range.deleteContents()
                range.insertNode(genNode(prefix + range.toString() + suffix));
                // textarea.selectionStart = startPos - prefix.length;
                // textarea.selectionEnd = endPos - prefix.length;
            } else {
                // insert
                range.insertNode(genNode(prefix + selectString + suffix));
                // textarea.selectionStart = startPos + prefix.length;
                // textarea.selectionEnd = endPos + prefix.length;
            }
        }
    }
    inputEvent(vditor)
}