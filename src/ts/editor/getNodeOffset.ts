export const getNodeOffset = (childNodes: NodeListOf<ChildNode>, position: number) => {
    let nodeIndex = 0;
    let offsetIndex = 0;
    let lastIndex = 0;
    const nodeList: ChildNode[] = [];
    childNodes.forEach((node) => {
        if (node.childNodes && node.childNodes.length > 0) {
            node.childNodes.forEach((subNode) => {
                nodeList.push(subNode);
            });
        } else {
            nodeList.push(node);
        }
    });
    nodeList.some((node: HTMLElement, index: number) => {
        if (lastIndex + node.textContent.length >= position) {
            offsetIndex = position - lastIndex;
            nodeIndex = index;
            return true;
        }
        lastIndex += node.textContent.length;
    });
    return {node: nodeList[nodeIndex], offset: offsetIndex};
};
