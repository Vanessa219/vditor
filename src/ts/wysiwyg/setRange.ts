import {setSelectionFocus} from "../editor/setSelection";

export const setRange = (element: HTMLElement, range?: Range) => {
    const startElement = element.querySelector("[data-cso]");
    const endElement = element.querySelector("[data-ceo]");
    if (!range) {
        range =  element.ownerDocument.createRange();
    }
    range.setStart(startElement.childNodes[0] || startElement,
        parseInt(startElement.getAttribute("data-cso"), 10));
    range.setEnd(endElement.childNodes[0] || endElement, parseInt(endElement.getAttribute("data-ceo"), 10));
    setSelectionFocus(range);

    startElement.removeAttribute("data-cso");
    endElement.removeAttribute("data-ceo");
};
