interface IFindText {
    node: Text;
    start: number;
    end: number;
}

interface IFindUnit {
    text: string;
    nodes: IFindText[];
}

const findPattern = (query: string, caseSensitive: boolean) =>
    new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), caseSensitive ? "gu" : "giu");

export const countMatches = (text: string, query: string, caseSensitive: boolean) => {
    if (!query) return 0;
    const pattern = findPattern(query, caseSensitive);
    let count = 0;
    while (pattern.exec(text)) count++;
    return count;
};

const findUnits = (root: HTMLElement): IFindUnit[] => {
    const units: IFindUnit[] = [];
    let unit: IFindUnit = {text: "", nodes: []};
    const flush = () => {
        if (unit.text) units.push(unit);
        unit = {text: "", nodes: []};
    };
    const walk = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.replace(/\u200b/g, "");
            if (text) {
                unit.nodes.push({node: node as Text, start: unit.text.length, end: unit.text.length + text.length});
                unit.text += text;
            }
            return;
        }
        if (!(node instanceof Element)) return;
        if (node.matches(".vditor-ir__preview, .vditor-wysiwyg__preview, .vditor-wbr, " +
            '.vditor-ir__marker:not(pre), [data-type="code-block-open-marker"], [data-type="code-block-close-marker"], ' +
            '[data-type="code-block-info"], [data-type="backslash"] > span, input, button, script, style')) return;
        if (node.matches('img, br, hr, [data-type="img"], [data-type="math-inline"], [data-type="math-block"], ' +
            '[data-type="html-inline"], [data-type="html-block"], [data-type="toc-block"]')) {
            flush();
            return;
        }
        const block = node.matches("p, h1, h2, h3, h4, h5, h6, li, td, th, pre");
        if (block) flush();
        node.childNodes.forEach(walk);
        if (block) flush();
    };
    root.childNodes.forEach(walk);
    flush();
    return units;
};

const findOffset = (node: Text, offset: number, end = false) => {
    let count = 0;
    for (let index = 0; index < node.length; index++) {
        if (node.data[index] === "\u200b") continue;
        if (count === offset) return index;
        count++;
        if (end && count === offset) return index + 1;
    }
    return node.length;
};

const findRange = (unit: IFindUnit, start: number, end: number) => {
    const first = unit.nodes.find(item => item.end > start);
    const last = unit.nodes.find(item => item.end >= end);
    const range = first.node.ownerDocument.createRange();
    range.setStart(first.node, findOffset(first.node, start - first.start));
    range.setEnd(last.node, findOffset(last.node, end - last.start, true));
    return range;
};

export const findText = (element: HTMLElement, query: string, caseSensitive: boolean, index = 0): IFindResult => {
    if (!query) return {total: 0, index: -1};
    const source = element instanceof HTMLTextAreaElement;
    const units = source ? [{text: element.value, nodes: []}] : findUnits(element);
    const pattern = findPattern(query, caseSensitive);
    let total = 0;
    let chosen: IFindResult["match"];
    let first: IFindResult["match"];
    for (const unit of units) {
        pattern.lastIndex = 0;
        let match: RegExpExecArray;
        while ((match = pattern.exec(unit.text))) {
            if (!first || total === index) {
                const result = {start: match.index, end: match.index + match[0].length,
                    range: source ? undefined : findRange(unit, match.index, match.index + match[0].length)};
                first = first || result;
                if (total === index) chosen = result;
            }
            total++;
        }
    }
    return {total, index: total ? chosen ? index : 0 : -1, match: chosen || first};
};

