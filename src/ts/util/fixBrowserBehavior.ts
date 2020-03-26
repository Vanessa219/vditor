import {processAfterRender} from "../ir/process";
import {afterRenderEvent} from "../wysiwyg/afterRenderEvent";
import {isCtrl} from "./compatibility";
import {scrollCenter} from "./editorCommenEvent";
import {hasClosestBlock, hasClosestByMatchTag} from "./hasClosest";
import {getLastNode} from "./hasClosest";
import {matchHotKey} from "./hotKey";
import {getSelectPosition, setRangeByWbr} from "./selection";
import {Constants} from "../constants";

// 光标设置到前一个表格中
const goPreviousCell = (cellElement: HTMLElement, range: Range, isSelected = true) => {
    let previousElement = cellElement.previousElementSibling;
    if (!previousElement) {
        if (cellElement.parentElement.previousElementSibling) {
            previousElement = cellElement.parentElement.previousElementSibling.lastElementChild;
        } else if (cellElement.parentElement.parentElement.tagName === "TBODY" &&
            cellElement.parentElement.parentElement.previousElementSibling) {
            previousElement = cellElement.parentElement
                .parentElement.previousElementSibling.lastElementChild.lastElementChild;
        } else {
            previousElement = null;
        }
    }
    if (previousElement) {
        range.selectNodeContents(previousElement);
        if (!isSelected) {
            range.collapse(false);
        }
    }
};

export const setTableAlign = (tableElement: HTMLTableElement, type: string) => {
    const cell = getSelection().getRangeAt(0).startContainer.parentElement;

    const columnCnt = tableElement.rows[0].cells.length;
    const rowCnt = tableElement.rows.length;
    let currentColumn = 0;

    for (let i = 0; i < rowCnt; i++) {
        for (let j = 0; j < columnCnt; j++) {
            if (tableElement.rows[i].cells[j].isEqualNode(cell)) {
                currentColumn = j;
                break;
            }
        }
    }
    for (let k = 0; k < rowCnt; k++) {
        tableElement.rows[k].cells[currentColumn].setAttribute("align", type);
    }
};

export const isHrMD = (text: string) => {
    // - _ *
    const marker = text.trimRight().split("\n").pop();
    if (marker === "") {
        return false;
    }
    if (marker.replace(/ |-/g, "") === ""
        || marker.replace(/ |_/g, "") === ""
        || marker.replace(/ |\*/g, "") === "") {
        if (marker.replace(/ /g, "").length > 2) {
            if (marker.indexOf("-") > -1 && marker.trimLeft().indexOf(" ") === -1
                && text.trimRight().split("\n").length > 1) {
                // 满足 heading
                return false;
            }
            if (marker.indexOf("    ") === 0 || marker.indexOf("\t") === 0) {
                // 代码块
                return false;
            }
            return true;
        }
        return false;
    }
    return false;
};

export const isHeadingMD = (text: string) => {
    // - =
    const textArray = text.trimRight().split("\n");
    text = textArray.pop();

    if (text.indexOf("    ") === 0 || text.indexOf("\t") === 0) {
        return false;
    }

    text = text.trimLeft();
    if (text === "" || textArray.length === 0) {
        return false;
    }
    if (text.replace(/-/g, "") === ""
        || text.replace(/=/g, "") === "") {
        return true;
    }
    return false;
};

export const isToC = (text: string) => {
    return text.trim().toLowerCase() === "[toc]";
};

export const renderToc = (editorElement: HTMLPreElement) => {
    const tocElement = editorElement.querySelector('[data-type="toc-block"]');
    if (!tocElement) {
        return;
    }
    let tocHTML = "";
    Array.from(editorElement.children).forEach((item: HTMLElement) => {
        if (item.tagName.indexOf("H") === 0 && item.tagName.length === 2 && item.textContent.trim() !== "") {
            const space = new Array((parseInt(item.tagName.substring(1), 10) - 1) * 2).fill("&emsp;").join("");
            tocHTML += `${space}<span data-type="toc-h">${item.textContent.trim()}</span><br>`;
        }
    });
    tocElement.innerHTML = tocHTML || "[ToC]";
};

export const execAfterRender = (vditor: IVditor) => {
    if (vditor.currentMode === "wysiwyg") {
        afterRenderEvent(vditor);
    } else if (vditor.currentMode === "ir") {
        processAfterRender(vditor);
    }
};

