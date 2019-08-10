export const selectIsEditor = (range: Range, editor: HTMLDivElement) => {
    let container = range.commonAncestorContainer;
    let isEditor = false;
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
