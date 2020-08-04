import {hasClosestByClassName, hasTopClosestByClassName} from "../util/hasClosest";
import {setSelectionFocus} from "../util/selection";

const nextIsNode = (range: Range) => {
    const startContainer = range.startContainer;
    if (startContainer.nodeType === 3 && startContainer.nodeValue.length !== range.startOffset) {
        return false;
    }

    let nextNode: HTMLElement = startContainer.nextSibling as HTMLElement;

    while (nextNode && nextNode.textContent === "") {
        nextNode = nextNode.nextSibling as HTMLElement;
    }

    if (!nextNode) {
        // *em*|**string**
        const markerElement = hasClosestByClassName(startContainer, "vditor-ir__marker");
        if (markerElement && !markerElement.nextSibling) {
            const parentNextNode = startContainer.parentElement.parentElement.nextSibling as HTMLElement;
            if (parentNextNode && parentNextNode.nodeType !== 3 &&
                parentNextNode.classList.contains("vditor-ir__node")) {
                return parentNextNode;
            }
        }
        return false;
    } else if (nextNode && nextNode.nodeType !== 3 && nextNode.classList.contains("vditor-ir__node") &&
        !nextNode.getAttribute("data-block")) {
        // test|*em*
        return nextNode;
    }

    return false;
};

const previousIsNode = (range: Range) => {
    const startContainer = range.startContainer;
    const previousNode = startContainer.previousSibling as HTMLElement;
    if (startContainer.nodeType === 3 && range.startOffset === 0 && previousNode && previousNode.nodeType !== 3 &&
        // *em*|text
        previousNode.classList.contains("vditor-ir__node") && !previousNode.getAttribute("data-block")) {
        return previousNode;
    }
    return false;
};

export const expandMarker = (range: Range, vditor: IVditor, event: MouseEvent = null) => {
    vditor.ir.element.querySelectorAll(".vditor-ir__node--expand").forEach((item) => {
        item.classList.remove("vditor-ir__node--expand");
    });

    let eventTarget = event ? event.target : null;
    if (eventTarget === vditor.ir.element) {
        // 鼠标选取多行文本时， 会触发 click 事件，且 target 为 ir.element，此时保持原有规则
        eventTarget = null;
    }

    // range.collapsed = false 且 触发 click 事件时，range 并不会改变，此时 eventTarget 与 range 不一致，应该按照 eventTarget 处理
    const target = (!range.collapsed && eventTarget) ? eventTarget as HTMLElement : range.startContainer;
    const nodeElement = hasTopClosestByClassName(target, "vditor-ir__node");
    if (nodeElement) {
        nodeElement.classList.add("vditor-ir__node--expand");
        nodeElement.classList.remove("vditor-ir__node--hidden");
        // https://github.com/Vanessa219/vditor/issues/615 safari中光标位置跳动
        // range.collapsed = false 时无需修正 range，否则会导致选中多行文本，且首行为 nodeElement 时，无法取消选择
        if (range.collapsed) {            
            setSelectionFocus(range);
        }
    }

    const nextNode = nextIsNode(range);
    if (nextNode) {
        nextNode.classList.add("vditor-ir__node--expand");
        nextNode.classList.remove("vditor-ir__node--hidden");
        return;
    }

    const previousNode = previousIsNode(range);
    if (previousNode) {
        previousNode.classList.add("vditor-ir__node--expand");
        previousNode.classList.remove("vditor-ir__node--hidden");
        return;
    }
};
