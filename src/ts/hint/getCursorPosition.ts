export const getCursorPosition = (editor: HTMLDivElement) => {
    const parentRect = editor.parentElement.getBoundingClientRect();
    const cursorRect = window.getSelection().getRangeAt(0).getBoundingClientRect();
    return {
        left: cursorRect.left - parentRect.left,
        top: cursorRect.top - parentRect.top,
    };
};