export const fixList = (range: Range, vditor: IVditor, pElement: HTMLElement, event: KeyboardEvent) => {
    const startContainer = range.startContainer;
    const liElement = hasClosestByMatchTag(startContainer, "LI");
    if (liElement) {
        if (!isCtrl(event) && !event.altKey && event.key === "Enter" &&
            // fix li 中有多个 P 时，在第一个 P 中换行会在下方生成新的 li
            (!event.shiftKey && pElement && liElement.contains(pElement) && pElement.nextElementSibling)) {
            if (liElement && !liElement.textContent.endsWith("\n")) {
                // li 结尾需 \n
                liElement.insertAdjacentText("beforeend", "\n");
            }
            range.insertNode(document.createTextNode("\n"));
            range.collapse(false);
            execAfterRender(vditor);
            event.preventDefault();
            return true;
        }

        if (!isCtrl(event) && !event.shiftKey && !event.altKey && event.key === "Backspace" &&
            !liElement.previousElementSibling && range.toString() === "" &&
            getSelectPosition(liElement, range).start === 0) {
            // 光标位于点和第一个字符中间时，无法删除 li 元素
            if (liElement.nextElementSibling) {
                liElement.parentElement.insertAdjacentHTML("beforebegin",
                    `<p data-block="0"><wbr>${liElement.innerHTML}</p>`);
                liElement.remove();
            } else {
                liElement.parentElement.outerHTML = `<p data-block="0"><wbr>${liElement.innerHTML}</p>`;
            }
            setRangeByWbr(vditor[vditor.currentMode].element, range);
            execAfterRender(vditor);
            event.preventDefault();
            return true;
        }

        if (!isCtrl(event) && !event.altKey && event.key === "Tab") {
            // 光标位于第一/零字符时，tab 用于列表的缩进
            let isFirst = false;
            if (range.startOffset === 0
                && ((startContainer.nodeType === 3 && !startContainer.previousSibling)
                    || (startContainer.nodeType !== 3 && startContainer.nodeName === "LI"))) {
                // 有序/无序列表
                isFirst = true;
            } else if (liElement.classList.contains("vditor-task") && range.startOffset === 1
                && startContainer.previousSibling.nodeType !== 3
                && (startContainer.previousSibling as HTMLElement).tagName === "INPUT") {
                // 任务列表
                isFirst = true;
            }

            // TODO
            if (isFirst) {
                if (event.shiftKey) {
                    vditor.wysiwyg.popover.querySelector('button[data-type="outdent"]').dispatchEvent(new CustomEvent("click"));
                } else {
                    vditor.wysiwyg.popover.querySelector('button[data-type="indent"]').dispatchEvent(new CustomEvent("click"));
                }
                event.preventDefault();
                return true;
            }
        }
    }
    return false;
};

// tab 处理: block code render, table, 列表第一个字符中的 tab 处理单独写在上面
export const fixTab = (vditor: IVditor, range: Range, event: KeyboardEvent) => {
    if (vditor.options.tab && event.key === "Tab") {
        if (event.shiftKey) {
            // TODO shift+tab
        } else {
            if (range.toString() === "") {
                range.insertNode(document.createTextNode(vditor.options.tab));
                range.collapse(false);
            } else {
                range.extractContents();
                range.insertNode(document.createTextNode(vditor.options.tab));
                range.collapse(false);
            }
        }
        execAfterRender(vditor);
        event.preventDefault();
        return true;
    }
};

