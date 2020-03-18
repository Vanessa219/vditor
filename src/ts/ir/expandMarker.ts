import {hasClosestByClassName, hasTopClosestByClassName} from "../util/hasClosest";

const nextIsNode = (range: Range) => {
    if (range.startContainer.nodeType === 3 && range.startContainer.nodeValue.length !== range.startOffset) {
        return false;
    }
    let nextNode: HTMLElement = range.startContainer.nextSibling as HTMLElement;

    while (nextNode && nextNode.textContent === "") {
        nextNode = nextNode.nextSibling as HTMLElement;
    }

    if (!nextNode) {
        // *em*|**string**
        const markerElement = hasClosestByClassName(range.startContainer, "vditor-ir__marker");
        if (markerElement && !markerElement.nextSibling) {
            const parentNextNode = range.startContainer.parentElement.parentElement.nextSibling as HTMLElement;
            if (parentNextNode && parentNextNode.nodeType !== 3 &&
                parentNextNode.classList.contains("vditor-ir__node")) {
                return parentNextNode;
            }
        }
        return false;
    } else if (nextNode && nextNode.nodeType !== 3 && nextNode.classList.contains("vditor-ir__node")) {
        // test|*em*
        return nextNode;
    }

    return false;
};

export const expandMarker = (range: Range, vditor: IVditor) => {
    Array.from(vditor.ir.element.querySelectorAll(".vditor-ir__node--expand")).forEach((item) => {
        item.classList.remove("vditor-ir__node--expand");
    });

    const nodeElement = hasTopClosestByClassName(range.startContainer, "vditor-ir__node");
    if (nodeElement) {
        nodeElement.classList.add("vditor-ir__node--expand");
    }

    const nextNode = nextIsNode(range);
    if (nextNode) {
        nextNode.classList.add("vditor-ir__node--expand");
        return;
    }
};
