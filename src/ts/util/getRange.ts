export const getRange = (element: HTMLElement) => {
    const selection = getSelection();
    if (selection.rangeCount > 0) {
        return selection.getRangeAt(0);
    } else {
        const range = element.ownerDocument.createRange();
        range.setStart(element, 0);
        range.collapse(true);
        return range;
    }
};
