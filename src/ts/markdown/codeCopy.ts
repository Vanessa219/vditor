// Bind outside HTML attributes so strict CSP and restored undo snapshots work alike.
export const bindCodeCopy = (menu: HTMLElement, textarea: HTMLTextAreaElement, button: HTMLElement) => {
    const doc = menu.ownerDocument;
    const label = window.VditorI18n?.copy || "复制";
    button.setAttribute("aria-label", label);
    button.setAttribute("role", "button");
    button.tabIndex = 0;
    button.addEventListener("mouseover", () => button.setAttribute("aria-label", label));
    const copy = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
        const active = doc.activeElement;
        const input = active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement ? active : undefined;
        const inputSelection = input && input.selectionStart !== null ?
            {start: input.selectionStart, end: input.selectionEnd, direction: input.selectionDirection} : undefined;
        const selection = doc.getSelection();
        const ranges = Array.from({length: selection?.rangeCount || 0}, (_, index) => selection.getRangeAt(index).cloneRange());
        button.setAttribute("aria-label", label);
        let copied = false;
        try {
            textarea.select();
            copied = doc.execCommand("copy");
        } finally {
            textarea.blur();
            if (active instanceof HTMLElement && active.isConnected) active.focus({preventScroll: true});
            selection?.removeAllRanges();
            ranges.forEach(range => selection?.addRange(range));
            if (inputSelection && input.isConnected) {
                input.setSelectionRange(inputSelection.start, inputSelection.end, inputSelection.direction);
            }
        }
        if (copied) {
            button.setAttribute("aria-label", window.VditorI18n?.copied || "已复制");
            button.dispatchEvent(new CustomEvent("vditor-copy-success", {bubbles: true, detail: {label}}));
        }
    };
    button.addEventListener("click", copy);
    button.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") copy(event);
    });
};