export const fixMarkdown = (event: KeyboardEvent, vditor: IVditor, pElement: HTMLElement, range: Range) => {
    if (!isCtrl(event) && !event.altKey && event.key === "Enter") {
        const pText = String.raw`${pElement.textContent}`.replace(/\\\|/g, "").trim();
        const pTextList = pText.split("|");
        if (pText.startsWith("|") && pText.endsWith("|") && pTextList.length > 3) {
            // table 自动完成
            let tableHeaderMD = pTextList.map(() => "---").join("|");
            tableHeaderMD =
                pElement.textContent + tableHeaderMD.substring(3, tableHeaderMD.length - 3) + "\n|<wbr>";
            pElement.outerHTML = vditor.lute.SpinVditorDOM(tableHeaderMD);
            setRangeByWbr(vditor[vditor.currentMode].element, range);
            execAfterRender(vditor);
            scrollCenter(vditor[vditor.currentMode].element);
            event.preventDefault();
            return true;
        }

        // hr 渲染
        if (isHrMD(pElement.innerHTML)) {
            // 软换行后 hr 前有内容
            let pInnerHTML = "";
            const innerHTMLList = pElement.innerHTML.trimRight().split("\n");
            if (innerHTMLList.length > 1) {
                innerHTMLList.pop();
                pInnerHTML = `<p data-block="0">${innerHTMLList.join("\n")}</p>`;
            }

            pElement.insertAdjacentHTML("afterend",
                `${pInnerHTML}<hr data-block="0"><p data-block="0">\n<wbr></p>`);
            pElement.remove();
            setRangeByWbr(vditor[vditor.currentMode].element, range);
            execAfterRender(vditor);
            scrollCenter(vditor[vditor.currentMode].element);
            event.preventDefault();
            return true;
        }

        if (isHeadingMD(pElement.innerHTML)) {
            // heading 渲染
            pElement.outerHTML = vditor.lute.SpinVditorDOM(pElement.innerHTML + '<p data-block="0">\n<wbr></p>');
            setRangeByWbr(vditor[vditor.currentMode].element, range);
            execAfterRender(vditor);
            scrollCenter(vditor[vditor.currentMode].element);
            event.preventDefault();
            return true;
        }
    }

    // 软换行会被切割 https://github.com/Vanessa219/vditor/issues/220
    if (pElement.previousElementSibling && event.key === "Backspace" && !isCtrl(event) && !event.altKey &&
        !event.shiftKey && pElement.textContent.trimRight().split("\n").length > 1 &&
        getSelectPosition(pElement, range).start === 0) {
        const lastElement = getLastNode(pElement.previousElementSibling) as HTMLElement;
        if (!lastElement.textContent.endsWith("\n")) {
            lastElement.textContent = lastElement.textContent + "\n";
        }
        lastElement.parentElement.insertAdjacentHTML("beforeend", `<wbr>${pElement.innerHTML}`);
        pElement.remove();
        setRangeByWbr(vditor[vditor.currentMode].element, range);
        return false;
    }
    return false;
};

