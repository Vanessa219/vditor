import {hasClosestBlock} from "../util/hasClosest";
import {setRangeByWbr} from "./setRangeByWbr";

export const setHeading = (vditor: IVditor, tagName: string) => {
    const range = getSelection().getRangeAt(0);
    let blockElement = hasClosestBlock(range.startContainer);
    if (!blockElement) {
        blockElement = range.startContainer.childNodes[range.startOffset] as HTMLElement;
    }
    if (blockElement) {
        range.insertNode(document.createElement("wbr"));
        if (blockElement.tagName === "BLOCKQUOTE") {
            blockElement.innerHTML = `<${tagName} data-block="0">${blockElement.innerHTML}</${tagName}>`;
        } else {
            blockElement.outerHTML = `<${tagName} data-block="0">${blockElement.innerHTML}</${tagName}>`;
        }
        setRangeByWbr(vditor.wysiwyg.element, range);
    }
};

export const removeHeading = (vditor: IVditor) => {
    const range = getSelection().getRangeAt(0);
    let blockElement = hasClosestBlock(range.startContainer);
    if (!blockElement) {
        blockElement = range.startContainer.childNodes[range.startOffset] as HTMLElement;
    }
    if (blockElement) {
        range.insertNode(document.createElement("wbr"));
        blockElement.outerHTML = `<p data-block="0">${blockElement.innerHTML}</p>`;
        setRangeByWbr(vditor.wysiwyg.element, range);
    }
};
