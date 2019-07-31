const getNodeOffset = (childNodes: NodeListOf<ChildNode>, position: number) => {
    let nodeIndex = 0;
    let offsetIndex = 0;
    let lastIndex = 0;
    Array.from(childNodes).some((node: HTMLElement, index: number) => {
        let nodeLength = node.textContent.length;
        if (node.nodeName === "BR") {
            nodeLength = 1;
        }
        if (lastIndex + nodeLength >= position) {
            if (node.nodeName === "BR") {
                offsetIndex = 0;
            } else {
                offsetIndex = position - lastIndex;
            }
            nodeIndex = index;
            return true;
        }
        lastIndex += nodeLength;
    });
    return {node: childNodes[nodeIndex], offset: offsetIndex};
};

export const setSelectionFocus = (range: Range) => {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
};

export const setSelectionByPosition = (start: number, end: number, editor: HTMLDivElement) => {
    const startObj = getNodeOffset(editor.childNodes, start);
    const endObj = getNodeOffset(editor.childNodes, end);
    const range = document.createRange();
    range.setStart(startObj.node, startObj.offset);
    range.setEnd(endObj.node, endObj.offset);
    setSelectionFocus(range);
    return range;
};

export const setSelectionByNode = (startNode: Node, endNode: Node, range: Range) => {
    range.setStartAfter(startNode);
    range.setEndAfter(endNode);
    setSelectionFocus(range);
};

export const setSelectionByStar = (startNode: Node, offset: number, range: Range) => {
    range.setStart(startNode, offset);
    setSelectionFocus(range);
};
