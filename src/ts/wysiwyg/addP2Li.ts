export const addP2Li = (listElement: Element) => {
    listElement.querySelectorAll("li").forEach((liElement: HTMLElement) => {
        let tempNodes = [];
        let node = liElement.firstChild as HTMLElement;
        while (node) {
            if (node.nodeType === 3) {
                tempNodes.push(node);
            } else if (node.tagName !== "UL" && node.tagName !== "OL" &&
                node.tagName !== "BLOCKQUOTE" && node.tagName !== "P") {
                tempNodes.push(node);
            } else if (tempNodes.length > 0) {
                const pElement = document.createElement("p");
                tempNodes.forEach((nodeItem) => {
                    pElement.appendChild(nodeItem);
                });
                node.insertAdjacentElement('beforebegin', pElement)
                tempNodes = [];
            }

            node = node.nextSibling as HTMLElement;
        }
    });
};
