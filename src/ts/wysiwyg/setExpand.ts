export const setExpand = (element: HTMLElement) => {
    const range = getSelection().getRangeAt(0);

    // Test: __123__**456** **789* and * foo**bar**

    // rm node--expand
    element.querySelectorAll(".node--expand").forEach((e) => {
        e.className = e.className.replace(" node--expand", "");
    });

    let nodeElement = range.startContainer as Element;
    while (nodeElement) {
        if (nodeElement.nodeType === 3) {
            nodeElement = nodeElement.parentElement.closest(".node");
        } else {
            if (nodeElement.closest(".node") &&
                nodeElement.closest(".node").isEqualNode(nodeElement)) {
                nodeElement = nodeElement.parentElement.closest(".node");
            } else {
                nodeElement = nodeElement.closest(".node");
            }
        }
        if (nodeElement && nodeElement.className.indexOf("node--expand") === -1) {
            // 光标的所有父节点
            nodeElement.className += " node--expand";
        }
    }

    if (range.startContainer.nodeType === 3 &&
        range.startContainer.textContent.length === range.startOffset &&
        range.startContainer.parentElement.nextElementSibling &&
        range.startContainer.parentElement.nextElementSibling.className.indexOf("node") > -1) {
        // 光标在普通文本和节点前，**789*
        range.startContainer.parentElement.nextElementSibling.className += " node--expand";
    } else {
        const startNodeElement = range.startContainer.parentElement.closest(".node");
        if (range.startContainer.nodeType === 3 &&
            range.startContainer.textContent.length === range.startOffset &&
            range.startContainer.parentElement.className.indexOf("marker") > -1 &&
            startNodeElement &&
            startNodeElement.nextSibling &&
            startNodeElement.nextSibling.isEqualNode(startNodeElement.nextElementSibling) &&
            !range.startContainer.parentElement.nextElementSibling &&
            startNodeElement.nextElementSibling &&
            startNodeElement.nextElementSibling.className.indexOf("node") > -1) {
            // 光标在两个节点中间，__123__**456**
            startNodeElement.nextElementSibling.className += " node--expand";
        }
    }

    if (!range.collapsed) {
        // 展开多选中的节点
        const ancestorElement = range.commonAncestorContainer as HTMLElement;
        if (ancestorElement.nodeType !== 3 && ancestorElement.tagName !== "SPAN") {
            ancestorElement.querySelectorAll(".node").forEach((e) => {
                if (getSelection().containsNode(e, true)) {
                    e.className += " node--expand";
                }
            });
        }
    }
};
