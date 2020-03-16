import {setSelectionFocus} from "../util/selection";

export const setSelectionByInlineText = (text: string, childNodes: NodeListOf<ChildNode>) => {
    let offset = 0;
    let startIndex = 0;
    Array.from(childNodes).some((node: HTMLElement, index: number) => {
        startIndex = node.textContent.indexOf(text);
        if (startIndex > -1 && childNodes[index].childNodes[0].nodeType === 3) {
            offset = index;
            return true;
        }
    });
    if (startIndex < 0) {
        return;
    }
    const range = document.createRange();
    range.setStart(childNodes[offset].childNodes[0], startIndex);
    range.setEnd(childNodes[offset].childNodes[0], startIndex + text.length);
    setSelectionFocus(range);
};
