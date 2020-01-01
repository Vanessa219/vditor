import {setSelectionFocus} from "../editor/setSelection";

export const setRangeByWbr = (element: HTMLElement, range: Range) => {
    const wbrElement = element.querySelector("wbr");
    if (!wbrElement) {
        return;
    }
    if (!wbrElement.previousElementSibling) {
        if (wbrElement.previousSibling) {
            // text<wbr>
            range.setStart(wbrElement.previousSibling, wbrElement.previousSibling.textContent.length);
        } else {
            // 内容为空
            range.setStartBefore(wbrElement);
        }
    } else {
        if (wbrElement.previousElementSibling.isEqualNode(wbrElement.previousSibling)) {
            if (wbrElement.previousElementSibling.lastChild) {
                // <em>text</em><wbr>
                range.setStartBefore(wbrElement);
                setSelectionFocus(range);
                // fix Chrome set range bug
                if (wbrElement.previousElementSibling.tagName === "EM") {
                    document.execCommand("italic", false, "");
                } else if (wbrElement.previousElementSibling.tagName === "STRONG") {
                    document.execCommand("bold", false, "");
                } else if (wbrElement.previousElementSibling.tagName === "S") {
                    document.execCommand("strikeThrough", false, "");
                }
                return;
            } else {
                // <br><wbr>
                range.setStartAfter(wbrElement.previousElementSibling);
            }
        } else {
            // <em>text</em>text<wbr>
            range.setStart(wbrElement.previousSibling, wbrElement.previousSibling.textContent.length);
        }
    }
    wbrElement.remove();
    setSelectionFocus(range);
};
