const getTaskPrefix = (root: HTMLElement, range: Range) => {
    const element = range.startContainer.nodeType === Node.ELEMENT_NODE ?
        range.startContainer as Element : range.startContainer.parentElement;
    const item = element?.closest("li.vditor-task");
    const firstElement = item?.firstElementChild;
    const checkbox = firstElement?.tagName === "P" ? firstElement.firstElementChild : firstElement;
    if (!item || !root.contains(item) || checkbox?.tagName !== "INPUT" ||
        checkbox.getAttribute("type") !== "checkbox") {
        return;
    }
    const body = document.createRange();
    let text = checkbox.nextSibling;
    while (text?.nodeType === Node.TEXT_NODE && text.textContent === "") {
        text = text.nextSibling;
    }
    if (text?.nodeType === Node.TEXT_NODE && text.textContent === " " && text.nextSibling &&
        !(text.nextSibling instanceof Element && text.nextSibling.matches("ul, ol"))) {
        body.selectNodeContents(text.nextSibling);
    } else if (text?.nodeType === Node.TEXT_NODE) {
        body.setStart(text, text.textContent.startsWith(" ") ? 1 : 0);
    } else if (text) {
        body.selectNodeContents(text);
    } else {
        body.setStartAfter(checkbox);
    }
    body.collapse(true);
    if (range.compareBoundaryPoints(Range.START_TO_START, body) < 0) {
        return {item, body};
    }
};

const skipTaskPrefix = (root: HTMLElement, event: KeyboardEvent) => {
    const selection = window.getSelection();
    if (document.activeElement !== root || root.getAttribute("contenteditable") !== "true" ||
        !selection?.isCollapsed || !selection.rangeCount || !root.contains(selection.anchorNode)) {
        return;
    }
    let prefix = getTaskPrefix(root, selection.getRangeAt(0));
    if (!prefix) {
        return;
    }
    const body = prefix.body;
    const item = prefix.item;
    const backwardKey = getComputedStyle(prefix.item).direction === "rtl" ? "ArrowRight" : "ArrowLeft";
    if (event.key !== backwardKey || typeof selection.modify !== "function") {
        selection.removeAllRanges();
        selection.addRange(body);
        return;
    }

    // 复选框附近可能有多个等价的 DOM 边界，继续沿浏览器原生方向移动到正文。
    const visited = new Map<Node, Set<number>>();
    while (prefix) {
        const node = selection.anchorNode;
        const offset = selection.anchorOffset;
        const offsets = visited.get(node) || new Set<number>();
        if (offsets.has(offset)) {
            selection.removeAllRanges();
            selection.addRange(body);
            return;
        }
        offsets.add(offset);
        visited.set(node, offsets);
        selection.modify("move", event.key === "ArrowLeft" ? "left" : "right", "character");
        if (!selection.rangeCount || !root.contains(selection.anchorNode)) {
            selection.removeAllRanges();
            selection.addRange(body);
            return;
        }
        prefix = getTaskPrefix(root, selection.getRangeAt(0));
        if (prefix && prefix.item !== item) {
            selection.removeAllRanges();
            selection.addRange(prefix.body);
            return;
        }
    }
};

export const bindTaskNavigation = (vditor: IVditor, root: HTMLElement) => {
    let navigation: KeyboardEvent;
    let timeout: number;
    root.addEventListener("compositionstart", () => {
        clearTimeout(timeout);
        navigation = undefined;
    });
    root.addEventListener("keydown", event => {
        clearTimeout(timeout);
        navigation = undefined;
        if (vditor.currentMode === "sv" || vditor[vditor.currentMode].composingLock || event.isComposing ||
            event.shiftKey || event.ctrlKey || event.metaKey ||
            event.altKey || (event.key !== "ArrowLeft" && event.key !== "ArrowRight") ||
            !window.getSelection()?.isCollapsed) {
            return;
        }
        navigation = event;
        // 等待默认光标移动，按住方向键时每次重复也会跳过任务标记。
        timeout = window.setTimeout(() => {
            if (navigation === event && !event.defaultPrevented) {
                skipTaskPrefix(root, event);
            }
        });
    }, true);
    root.addEventListener("keyup", event => {
        if (navigation?.key === event.key) {
            clearTimeout(timeout);
            if (!navigation.defaultPrevented && !event.isComposing && !event.shiftKey && !event.ctrlKey &&
                !event.metaKey && !event.altKey) {
                skipTaskPrefix(root, event);
            }
            navigation = undefined;
        }
    }, true);
};
