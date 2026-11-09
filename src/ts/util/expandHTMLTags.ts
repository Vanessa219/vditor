const voidTags = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta",
    "param", "source", "track", "wbr"]);

export const expandHTMLTags = (root: HTMLElement, range: Range, className: string) => {
    const stacks = new Map<Element, Array<{name: string; element: Element}>>();
    root.querySelectorAll('[data-type="html-inline"]').forEach(element => {
        const tag = element.textContent.replace(/[\u200b\ufeff]/g, "").trim();
        const match = /^<(\/?)([a-z][\w:-]*)(?:\s[^]*)?>$/i.exec(tag);
        if (!match || /\/\s*>$/.test(tag)) {
            return;
        }
        const name = match[2].toLowerCase();
        if (voidTags.has(name)) {
            return;
        }
        const block = element.closest('[data-block="0"]') || root;
        const stack = stacks.get(block) || [];
        stacks.set(block, stack);
        if (!match[1]) {
            stack.push({name, element});
            return;
        }
        if (stack[stack.length - 1]?.name !== name) {
            return;
        }
        const opening = stack.pop().element;
        const contents = document.createRange();
        contents.setStartBefore(opening);
        contents.setEndAfter(element);
        if (contents.isPointInRange(range.startContainer, range.startOffset) &&
            contents.isPointInRange(range.endContainer, range.endOffset)) {
            opening.classList.add(className);
            element.classList.add(className);
        }
    });
};
