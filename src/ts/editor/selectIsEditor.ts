export const selectIsEditor = (editor: HTMLElement, range?: Range) => {
    if (!range) {
        if (window.getSelection().rangeCount === 0) {
            return false;
        } else {
            range = window.getSelection().getRangeAt(0);
        }
    }
    const container = range.commonAncestorContainer;

    return editor.isEqualNode(container) || editor.contains(container);
};
