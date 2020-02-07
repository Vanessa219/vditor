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
