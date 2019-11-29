const rules: { [key: string]: ITurndownRule } = {
    vditorDelete: {
        filter: ["del", "s", "strike"],
        replacement: (content: string) => {
            return "~~" + content + "~~";
        },
    },
    vditorListItem: {
        filter: "li",
        replacement: (content: string, node: HTMLInputElement) => {
            content = content
                .replace(/^\n+/, "") // remove leading newlines
                .replace(/\n+$/, "\n") // replace trailing newlines with just a single one
                .replace(/\n/gm, "\n    "); // indent
            let prefix = "* ";
            const parent = node.parentNode as HTMLOListElement;
            if (parent.nodeName === "OL") {
                const start = parent.getAttribute("start");
                const index = Array.prototype.indexOf.call(parent.children, node);
                prefix = (start ? Number(start) + index : index + 1) + ". ";
            }
            return (
                prefix + content + (node.nextSibling && !/\n$/.test(content) ? "\n" : "")
            );
        },
    },
    vditorTableCell: {
        filter: ["td", "th"],
        replacement: (content, node) => {
            return genCell(content, node);
        },
    },
    vditorTableSection: {
        filter: ["thead", "tbody", "tfoot"],
        replacement: (content) => {
            return content;
        },
    },
    vditorTaskListItems: {
        filter: (node: HTMLInputElement) => {
            return node.type === "checkbox" && node.parentNode.nodeName === "LI";
        },
        replacement: (content: string, node: HTMLInputElement) => {
            return (node.checked ? "[x]" : "[ ]") + " ";
        },
    },
    vditorTr: {
        filter: "tr",
        replacement: (content, node) => {
            let thCells = "";
            const alignMap: { [key: string]: string } = {left: ":--", right: "--:", center: ":-:"};
            const parentNode = node.parentNode;
            let fistTr: HTMLElement;
            if (parentNode.nodeName === "THEAD" || node.nodeName === "TH") {
                fistTr = (parentNode.parentNode.querySelectorAll("tbody > tr")[0]) as HTMLElement;
            }
            if (parentNode.nodeName === "TABLE" && !node.previousElementSibling) {
                fistTr = node;
            }
            if (fistTr) {
                fistTr.childNodes.forEach((cell: HTMLTableCellElement) => {
                    const cellAlign = cell.style.textAlign || cell.getAttribute("align") || "";
                    thCells += genCell(alignMap[cellAlign.toLowerCase()] || "---", cell);
                });
            }

            return "\n" + content + thCells;
        },
    },
};

const genCell = (content: string, node: HTMLElement) => {
    let prefix = "| ";
    let suffix = " |\n";
    if (node.previousElementSibling) {
        prefix = " ";
    }
    if (node.nextElementSibling) {
        suffix = " | ";
    }
    return prefix + content + suffix;
};

export const gfm = (turndownService: ITurndown) => {
    Object.keys(rules).forEach((key) => {
        turndownService.addRule(key, rules[key]);
    });
};
