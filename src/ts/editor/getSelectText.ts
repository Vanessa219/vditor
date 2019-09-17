import {selectIsEditor} from "./selectIsEditor";

export const getSelectText = (editor: HTMLElement, range?: Range) => {
    if (!range) {
        if (window.getSelection().rangeCount === 0) {
            return "";
        } else {
            range = window.getSelection().getRangeAt(0);
        }
    }
    if (selectIsEditor(editor, range)) {
        return window.getSelection().toString();
    }
    return "";
};
