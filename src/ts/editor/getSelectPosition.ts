import {selectIsEditor} from "./selectIsEditor";

export const getSelectPosition = (editorElement: HTMLDivElement) => {
    const position = {
        end: 0,
        start: 0,
    };

    if (window.getSelection().rangeCount === 0) {
        return position;
    }

    const range = window.getSelection().getRangeAt(0);
    if (selectIsEditor(range, editorElement)) {
        const preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(editorElement);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        position.start = preSelectionRange.toString().length;
        position.end = position.start + range.toString().length;
    }
    return position;
};
