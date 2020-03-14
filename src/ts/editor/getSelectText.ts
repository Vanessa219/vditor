import {selectIsEditor} from "../util/selection";

export const getSelectText = (editor: HTMLElement, range?: Range) => {
    if (selectIsEditor(editor, range)) {
        return getSelection().toString();
    }
    return "";
};
