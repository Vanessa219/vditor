import {highlightToolbar} from "./highlightToolbar";

export const setHeading = (vditor: IVditor, tagName: string) => {
    document.execCommand("formatblock", false, tagName);
    // https://github.com/Vanessa219/vditor/issues/50
    const range = getSelection().getRangeAt(0);
    if (!range.collapsed && !range.startContainer.isEqualNode(range.endContainer)) {
        range.setStart(range.endContainer, 0);
    }
    highlightToolbar(vditor);
};

export const removeHeading = (vditor: IVditor) => {
    document.execCommand("formatBlock", false, "p");
    // https://github.com/Vanessa219/vditor/issues/50
    const range = getSelection().getRangeAt(0);
    if (!range.collapsed && !range.startContainer.isEqualNode(range.endContainer)) {
        range.setStart(range.endContainer, 0);
    }
    highlightToolbar(vditor);
}
