import {Constants} from "../constants";

export const previoueIsEmptyA = (node: Node) => {
    let previousNode = node.previousSibling as HTMLElement;
    while (previousNode) {
        if (previousNode.nodeType !== 3 && previousNode.tagName === "A" && !previousNode.previousSibling
            && previousNode.textContent.replace(Constants.ZWSP, "") === "" && previousNode.nextSibling) {
            return previousNode;
        }
        previousNode = previousNode.previousSibling as HTMLElement;
    }
    return false;
};

export const nextIsCode = (range: Range) => {
    let nextNode: HTMLElement = range.startContainer.nextSibling as HTMLElement;
    while (nextNode && nextNode.textContent === "") {
        nextNode = nextNode.nextSibling as HTMLElement;
    }

    if (nextNode && nextNode.nodeType !== 3 && (nextNode.tagName === "CODE" ||
        nextNode.getAttribute("data-type") === "math-inline" ||
        nextNode.getAttribute("data-type") === "html-inline")
    ) {
        return true;
    }
    return false;
};

export const nextIsImg = (range: Range) => {
    if (range.startContainer.nodeType === 3 && range.startContainer.textContent.length === range.startOffset) {
        let nextNode: HTMLElement = range.startContainer.nextSibling as HTMLElement;
        while (nextNode && nextNode.textContent === "" && nextNode.nodeType === 3) {
            nextNode = nextNode.nextSibling as HTMLElement;
        }
        if (nextNode && nextNode.nodeType !== 3 && nextNode.tagName === "IMG") {
            return nextNode;
        }
        return false;
    }
    return false;
};

export const getNextHTML = (node: Node) => {
    let html = "";
    let nextNode = node.nextSibling;
    while (nextNode) {
        if (nextNode.nodeType === 3) {
            html += nextNode.textContent;
        } else {
            html += (nextNode as HTMLElement).outerHTML;
        }
        nextNode = nextNode.nextSibling;
    }
    return html;
};

export const getPreviousHTML = (node: Node) => {
    let html = "";
    let previousNode = node.previousSibling;
    while (previousNode) {
        if (previousNode.nodeType === 3) {
            html = previousNode.textContent + html;
        } else {
            html = (previousNode as HTMLElement).outerHTML + html;
        }
        previousNode = previousNode.previousSibling;
    }
    return html;
};

export const getRenderElementNextNode = (blockCodeElement: HTMLElement) => {
    let nextNode = blockCodeElement;
    while (nextNode && !nextNode.nextSibling) {
        nextNode = nextNode.parentElement;
    }

    return nextNode.nextSibling;
};

export const getLastNode = (node: Node) => {
    while (node && node.lastChild) {
        node = node.lastChild;
    }
    return node;
};

export const splitElement = (range: Range) => {
    const previousHTML = getPreviousHTML(range.startContainer);
    const nextHTML = getNextHTML(range.startContainer);
    const text = range.startContainer.textContent;
    const offset = range.startOffset;

    let beforeHTML = "";
    let afterHTML = "";

    if (text.substr(0, offset) !== "" && text.substr(0, offset) !== Constants.ZWSP || previousHTML) {
        beforeHTML = `${previousHTML}${text.substr(0, offset)}`;
    }
    if (text.substr(offset) !== "" && text.substr(offset) !== Constants.ZWSP || nextHTML) {
        afterHTML = `${text.substr(offset)}${nextHTML}`;
    }

    return {
        afterHTML,
        beforeHTML,
    };
};
