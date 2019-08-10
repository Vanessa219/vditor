export const setSelectionFocus = (range: Range) => {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
};

export const setSelectionByPosition = (start: number, end: number, editor: HTMLDivElement) => {
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
            } else {
                range.setStartBefore(pNode.nextSibling);
            }
            foundStart = true;
        }
        if (foundStart && end >= charIndex && end <= nextCharIndex) {
            if (pNode.childNodes[0].nodeType === 3) {
                range.setEnd(pNode.childNodes[0], end - charIndex);
            } else {
                range.setEndBefore(pNode.nextSibling);
            }
            stop = true;
        }
        charIndex = nextCharIndex;
        pNode = editor.childNodes[++line];
    }

    setSelectionFocus(range);
    return range;
};

export const setSelectionByStartEndNode = (startNode: Node, endNode: Node, range: Range) => {
    range.setStartAfter(startNode);
    range.setEndAfter(endNode);
    setSelectionFocus(range);
};

export const setSelectionByStar = (startNode: Node, offset: number, range: Range) => {
    range.setStart(startNode, offset);
    setSelectionFocus(range);
};

export const setSelectionByInlineText = (text: string, childNodes: NodeListOf<ChildNode>) => {
    let offset = 0;
    let startIndex = 0;
    Array.from(childNodes).some((node: HTMLElement, index: number) => {
        startIndex = node.textContent.indexOf(text);
        if (node.nodeType === 3 && startIndex > -1) {
            offset = index;
            return true;
        }
    });
    if (startIndex < 0) {
        return;
    }
    const range = document.createRange();
    range.setStart(childNodes[offset], startIndex);
    range.setEnd(childNodes[offset], startIndex + text.length);
    setSelectionFocus(range);
};

export const setSelectionByNode = (node: Node) => {
    const range = document.createRange();
    range.selectNodeContents(node);
    setSelectionFocus(range);
};
