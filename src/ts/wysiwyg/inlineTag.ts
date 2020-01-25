export const nextIsCode = (range: Range) => {
    let nextNode: HTMLElement = range.startContainer.nextSibling as HTMLElement;
    while (nextNode && nextNode.textContent === "") {
        nextNode = nextNode.nextSibling as HTMLElement;
    }

    if (nextNode.tagName === "CODE" ||
        nextNode.getAttribute('data-type') === "math-inline" ||
        nextNode.getAttribute('data-type') === "html-inline"
    ) {
        return true;
    }
    return false;
};