export const fixTable = (vditor: IVditor, event: KeyboardEvent, range: Range) => {
    const startContainer = range.startContainer;
    const cellElement = hasClosestByMatchTag(startContainer, "TD") ||
        hasClosestByMatchTag(startContainer, "TH");
    if (cellElement) {
        // 换行或软换行：在 cell 中添加 br
        if (!isCtrl(event) && !event.altKey && event.key === "Enter") {
            if (!cellElement.lastElementChild ||
                (cellElement.lastElementChild && (!cellElement.lastElementChild.isEqualNode(cellElement.lastChild) ||
                    cellElement.lastElementChild.tagName !== "BR"))) {
                cellElement.insertAdjacentHTML("beforeend", "<br>");
            }
            const brElement = document.createElement("br");
            range.insertNode(brElement);
            range.setStartAfter(brElement);
            execAfterRender(vditor);
            scrollCenter(vditor[vditor.currentMode].element);
            event.preventDefault();
            return true;
        }

        // Backspace：光标移动到前一个 cell
        if (!isCtrl(event) && !event.shiftKey && !event.altKey && event.key === "Backspace"
            && range.startOffset === 0 && range.toString() === "") {
            goPreviousCell(cellElement, range, false);
            event.preventDefault();
            return true;
        }

        // tab：光标移向下一个 cell
        if (event.key === "Tab") {
            if (event.shiftKey) {
                // shift + tab 光标移动到前一个 cell
                goPreviousCell(cellElement, range);
                event.preventDefault();
                return true;
            }

            let nextElement = cellElement.nextElementSibling;
            if (!nextElement) {
                if (cellElement.parentElement.nextElementSibling) {
                    nextElement = cellElement.parentElement.nextElementSibling.firstElementChild;
                } else if (cellElement.parentElement.parentElement.tagName === "THEAD" &&
                    cellElement.parentElement.parentElement.nextElementSibling) {
                    nextElement =
                        cellElement.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild;
                } else {
                    nextElement = null;
                }
            }
            if (nextElement) {
                range.selectNodeContents(nextElement);
            }
            event.preventDefault();
            return true;
        }

        // 删除当前行
        if (cellElement.tagName === "TD" && matchHotKey("⌘--", event)) {
            const tbodyElement = cellElement.parentElement.parentElement;
            if (cellElement.parentElement.previousElementSibling) {
                range.selectNodeContents(cellElement.parentElement.previousElementSibling.lastElementChild);
            } else {
                range.selectNodeContents(tbodyElement.previousElementSibling.lastElementChild.lastElementChild);
            }

            if (tbodyElement.childElementCount === 1) {
                tbodyElement.remove();
            } else {
                cellElement.parentElement.remove();
            }

            range.collapse(false);
            event.preventDefault();
            execAfterRender(vditor);
            return true;
        }

        // 下方新添加一行 https://github.com/Vanessa219/vditor/issues/46
        if (matchHotKey("⌘-=", event)) {
            let rowHTML = "";
            for (let m = 0; m < cellElement.parentElement.childElementCount; m++) {
                rowHTML += `<td>${m === 0 ? " <wbr>" : " "}</td>`;
            }
            if (cellElement.tagName === "TH") {
                cellElement.parentElement.parentElement.insertAdjacentHTML("afterend",
                    `<tbody><tr>${rowHTML}</tr></tbody>`);
            } else {
                cellElement.parentElement.insertAdjacentHTML("afterend", `<tr>${rowHTML}</tr>`);
            }

            setRangeByWbr(vditor[vditor.currentMode].element, range);
            execAfterRender(vditor);
            scrollCenter(vditor[vditor.currentMode].element);
            event.preventDefault();
            return true;
        }

        // 后方新添加一列
        const tableElement = cellElement.parentElement.parentElement.parentElement as HTMLTableElement;
        if (matchHotKey("⌘-⇧-=", event)) {
            let index = 0;
            let previousElement = cellElement.previousElementSibling;
            while (previousElement) {
                index++;
                previousElement = previousElement.previousElementSibling;
            }
            for (let i = 0; i < tableElement.rows.length; i++) {
                if (i === 0) {
                    tableElement.rows[i].cells[index].insertAdjacentHTML("afterend", "<th> </th>");
                } else {
                    tableElement.rows[i].cells[index].insertAdjacentHTML("afterend", "<td> </td>");
                }
            }

            execAfterRender(vditor);
            event.preventDefault();
            return true;
        }

        // 删除当前列
        if (matchHotKey("⌘-⇧--", event)) {
            let index = 0;
            let previousElement = cellElement.previousElementSibling;
            while (previousElement) {
                index++;
                previousElement = previousElement.previousElementSibling;
            }
            if (cellElement.previousElementSibling || cellElement.nextElementSibling) {
                range.selectNodeContents(cellElement.previousElementSibling || cellElement.nextElementSibling);
                range.collapse(true);
            }
            for (let i = 0; i < tableElement.rows.length; i++) {
                if (tableElement.rows.length === 1) {
                    tableElement.remove();
                } else {
                    tableElement.rows[i].cells[index].remove();
                }
            }
            execAfterRender(vditor);
            event.preventDefault();
            return true;
        }

        // 剧左
        if (matchHotKey("⌘-⇧-L", event)) {
            if (vditor.currentMode === "ir") {
                setTableAlign(tableElement, "left");
                execAfterRender(vditor);
                event.preventDefault();
                return true;
            } else {
                const itemElement: HTMLElement = vditor.wysiwyg.popover.querySelector('[data-type="left"]');
                if (itemElement) {
                    itemElement.click();
                    event.preventDefault();
                    return true;
                }
            }
        }

        // 剧中
        if (matchHotKey("⌘-⇧-C", event)) {
            if (vditor.currentMode === "ir") {
                setTableAlign(tableElement, "center");
                execAfterRender(vditor);
                event.preventDefault();
                return true;
            } else {
                const itemElement: HTMLElement = vditor.wysiwyg.popover.querySelector('[data-type="center"]');
                if (itemElement) {
                    itemElement.click();
                    event.preventDefault();
                    return true;
                }
            }
        }
        // 剧右
        if (matchHotKey("⌘-⇧-R", event)) {
            if (vditor.currentMode === "ir") {
                setTableAlign(tableElement, "right");
                execAfterRender(vditor);
                event.preventDefault();
                return true;
            } else {
                const itemElement: HTMLElement = vditor.wysiwyg.popover.querySelector('[data-type="right"]');
                if (itemElement) {
                    itemElement.click();
                    event.preventDefault();
                    return true;
                }
            }
        }

        // focus row input
        if (vditor.currentMode === "wysiwyg" &&
            !isCtrl(event) && event.key === "Enter" && !event.shiftKey && event.altKey) {
            const inputElement = (vditor.wysiwyg.popover.querySelector(".vditor-input") as HTMLInputElement);
            inputElement.focus();
            inputElement.select();
            event.preventDefault();
            return true;
        }
    }
    return false;
};

