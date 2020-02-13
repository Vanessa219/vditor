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
            html += previousNode.textContent;
        } else {
            html += (previousNode as HTMLElement).outerHTML;
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
