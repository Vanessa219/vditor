export const setSelectionFocus = (range: Range) => {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
};

export const setSelectionByPosition = (start: number, end: number, editor: HTMLPreElement) => {
    const range = editor.ownerDocument.createRange();
    range.setStart(editor, 0);
    range.collapse(true);

    let charIndex = 0;
    let line = 0;
    let pNode = editor.childNodes[line];
    let foundStart = false;
    let stop = false;

    while (!stop && pNode) {
        const nextCharIndex = charIndex + pNode.textContent.length;
        if (!foundStart && start >= charIndex && start <= nextCharIndex) {
            if (pNode.childNodes[0].nodeType === 3) {
                range.setStart(pNode.childNodes[0], start - charIndex);
            } else if (pNode.nextSibling) {
                if (start === 0) {
                    range.setStartBefore(pNode);
                } else {
                    range.setStartBefore(pNode.nextSibling);
                }
            } else {
                range.setStartAfter(pNode);
            }
            foundStart = true;
        }
        if (foundStart && end >= charIndex && end <= nextCharIndex) {
            if (pNode.childNodes[0].nodeType === 3) {
                range.setEnd(pNode.childNodes[0], end - charIndex);
            } else if (pNode.nextSibling) {
                if (end === 0) {
                    range.setEndBefore(pNode);
                } else {
                    range.setEndBefore(pNode.nextSibling);
                }
            } else {
                range.setEndAfter(pNode);
            }
            stop = true;
        }
        charIndex = nextCharIndex;
        pNode = editor.childNodes[++line];
    }

    setSelectionFocus(range);
    return range;
};

export const setSelectionByInlineText = (text: string, childNodes: NodeListOf<ChildNode>) => {
    let offset = 0;
    let startIndex = 0;
    Array.from(childNodes).some((node: HTMLElement, index: number) => {
        startIndex = node.textContent.indexOf(text);
        if (startIndex > -1 && childNodes[index].childNodes[0].nodeType === 3) {
            offset = index;
            return true;
        }
    });
    if (startIndex < 0) {
        return;
    }
    const range = document.createRange();
    range.setStart(childNodes[offset].childNodes[0], startIndex);
    range.setEnd(childNodes[offset].childNodes[0], startIndex + text.length);
    setSelectionFocus(range);
};