const normalizeCodeMarker = (code: HTMLElement) => {
    const block = code.closest('[data-type="code-block"]');
    const inline = code.parentElement.closest('[data-type="code"]');
    const open = block ? block.querySelector('[data-type="code-block-open-marker"]') :
        inline?.querySelector(".vditor-ir__marker");
    const close = block ? block.querySelector('[data-type="code-block-close-marker"]') :
        inline?.lastElementChild;
    const container = block || code;
    const original = container.getAttribute("data-marker") || open?.textContent.trim() || (block ? "```" : "`");
    const runs: string[] = code.textContent.match(original[0] === "~" ? /~+/g : /`+/g) || [];
    const width = runs.reduce((size, run) => Math.max(size, run.length + 1), original.length);
    const marker = original[0].repeat(width);
    const content = code.textContent.replace(/\u200b/g, "");
    const padding = !block && (content.startsWith("`") || content.endsWith("`") ||
        content.startsWith(" ") && content.endsWith(" ") && !/^ +$/.test(content)) ? " " : "";
    // 替换内容中的分隔符必须短于代码边界，保存后才能按原内容读回。
    if (open && close) {
        open.textContent = marker + padding;
        close.textContent = padding + marker;
    } else {
        container.setAttribute("data-marker", marker);
    }
};

export const replaceText = (element: HTMLElement, query: string, replacement: string, caseSensitive: boolean,
                                index?: number): number => {
    if (!query) return 0;
    const pattern = findPattern(query, caseSensitive);
    let count = 0;
    let ordinal = 0;
    const escapedReplacement = replacement.replace(/[\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]/g, "\\$&");
    if (element instanceof HTMLTextAreaElement) {
        element.value = element.value.replace(pattern, value => {
            const replace = index === undefined || ordinal === index;
            ordinal++;
            if (!replace) return value;
            count++;
            return replacement;
        });
        return count;
    }
    const codeNodes = new Set<HTMLElement>();
    for (const unit of findUnits(element)) {
        pattern.lastIndex = 0;
        const edits = new Map<Text, Array<{start: number; end: number; text: string}>>();
        let match: RegExpExecArray;
        let cursor = 0;
        while ((match = pattern.exec(unit.text))) {
            const replace = index === undefined || ordinal === index;
            ordinal++;
            if (!replace) continue;
            count++;
            const start = match.index;
            const end = start + match[0].length;
            while (unit.nodes[cursor].end <= start) cursor++;
            // 正文标点转为 Markdown 转义，代码内容由代码节点保留字面语义。
            const text = unit.nodes[cursor].node.parentElement.closest("code") ? replacement : escapedReplacement;
            for (let position = cursor; position < unit.nodes.length && unit.nodes[position].start < end; position++) {
                const part = unit.nodes[position];
                const list = edits.get(part.node) || [];
                list.push({start: findOffset(part.node, Math.max(0, start - part.start)),
                    end: findOffset(part.node, Math.min(part.end, end) - part.start, true),
                    text: position === cursor ? text : ""});
                edits.set(part.node, list);
            }
        }
        edits.forEach((changes, node) => {
            let offset = 0;
            const fragments: string[] = [];
            for (const change of changes) {
                fragments.push(node.data.slice(offset, change.start), change.text);
                offset = change.end;
            }
            fragments.push(node.data.slice(offset));
            node.data = fragments.join("");
            const code = node.parentElement.closest("code");
            if (code) codeNodes.add(code);
            const escaped = node.parentElement.closest('[data-type="backslash"]');
            if (escaped) {
                escaped.querySelector("span")?.remove();
                escaped.replaceWith(...Array.from(escaped.childNodes));
            }
        });
    }
    codeNodes.forEach(normalizeCodeMarker);
    return count;
};

export const displayRange = (range: Range): Range => {
    const pre = range.startContainer.parentElement?.closest("pre");
    const preview = pre?.nextElementSibling;
    if (!preview?.matches(".vditor-code__preview")) return range;
    const prefix = range.cloneRange();
    prefix.selectNodeContents(pre);
    prefix.setEnd(range.startContainer, range.startOffset);
    const start = prefix.toString().length;
    const unit: IFindUnit = {text: "", nodes: []};
    const code = preview.querySelector("code");
    if (!code) return range;
    const walker = range.startContainer.ownerDocument.createTreeWalker(code, NodeFilter.SHOW_TEXT);
    let node: Node;
    while ((node = walker.nextNode())) {
        unit.nodes.push({node: node as Text, start: unit.text.length, end: unit.text.length + node.textContent.length});
        unit.text += node.textContent;
    }
    return unit.text.length >= start + range.toString().length ? findRange(unit, start, start + range.toString().length) : range;
};