export const fixCodeBlock = (vditor: IVditor, event: KeyboardEvent, codeRenderElement: HTMLElement, range: Range) => {
    // 行级代码块中 command + a，近对当前代码块进行全选
    if (codeRenderElement.tagName === "PRE" && matchHotKey("⌘-A", event)) {
        range.selectNodeContents(codeRenderElement.firstElementChild);
        event.preventDefault();
        return true;
    }

    // tab
    // TODO shift + tab, shift and 选中文字
    if (vditor.options.tab && event.key === "Tab" && !event.shiftKey && range.toString() === "") {
        range.insertNode(document.createTextNode(vditor.options.tab));
        range.collapse(false);
        execAfterRender(vditor);
        event.preventDefault();
        return true;
    }

    // Backspace: 光标位于第零个字符，仅删除代码块标签
    if (event.key === "Backspace" && !isCtrl(event) && !event.shiftKey && !event.altKey) {
        const codePosition = getSelectPosition(codeRenderElement, range);
        if ((codePosition.start === 0 ||
            (codePosition.start === 1 && codeRenderElement.innerText === "\n")) // 空代码块，光标在 \n 后
            && range.toString() === "") {
            codeRenderElement.parentElement.outerHTML =
                `<p data-block="0"><wbr>${codeRenderElement.firstElementChild.innerHTML}</p>`;
            setRangeByWbr(vditor[vditor.currentMode].element, range);
            execAfterRender(vditor);
            event.preventDefault();
            return true;
        }
    }

    // 换行
    if (!isCtrl(event) && !event.altKey && event.key === "Enter") {
        if (!codeRenderElement.firstElementChild.textContent.endsWith("\n")) {
            codeRenderElement.firstElementChild.insertAdjacentText("beforeend", "\n");
        }
        range.insertNode(document.createTextNode("\n"));
        range.collapse(false);
        execAfterRender(vditor);
        scrollCenter(vditor[vditor.currentMode].element);
        event.preventDefault();
        return true;
    }
    return false
}

export const fixBlockquote = (vditor: IVditor, range: Range, event: KeyboardEvent, pElement: HTMLElement) => {
    const startContainer = range.startContainer
    const blockquoteElement = hasClosestByMatchTag(startContainer, "BLOCKQUOTE");
    if (blockquoteElement && range.toString() === "") {
        if (event.key === "Backspace" && !isCtrl(event) && !event.shiftKey && !event.altKey &&
            getSelectPosition(blockquoteElement, range).start === 0) {
            // Backspace: 光标位于引用中的第零个字符，仅删除引用标签
            range.insertNode(document.createElement("wbr"));
            blockquoteElement.outerHTML = blockquoteElement.innerHTML;
            setRangeByWbr(vditor[vditor.currentMode].element, range);
            execAfterRender(vditor);
            event.preventDefault();
            return true;
        }

        if (pElement && event.key === "Enter" && !isCtrl(event) && !event.shiftKey && !event.altKey
            && pElement.parentElement.tagName === "BLOCKQUOTE") {
            // Enter: 空行回车应逐层跳出
            let isEmpty = false;
            if (pElement.innerHTML.replace(Constants.ZWSP, "") === "\n") {
                // 空 P
                isEmpty = true;
                pElement.remove();
            } else if (pElement.innerHTML.endsWith("\n\n") &&
                getSelectPosition(pElement, range).start === pElement.textContent.length - 1) {
                // 软换行
                pElement.innerHTML = pElement.innerHTML.substr(0, pElement.innerHTML.length - 2);
                isEmpty = true;
            }
            if (isEmpty) {
                if (vditor.currentMode === "wysiwyg") {
                    (vditor.wysiwyg.popover.querySelector('[data-type="insert-after"]') as HTMLElement).click();
                    event.preventDefault();
                    return true;
                } else {
                    // 需添加零宽字符，否则的话无法记录 undo
                    blockquoteElement.insertAdjacentHTML("afterend", `<p data-block="0">${Constants.ZWSP}<wbr>\n</p>`);
                    setRangeByWbr(vditor[vditor.currentMode].element, range);
                    processAfterRender(vditor);
                    event.preventDefault();
                    return true;
                }
            }
        }
        const blockElement = hasClosestBlock(startContainer);
        if (vditor.currentMode === "wysiwyg" && blockElement && matchHotKey("⌘-⇧-:", event)) {
            // 插入 blockquote
            range.insertNode(document.createElement("wbr"));
            blockElement.outerHTML = `<blockquote data-block="0">${blockElement.outerHTML}</blockquote>`;
            setRangeByWbr(vditor.wysiwyg.element, range);
            afterRenderEvent(vditor);
            event.preventDefault();
            return true;
        }
    }
    return false;
}
