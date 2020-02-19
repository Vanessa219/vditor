import {hasClosestBlock} from "../util/hasClosest";
import {setRangeByWbr} from "./setRangeByWbr";

export const setHeading = (vditor: IVditor, tagName: string) => {
    const range = getSelection().getRangeAt(0);
    range.insertNode(document.createElement("wbr"));

    const blockElement = hasClosestBlock(range.startContainer);
    if (blockElement) {
        blockElement.outerHTML = `<${tagName} data-block="0">${blockElement.innerHTML}</${tagName}>`;
    }
    setRangeByWbr(vditor.wysiwyg.element, range);
};

export const removeHeading = (vditor: IVditor) => {
    const range = getSelection().getRangeAt(0);
    range.insertNode(document.createElement("wbr"));

    const blockElement = hasClosestBlock(range.startContainer);
    if (blockElement) {
        blockElement.outerHTML = `<p data-block="0">${blockElement.innerHTML}</p>`;
    }
    setRangeByWbr(vditor.wysiwyg.element, range);
};
