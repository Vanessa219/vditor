import {selectIsEditor} from "./selectIsEditor";

export const getSelectPosition = (editorElement: HTMLElement, range?: Range) => {
    const position = {
        end: 0,
        start: 0,
    };

    if (!range) {
        if (window.getSelection().rangeCount === 0) {
            return position;
        }
        range = window.getSelection().getRangeAt(0);
    }

    if (selectIsEditor(editorElement, range)) {
        const preSelectionRange = range.cloneRange();
        if (editorElement.childNodes[0] && editorElement.childNodes[0].childNodes[0]) {
            preSelectionRange.setStart(editorElement.childNodes[0].childNodes[0], 0);
        } else {
            preSelectionRange.selectNodeContents(editorElement);
        }
        if (range.startContainer.childNodes.length === 1 && range.startContainer.textContent.trim() === "" &&
            editorElement.childNodes[0].childNodes[0]) {
            preSelectionRange.setEnd(editorElement.childNodes[0].childNodes[0], 0);
        } else {
            preSelectionRange.setEnd(range.startContainer, range.startOffset);
        }
        position.start = preSelectionRange.toString().length;
        position.end = position.start + range.toString().length;
    }
    return position;
};
