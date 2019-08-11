export const selectIsEditor = (editor: HTMLPreElement, range?: Range) => {
    let isEditor = false;
    if (!range) {
        if (window.getSelection().rangeCount === 0) {
            return isEditor;
        } else {
            range = window.getSelection().getRangeAt(0);
        }
    }
    let container = range.commonAncestorContainer;
    while (container) {
        if (editor.isEqualNode(container)) {
            isEditor = true;
            container = undefined;
        }
        if (container) {
            if (container.nodeName === "BODY") {
                container = undefined;
            } else {
                container = container.parentElement;
            }
        }
    }
    return isEditor;
};
