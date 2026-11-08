import {hasClosestByMatchTag} from "./hasClosest";
import {getEditorRange, setSelectionFocus} from "./selection";

const getCell = (node: Node) => (hasClosestByMatchTag(node, "TD") ||
    hasClosestByMatchTag(node, "TH")) as HTMLTableCellElement | false;

const getOnlyTable = (root: Element): HTMLTableElement | undefined => {
    const nodes = Array.from(root.childNodes).filter(node =>
        node.nodeType !== Node.COMMENT_NODE && (node.nodeType !== Node.TEXT_NODE || node.textContent.trim()));
    if (nodes.length !== 1 || !(nodes[0] instanceof HTMLElement)) {
        return;
    }
    const element = nodes[0];
    if (element.tagName === "TABLE") {
        return element as HTMLTableElement;
    }
    if (["DIV", "BODY", "HTML", "SPAN"].includes(element.tagName)) {
        return getOnlyTable(element);
    }
};

export const parseMarkdownTableRows = (text: string): string[][] | null => {
    const lines = text.trim().split(/\r?\n/);
    const matrix: string[][] = [];
    for (const line of lines) {
        const row = line.trim();
        if (!row.startsWith("|") || !row.endsWith("|")) {
            return null;
        }
        const cells: string[] = [];
        let cell = "";
        for (let i = 1; i < row.length - 1; i++) {
            if (row[i] === "\\" && i + 1 < row.length - 1) {
                cell += row[i] + row[++i];
            } else if (row[i] === "|") {
                cells.push(cell.trim());
                cell = "";
            } else {
                cell += row[i];
            }
        }
        cells.push(cell.trim());
        if (matrix.length === 1 && cells.every(value => /^:?-+:?$/.test(value))) {
            continue;
        }
        matrix.push(cells);
    }
    return matrix.length ? matrix : null;
};

export const pasteIntoTable = (vditor: IVditor, html: string, markdown = ""): boolean => {
    if (vditor.currentMode === "sv") {
        return false;
    }
    const range = getEditorRange(vditor);
    const startCell = getCell(range.startContainer);
    if (!startCell || startCell !== getCell(range.endContainer)) {
        return false;
    }
    const source = document.createElement("div");
    if (markdown) {
        const matrix = parseMarkdownTableRows(markdown);
        if (!matrix) {
            return false;
        }
        const rows = matrix.map(row => "| " + row.join(" | ") + " |");
        rows.splice(1, 0, "| " + matrix[0].map(() => "---").join(" | ") + " |");
        html = vditor.lute.Md2HTML(rows.join("\n"));
    }
    html = Lute.Sanitize(html);
    source.innerHTML = html;
    if (!getOnlyTable(source)) {
        return false;
    }
    // 通过解析器生成目标模式的单元格，避免带入外部样式和不支持的嵌套结构。
    source.innerHTML = vditor.currentMode === "ir" ? vditor.lute.HTML2VditorIRDOM(html) :
        vditor.lute.HTML2VditorDOM(html);
    const sourceTable = source.querySelector("table");
    if (!sourceTable?.rows.length || !sourceTable.rows[0].cells.length) {
        return false;
    }
    const table = startCell.closest("table");
    const rowIndex = (startCell.parentElement as HTMLTableRowElement).rowIndex;
    const colIndex = startCell.cellIndex;
    const width = Math.max(table.rows[0].cells.length, colIndex + sourceTable.rows[0].cells.length);
    // 所有行保持相同宽度，防止 Markdown 规范化时截断新增列。
    while (table.rows.length < rowIndex + sourceTable.rows.length) {
        const body = table.tBodies[0] || table.createTBody();
        body.insertRow();
    }
    Array.from(table.rows).forEach(row => {
        while (row.cells.length < width) {
            row.appendChild(document.createElement(row.parentElement.tagName === "THEAD" ? "th" : "td"));
        }
    });
    let lastCell = startCell;
    Array.from(sourceTable.rows).forEach((row, r) => {
        Array.from(row.cells).forEach((cell, c) => {
            lastCell = table.rows[rowIndex + r].cells[colIndex + c];
            lastCell.innerHTML = cell.innerHTML;
        });
    });
    range.selectNodeContents(lastCell);
    range.collapse(false);
    setSelectionFocus(range);
    return true;
};

export const buildTableSelectionClipboard = (vditor: IVditor, range: Range): {html: string; plain: string} | null => {
    const start = getCell(range.startContainer);
    const end = getCell(range.endContainer);
    if (!start || !end || start === end || start.closest("table") !== end.closest("table")) {
        return null;
    }
    const table = start.closest("table");
    const firstRow = (start.parentElement as HTMLTableRowElement).rowIndex;
    const lastRow = (end.parentElement as HTMLTableRowElement).rowIndex;
    const left = Math.min(start.cellIndex, end.cellIndex);
    const right = Math.max(start.cellIndex, end.cellIndex);
    let html = "<table><thead>";
    for (let r = firstRow; r <= lastRow; r++) {
        html += "<tr>";
        for (let c = left; c <= right; c++) {
            const tag = r === firstRow ? "th" : "td";
            html += `<${tag}>${table.rows[r].cells[c]?.innerHTML || ""}</${tag}>`;
        }
        html += "</tr>";
        if (r === firstRow) {
            html += "</thead><tbody>";
        }
    }
    html += "</tbody></table>";
    const plain = (vditor.currentMode === "ir" ? vditor.lute.VditorIRDOM2Md(html) :
        vditor.lute.VditorDOM2Md(html)).trim();
    return {plain, html: vditor.lute.Md2HTML(plain)};
};
