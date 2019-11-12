export const selectIsEditor = (editor: HTMLElement, range?: Range) => {
    let isEditor = false;
    if (!range) {
        if (window.getSelection().rangeCount === 0) {
            return isEditor;
        } else {
            range = window.getSelection().getRangeAt(0);
        }
    }
    let container = range.commonAncestorContainer;

    return editor.isEqualNode(container) || editor.contains(container);
};
