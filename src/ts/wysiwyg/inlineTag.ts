export const nextIsCode = (range: Range) => {
    let nextNode = range.startContainer.nextSibling;
    while (nextNode && nextNode.textContent === "") {
        nextNode = nextNode.nextSibling;
    }

    if ((nextNode as HTMLElement).tagName === "CODE") {
        return true;
    }
    return false;
};
