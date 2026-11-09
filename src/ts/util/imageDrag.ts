import {execAfterRender} from "./fixBrowserBehavior";
import {setSelectionFocus} from "./selection";

const getImageNode = (image: HTMLImageElement, mode: string): HTMLElement => {
    if (mode === "ir") {
        const node = image.closest<HTMLElement>("[data-type='img']");
        if (!node) {
            return undefined;
        }
        const link = node.parentElement;
        if (link.getAttribute("data-type") === "a" && Array.from(link.childNodes).every(child =>
            child === node || (child.nodeType === Node.TEXT_NODE && !child.textContent.trim()) ||
            (child instanceof HTMLElement && child.classList.contains("vditor-ir__marker")))) {
            return link;
        }
        return node;
    }
    const link = image.parentElement;
    return link.tagName === "A" && link.childNodes.length === 1 ? link : image;
};

export const bindImageDrag = (vditor: IVditor, editor: HTMLElement) => {
    let dragged: HTMLElement;
    const editable = () => vditor.currentMode !== "sv" && vditor[vditor.currentMode].element === editor &&
        editor.getAttribute("contenteditable") === "true";
    const copy = (event: DragEvent) => event.ctrlKey || event.altKey || event.metaKey;

    editor.addEventListener("dragstart", (event: DragEvent) => {
        dragged = undefined;
        if (!(event.target instanceof HTMLImageElement)) {
            return;
        }
        if (!editable() || event.target.closest("[contenteditable='false'], .vditor-ir__preview, .vditor-wysiwyg__preview")) {
            event.preventDefault();
            return;
        }
        dragged = getImageNode(event.target, vditor.currentMode);
        if (dragged) {
            event.dataTransfer.effectAllowed = "copyMove";
        } else {
            event.preventDefault();
        }
    });
    editor.addEventListener("dragend", () => { dragged = undefined; });
    editor.addEventListener("dragover", (event: DragEvent) => {
        if (dragged && editable()) {
            event.preventDefault();
            event.dataTransfer.dropEffect = copy(event) ? "copy" : "move";
        }
    });

    return (event: DragEvent) => {
        if (!dragged) {
            return false;
        }
        const source = dragged;
        dragged = undefined;
        event.preventDefault();
        if (!editable() || !editor.contains(source)) {
            return true;
        }
        // 浏览器命中位置只用于定位，图片和 Markdown 标记作为同一个节点移动。
        const doc = editor.ownerDocument as Document & {
            caretPositionFromPoint?: (x: number, y: number) => {offsetNode: Node, offset: number} | null;
        };
        let range: Range;
        if (doc.caretRangeFromPoint) {
            range = doc.caretRangeFromPoint(event.clientX, event.clientY);
        } else {
            const position = doc.caretPositionFromPoint?.(event.clientX, event.clientY);
            if (position) {
                range = doc.createRange();
                range.setStart(position.offsetNode, position.offset);
                range.collapse(true);
            }
        }
        if (!range || !editor.contains(range.startContainer) || source.contains(range.startContainer)) {
            return true;
        }
        const target = range.startContainer instanceof Element ? range.startContainer : range.startContainer.parentElement;
        if (target.closest("[contenteditable='false'], .vditor-ir__marker, .vditor-ir__preview, " +
            ".vditor-wysiwyg__block, .vditor-wysiwyg__preview, code, [data-type='code-block'], [data-type='img'], " +
            "[data-type='math-inline'], [data-type='math-block'], [data-type='html-inline'], [data-type='html-block'], " +
            "[data-type='link-ref-defs-block']")) {
            return true;
        }

        const sourceRange = doc.createRange();
        sourceRange.selectNode(source);
        setSelectionFocus(sourceRange);
        vditor.undo.addToUndoStack(vditor);
        const node = copy(event) ? source.cloneNode(true) : source;
        if (range.startContainer === editor) {
            const paragraph = doc.createElement("p");
            paragraph.setAttribute("data-block", "0");
            range.insertNode(paragraph);
            range.selectNodeContents(paragraph);
        }
        range.insertNode(node);
        range.setStartAfter(node);
        range.collapse(true);
        setSelectionFocus(range);
        // 即使撤销延迟未到，也为一次拖拽保留完整的前后状态。
        execAfterRender(vditor);
        vditor.undo.addToUndoStack(vditor);
        return true;
    };
};
