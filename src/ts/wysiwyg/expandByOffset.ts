export const expandByOffset = (elment: HTMLElement, offset: number) => {
    let charIndex = 0
    let nodeStack = [elment]
    let node
    let expanded = false

    while (!expanded && (node = nodeStack.pop())) {
        if (node.nodeType == 3) {
            let nextCharIndex = charIndex + node.textContent.length;
            let nodeElement = node.parentElement.closest('.node')
            if (!expanded && offset >= charIndex && offset <= nextCharIndex && nodeElement) {
                nodeElement.className = 'node node--expand'
                expanded = true;
            }
            charIndex = nextCharIndex;
        } else {
            let i = node.childNodes.length;
            while (i--) {
                nodeStack.push(node.childNodes[i] as HTMLElement);
            }
        }
    }
};
