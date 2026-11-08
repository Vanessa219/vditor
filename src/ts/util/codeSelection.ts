export const setCodeHighlight = (code: Element, html: string) => {
    const selection = getSelection();
    const endpoints = [selection.anchorNode, selection.focusNode].map((node, index) => {
        const offset = index === 0 ? selection.anchorOffset : selection.focusOffset;
        if (!node || !code.contains(node)) {
            return {node, offset, inside: false};
        }
        const range = document.createRange();
        range.selectNodeContents(code);
        range.setEnd(node, offset);
        return {node, offset: range.toString().length, inside: true};
    });
    code.innerHTML = html;
    if (!endpoints.some(endpoint => endpoint.inside)) {
        return;
    }

    // 高亮会重建嵌套文本节点，按正文偏移恢复正向、反向及跨代码块选区。
    endpoints.forEach(endpoint => {
        if (!endpoint.inside) {
            return;
        }
        const walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT);
        let node = walker.nextNode();
        while (node) {
            if (endpoint.offset <= node.textContent.length) {
                endpoint.node = node;
                return;
            }
            endpoint.offset -= node.textContent.length;
            node = walker.nextNode();
        }
        endpoint.node = code;
        endpoint.offset = code.childNodes.length;
    });
    selection.setBaseAndExtent(endpoints[0].node, endpoints[0].offset, endpoints[1].node, endpoints[1].offset);
};
