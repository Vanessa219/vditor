import {hasClosestBlock, hasClosestByMatchTag} from "../util/hasClosest";
import {getEditorRange, setRangeByWbr} from "../util/selection";
import {renderToc} from "../util/toc";

const createBlockElement = (element: HTMLElement, tagName: string) => {
    const blockElement = element.ownerDocument.createElement(tagName);
    blockElement.setAttribute("data-block", "0");
    return blockElement;
};

const replaceBlockElement = (element: HTMLElement, tagName: string) => {
    const blockElement = createBlockElement(element, tagName);
    while (element.firstChild) {
        blockElement.appendChild(element.firstChild);
    }
    element.replaceWith(blockElement);
    return blockElement;
};

const isListItemBlock = (node: Node) => {
    if (node.nodeType !== 1) {
        return false;
    }
    const element = node as HTMLElement;
    return element.getAttribute("data-block") === "0" || element.tagName === "INPUT";
};

const getListItemInlineNodes = (itemElement: HTMLElement, wbrElement: HTMLElement) => {
    let anchorNode: Node = wbrElement;
    while (anchorNode.parentNode && !anchorNode.parentNode.isSameNode(itemElement)) {
        anchorNode = anchorNode.parentNode;
    }
    if (!anchorNode.parentNode?.isSameNode(itemElement)) {
        return [];
    }

    let firstNode = anchorNode;
    let lastNode = anchorNode;
    while (firstNode.previousSibling && !isListItemBlock(firstNode.previousSibling)) {
        firstNode = firstNode.previousSibling;
    }
    while (lastNode.nextSibling && !isListItemBlock(lastNode.nextSibling)) {
        lastNode = lastNode.nextSibling;
    }

    // 任务列表的复选框和正文之间需要保留分隔空格。
    if (firstNode.previousSibling instanceof HTMLInputElement && firstNode.nodeType === 3) {
        const leadingWhitespace = firstNode.textContent.match(/^\s+/)?.[0];
        if (leadingWhitespace) {
            firstNode.textContent = firstNode.textContent.substring(leadingWhitespace.length);
            itemElement.insertBefore(itemElement.ownerDocument.createTextNode(leadingWhitespace), firstNode);
        }
    }

    const nodes: Node[] = [];
    let node: Node = firstNode;
    while (node) {
        nodes.push(node);
        if (node.isSameNode(lastNode)) {
            break;
        }
        node = node.nextSibling;
    }
    return nodes;
};

const setListItemHeading = (itemElement: HTMLElement, wbrElement: HTMLElement, tagName: string) => {
    const inlineNodes = getListItemInlineNodes(itemElement, wbrElement);
    if (inlineNodes.length === 0) {
        return false;
    }

    const headingElement = createBlockElement(itemElement, tagName);
    itemElement.insertBefore(headingElement, inlineNodes[0]);
    inlineNodes.forEach((node) => {
        headingElement.appendChild(node);
    });
    if (headingElement.innerHTML.trim() === "<wbr>") {
        headingElement.appendChild(itemElement.ownerDocument.createElement("br"));
    }
    return true;
};

const unwrapBlockElement = (element: HTMLElement) => {
    const fragment = element.ownerDocument.createDocumentFragment();
    while (element.firstChild) {
        fragment.appendChild(element.firstChild);
    }
    element.replaceWith(fragment);
};

export const setHeading = (vditor: IVditor, tagName: string) => {
    const range = getEditorRange(vditor);
    let blockElement = hasClosestBlock(range.startContainer);
    if (!blockElement) {
        blockElement = range.startContainer.childNodes[range.startOffset] as HTMLElement;
    }
    if (!blockElement && vditor.wysiwyg.element.children.length === 0) {
        blockElement = vditor.wysiwyg.element;
    }
    if (blockElement && !blockElement.classList.contains("vditor-wysiwyg__block")) {
        const wbrElement = document.createElement("wbr");
        range.insertNode(wbrElement);
        // Firefox 需要 trim https://github.com/Vanessa219/vditor/issues/207
        if (blockElement.innerHTML.trim() === "<wbr>") {
            // Firefox 光标对不齐 https://github.com/Vanessa219/vditor/issues/199 1
            blockElement.innerHTML = "<wbr><br>";
        }
        const itemElement = hasClosestByMatchTag(wbrElement, "LI");
        if (itemElement && blockElement.isSameNode(itemElement.parentElement)) {
            if (!setListItemHeading(itemElement, wbrElement, tagName)) {
                wbrElement.remove();
                return;
            }
        } else if (blockElement.tagName === "BLOCKQUOTE" || blockElement.classList.contains("vditor-reset")) {
            const headingElement = createBlockElement(blockElement, tagName);
            while (blockElement.firstChild) {
                headingElement.appendChild(blockElement.firstChild);
            }
            blockElement.appendChild(headingElement);
        } else {
            replaceBlockElement(blockElement, tagName);
        }
        setRangeByWbr(vditor.wysiwyg.element, range);
        renderToc(vditor);
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
        if (blockElement.parentElement?.tagName === "LI" &&
            blockElement.parentElement.parentElement?.getAttribute("data-tight") === "true") {
            unwrapBlockElement(blockElement);
        } else {
            replaceBlockElement(blockElement, "p");
        }
        setRangeByWbr(vditor.wysiwyg.element, range);
        renderToc(vditor);
    }
    vditor.wysiwyg.popover.style.display = "none";
};
