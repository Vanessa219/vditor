import {getEditorRange} from "./selection";
import {hasClosestBlock, hasClosestByAttribute, hasClosestByClassName, hasClosestByMatchTag} from "./hasClosest";

interface IMarkdownNode {
    Type: string;
    Data?: string;
    Children?: IMarkdownNode[];
}

const containsPlainText = (node: IMarkdownNode, marker: string): boolean => {
    if (node.Type === "NodeLink" || node.Type === "NodeImage") {
        return false;
    }
    return (node.Type === "NodeText" && !!node.Data?.includes(marker)) ||
        !!node.Children?.some(child => containsPlainText(child, marker));
};

// 百分号编码语法字符和实体中的非保留字符，保持查询参数分隔符和 Markdown 往返语义。
const escapeDestination = (text: string) => {
    const encode = (character: string) => "%" + character.charCodeAt(0).toString(16).toUpperCase();
    return text.replace(/[\\()<>|]/g, encode).replace(
        /&(?:#[xX]?)?([a-zA-Z0-9])(?=[a-zA-Z0-9]*;)/g,
        (match, character: string) => match.slice(0, -1) + encode(character));
};

export const pasteUnfinishedIRLinkDestination = (vditor: IVditor, text: string): boolean => {
    if (vditor.currentMode !== "ir" || !vditor.lute.IsValidLinkDest(text)) {
        return false;
    }
    const range = getEditorRange(vditor);
    const block = hasClosestBlock(range.startContainer);
    if (!block || !block.contains(range.endContainer) ||
        hasClosestByAttribute(range.startContainer, "data-type", "a") ||
        hasClosestByMatchTag(range.startContainer, "CODE")) {
        return false;
    }
    const prefix = range.cloneRange();
    prefix.selectNodeContents(block);
    prefix.setEnd(range.startContainer, range.startOffset);
    if (!/(?:^|[^\\])!?\[(?:\\.|[^[\]\\\r\n])+\]\(\s*$/.test(prefix.toString())) {
        return false;
    }
    const destination = document.createTextNode(escapeDestination(text));
    range.deleteContents();
    range.insertNode(destination);
    range.setStartAfter(destination);
    range.collapse(true);
    return true;
};

export const getPastedLink = (vditor: IVditor, text: string): string => {
    if (!vditor.lute.IsValidLinkDest(text)) {
        return text;
    }
    let selectedText: string;
    if (vditor.currentMode === "sv") {
        const element = vditor.sv.element;
        const start = element.selectionStart;
        const end = element.selectionEnd;
        const marker = "vditorlink" + Lute.NewNodeID();
        // 使用解析后的节点判断插入位置，避免在链接地址、代码和公式等语法内生成链接。
        const tree: IMarkdownNode = JSON.parse(vditor.lute.RenderJSON(
            element.value.substring(0, start) + marker + element.value.substring(end)));
        if (!containsPlainText(tree, marker)) {
            return text;
        }
        selectedText = element.value.substring(start, end);
    } else {
        const range = getEditorRange(vditor);
        if (hasClosestByMatchTag(range.startContainer, "A") || hasClosestByMatchTag(range.startContainer, "CODE") ||
            hasClosestByAttribute(range.startContainer, "data-type", "a") ||
            hasClosestByClassName(range.startContainer, "vditor-ir__marker--link")) {
            return text;
        }
        selectedText = range.toString();
    }
    const title = (selectedText || text).replace(/[\\`*_[\]!~^=$&<>|:]/g, "\\$&");
    const destination = escapeDestination(text);
    return `[${title}](${destination})`;
};
