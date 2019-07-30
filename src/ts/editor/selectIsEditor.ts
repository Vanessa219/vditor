export const selectIsEditor = (range: Range, editor: HTMLDivElement) => {
    return (editor.isEqualNode(range.commonAncestorContainer.parentElement) ||
        editor.isEqualNode(range.commonAncestorContainer));
};
