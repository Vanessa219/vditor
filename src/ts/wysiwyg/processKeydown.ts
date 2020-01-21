import {Constants} from "../constants";
import {setSelectionFocus} from "../editor/setSelection";
import {scrollCenter} from "../util/editorCommenEvent";
import {
    hasClosestByAttribute,
    hasClosestByClassName,
    hasClosestByMatchTag, hasClosestByTag,
    hasTopClosestByTag,
} from "../util/hasClosest";
import {processKeymap} from "../util/processKeymap";
import {afterRenderEvent} from "./afterRenderEvent";
import {processCodeRender} from "./processCodeRender";
import {setHeading} from "./setHeading";
import {setRangeByWbr} from "./setRangeByWbr";

export const deleteKey = (vditor: IVditor, event: KeyboardEvent) => {
    const range = getSelection().getRangeAt(0);
    const startContainer = range.startContainer as HTMLElement;

    if (startContainer.nodeType === 3 && range.startOffset === 0) {
        // 光标位于第零个位置进行删除
        if (range.collapsed && startContainer.parentElement.tagName === "CODE" &&
            startContainer.parentElement.parentElement.parentElement.classList
                .contains("vditor-wysiwyg__block") && !startContainer.previousSibling) {
            // 光标位于渲染代码块内，仅删除代码块，内容保持不变
            const pElement = document.createElement("p");
            pElement.setAttribute("data-block", "0");
            pElement.textContent = startContainer.parentElement.textContent;
            range.setStartBefore(startContainer.parentElement.parentElement.parentElement);
            range.insertNode(pElement);
            range.collapse(true);
            (vditor.wysiwyg.popover.firstElementChild as HTMLElement).click();
            event.preventDefault();
            return;
        }

        const blockquoteElement = hasClosestByMatchTag(startContainer, "BLOCKQUOTE");
        if (blockquoteElement) {
            // 光标位于引用中的第零个字符
            blockquoteElement.outerHTML = `<p data-block="0">${blockquoteElement.innerHTML}</p>`;
            event.preventDefault();
            return;
        }

        const liElement = hasClosestByMatchTag(startContainer, "LI");
        const blockElement = hasClosestByAttribute(startContainer, "data-block", "0");
        if (blockElement) {
            const blockRenderElement = blockElement.previousElementSibling as HTMLElement;
            if (range.collapsed && blockRenderElement &&
                blockRenderElement.classList.contains("vditor-wysiwyg__block") && blockElement.tagName !== "TABLE" &&
                (!liElement || (liElement && liElement.isEqualNode(liElement.parentElement.firstElementChild)))) {
                // 删除后光标落在代码渲染块的预览部分且光标后有内容
                (blockRenderElement.lastElementChild as HTMLElement).click();
                event.preventDefault();
            }
        }
    } else if (startContainer.nodeType !== 3) {
        // 光标位于 table 前，table 前有内容
        const tableElemnt = startContainer.childNodes[range.startOffset] as HTMLElement;
        if (tableElemnt && range.startOffset > 0 &&
            tableElemnt.tagName === "TABLE") {
            range.selectNodeContents(tableElemnt.previousElementSibling);
            range.collapse(false);
            setSelectionFocus(range);
            event.preventDefault();
            return;
        }

        // 段落前为代码渲染块，从段落中间开始删除，一直删除头再继续删除一次
        if (range.startOffset === 0 && startContainer.tagName === "P") {
            const pPrevElement = startContainer.previousElementSibling;
            if (pPrevElement && pPrevElement.classList.contains("vditor-wysiwyg__block")) {
                (pPrevElement.lastElementChild as HTMLElement).click();
                event.preventDefault();
            }
            return;
        }

        // 渲染代码块为空
        if (startContainer.tagName === "CODE" &&
            (startContainer.textContent === "" || startContainer.textContent === "\n") &&
            startContainer.parentElement.parentElement.classList.contains("vditor-wysiwyg__block")) {
            startContainer.parentElement.parentElement.outerHTML = Constants.WYSIWYG_EMPTY_P;
            event.preventDefault();
            return;
        }

        const preElement = startContainer.childNodes[range.startOffset - 1] as HTMLElement;
        if (preElement && preElement.nodeType !== 3 &&
            preElement.classList.contains("vditor-wysiwyg__block")) {
            // 光标从代码块向后移动到下一个段落前，进行删除
            (preElement.querySelector(".vditor-wysiwyg__preview") as HTMLElement).click();
            event.preventDefault();
        }
    }
};

export const processKeydown = (vditor: IVditor, event: KeyboardEvent) => {
    // TODO deleteKey and 上下左右遇到块预览的处理重构
    const range = getSelection().getRangeAt(0);
    const startContainer = range.startContainer;

    // 表格自动完成
    const pElement = hasClosestByMatchTag(range.startContainer, "P");
    if (pElement && ((!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.key === "Enter") ||
        (!event.metaKey && !event.ctrlKey && event.shiftKey && !event.altKey && event.key === "Enter"))) {
        const pText = String.raw`${pElement.textContent}`.replace(/\\\|/g, "").trim();
        const pTextList = pText.split("|");
        if (pText.startsWith("|") && pText.endsWith("|") && pTextList.length > 3) {
            let tableHeaderMD = pTextList.map(() => "---").join("|");
            tableHeaderMD = pElement.textContent + tableHeaderMD.substring(3, tableHeaderMD.length - 3) + "\n|<wbr>";
            pElement.outerHTML = vditor.lute.SpinVditorDOM(tableHeaderMD);
            setRangeByWbr(vditor.wysiwyg.element, range);
            afterRenderEvent(vditor);
            scrollCenter(vditor.wysiwyg.element);
            event.preventDefault();
            return true;
        }
    }

    // table
    const cellElement = hasClosestByMatchTag(startContainer, "TD") ||
        hasClosestByMatchTag(startContainer, "TH");
    if (cellElement) {
        // 换行或软换行：在 cell 中添加 br
        if ((!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.key === "Enter") ||
            (!event.metaKey && !event.ctrlKey && event.shiftKey && !event.altKey && event.key === "Enter")) {
            const brElement = document.createElement("span");
            brElement.className = "vditor-wysiwyg__block";
            brElement.setAttribute("data-type", "html-inline");
            brElement.innerHTML = '<code data-type="html-inline">&lt;br /&gt;</code>';
            processCodeRender(brElement, vditor);
            range.insertNode(document.createTextNode(" "));
            range.insertNode(brElement);
            range.setStartAfter(brElement.nextSibling);
            range.collapse(false);
            setSelectionFocus(range);
            afterRenderEvent(vditor);
            event.preventDefault();
            return true;
        }

        // Backspace：光标移动到前一个 cell
        if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.key === "Backspace"
            && range.startOffset === 0) {
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
                range.collapse(false);
            }
            event.preventDefault();
            return true;
        }

        // tab：光标移向下一个 cell
        if (event.key === "Tab") {
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
                range.collapse(true);
            }
            event.preventDefault();
            return true;
        }

        // alt+Backspace：删除行
        if (!event.metaKey && !event.ctrlKey && !event.shiftKey && event.altKey && cellElement.tagName === "TD"
            && event.key === "Backspace") {
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
            afterRenderEvent(vditor);
            return true;
        }

        // alt+enter: 下方新添加一行 https://github.com/Vanessa219/vditor/issues/46
        if (!event.metaKey && !event.ctrlKey && !event.shiftKey && event.altKey && event.key === "Enter") {
            let rowHTML = "";
            for (let m = 0; m < cellElement.parentElement.childElementCount; m++) {
                rowHTML += `<td>${m === 0 ? "<wbr>" : ""}</td>`;
            }
            if (cellElement.tagName === "TH") {
                cellElement.parentElement.parentElement.insertAdjacentHTML("afterend",
                    `<tbody><tr>${rowHTML}</tr></tbody>`);
            } else {
                cellElement.parentElement.insertAdjacentHTML("afterend", `<tr>${rowHTML}</tr>`);
            }
            setRangeByWbr(vditor.wysiwyg.element, range);
            afterRenderEvent(vditor);
            scrollCenter(vditor.wysiwyg.element);
            event.preventDefault();
            return true;
        }

        // alt+shift+enter: 后方新添加一列
        const tableElement = cellElement.parentElement.parentElement.parentElement as HTMLTableElement;
        if (!event.metaKey && !event.ctrlKey && event.shiftKey && event.altKey && event.key === "Enter") {
            let index = 0;
            let previousElement = cellElement.previousElementSibling;
            while (previousElement) {
                index++;
                previousElement = previousElement.previousElementSibling;
            }
            for (let i = 0; i < tableElement.rows.length; i++) {
                if (i === 0) {
                    tableElement.rows[i].cells[index].insertAdjacentHTML("afterend", "<th></th>");
                } else {
                    tableElement.rows[i].cells[index].insertAdjacentHTML("afterend", "<td></td>");
                }
            }

            afterRenderEvent(vditor);
            event.preventDefault();
            return true;
        }

        // alt+shift+Backspace: 删除当前列
        if (!event.metaKey && !event.ctrlKey && event.shiftKey && event.altKey && event.key === "Backspace") {
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
            afterRenderEvent(vditor);
            event.preventDefault();
            return true;
        }
    }

    const codeRenderElement = hasClosestByClassName(startContainer, "vditor-wysiwyg__block");
    if (codeRenderElement) {
        // esc: 退出编辑，仅展示渲染
        if (event.key === "Escape") {
            vditor.wysiwyg.popover.style.display = "none";
            (codeRenderElement.firstElementChild as HTMLElement).style.display = "none";
            vditor.wysiwyg.element.blur();
            event.preventDefault();
            return true;
        }
        // alt+enter: 代码块切换到语言 https://github.com/Vanessa219/vditor/issues/54
        if (!event.metaKey && !event.ctrlKey && !event.shiftKey && event.altKey && event.key === "Enter" &&
            codeRenderElement.getAttribute("data-type") === "code-block") {
            (vditor.wysiwyg.popover.querySelector(".vditor-input") as HTMLElement).focus();
            event.preventDefault();
            return true;
        }

        // 行级代码块中 command + a，近对当前代码块进行全选
        if (startContainer.parentElement.tagName === "CODE" && codeRenderElement.getAttribute("data-block") === "0") {
            if (processKeymap("⌘-a", event, () => {
                range.selectNodeContents(startContainer.parentElement);
            })) {
                return true;
            }
        }

        // 换行
        if (!event.metaKey && !event.ctrlKey && !event.altKey && event.key === "Enter" &&
            codeRenderElement.getAttribute("data-block") === "0") {
            if (!codeRenderElement.firstElementChild.firstElementChild.textContent.endsWith("\n")) {
                codeRenderElement.firstElementChild.firstElementChild.insertAdjacentText("beforeend", "\n");
            }
            range.insertNode(document.createTextNode("\n"));
            range.collapse(false);
            afterRenderEvent(vditor);
            processCodeRender(codeRenderElement, vditor);
            event.preventDefault();
            return true;
        }

        // tab
        if (event.key === "Tab" && !event.shiftKey && range.collapsed &&
            codeRenderElement.getAttribute("data-block") === "0") {
            range.insertNode(document.createTextNode(vditor.options.tab));
            range.collapse(false);
            afterRenderEvent(vditor);
            processCodeRender(codeRenderElement, vditor);
            event.preventDefault();
            return true;
        }

        // TODO shift + tab, shift and 选中文字
    }

    const topBQElement = hasTopClosestByTag(startContainer, "BLOCKQUOTE");
    if (topBQElement && !event.metaKey && !event.ctrlKey && !event.shiftKey && event.altKey && event.key === "Enter") {
        // alt+enter: 跳出多层 blockquote 嵌套 https://github.com/Vanessa219/vditor/issues/51
        range.setStartAfter(topBQElement);
        setSelectionFocus(range);
        const node = document.createElement("p");
        node.setAttribute("data-block", "0");
        node.innerHTML = "\n";
        range.insertNode(node);
        range.collapse(true);
        setSelectionFocus(range);
        afterRenderEvent(vditor);
        scrollCenter(vditor.wysiwyg.element);
        event.preventDefault();
        return true;
    }

    // h1-h6
    const headingElement = hasClosestByTag(startContainer, "H");
    if (headingElement) {
        if (headingElement.tagName === "H6" && startContainer.textContent.length === range.startOffset &&
            !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.key === "Enter") {
            // enter: H6 回车解析问题 https://github.com/Vanessa219/vditor/issues/48
            const pTempElement = document.createElement("p");
            pTempElement.textContent = "\n";
            pTempElement.setAttribute("data-block", "0");
            startContainer.parentElement.insertAdjacentElement("afterend", pTempElement);
            range.setStart(pTempElement, 0);
            setSelectionFocus(range);
            afterRenderEvent(vditor);
            scrollCenter(vditor.wysiwyg.element);
            event.preventDefault();
            return true;
        }

        // enter++: 标题变大
        if (processKeymap("⌘-=", event, () => {
            const index = parseInt((headingElement as HTMLElement).tagName.substr(1), 10) - 1;
            if (index < 1) {
                return;
            }
            setHeading(vditor, `h${index}`);
            afterRenderEvent(vditor);
            event.preventDefault();
        })) {
            return true;
        }

        // enter++: 标题变小
        if (processKeymap("⌘--", event, () => {
            const index = parseInt((headingElement as HTMLElement).tagName.substr(1), 10) + 1;
            if (index > 6) {
                return;
            }
            setHeading(vditor, `h${index}`);
            afterRenderEvent(vditor);
            event.preventDefault();
        })) {
            return true;
        }
    }

    // task list
    const taskItemElement = hasClosestByClassName(startContainer, "vditor-task");
    if (taskItemElement) {
        // Backspace: 在选择框前进行删除
        if (event.key === "Backspace" && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
            && range.collapsed && ((startContainer.nodeType === 3 && range.startOffset === 1 &&
                (startContainer.previousSibling as HTMLElement).tagName === "INPUT") ||
                startContainer.nodeType !== 3)) {
            const previousElement = taskItemElement.previousElementSibling;
            taskItemElement.querySelector("input").remove();
            if (previousElement) {
                previousElement.innerHTML += "<wbr>" + taskItemElement.innerHTML.trim();
                taskItemElement.remove();
            } else {
                taskItemElement.parentElement.insertAdjacentHTML("beforebegin",
                    `<p data-block="0"><wbr>${taskItemElement.innerHTML.trim() || "\n"}</p>`);
                if (taskItemElement.nextElementSibling) {
                    taskItemElement.remove();
                } else {
                    taskItemElement.parentElement.remove();
                }
            }
            setRangeByWbr(vditor.wysiwyg.element, range);
            afterRenderEvent(vditor);
            event.preventDefault();
            return true;
        }

        if (event.key === "Enter" && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
            if (taskItemElement.lastChild.textContent.trim() === "") {
                if (taskItemElement.nextElementSibling) {
                    // 用段落隔断
                    let afterHTML = "";
                    let beforeHTML = "";
                    let isAfter = false;
                    taskItemElement.parentElement.querySelectorAll("li").forEach((liElement) => {
                        if (liElement.isEqualNode(taskItemElement)) {
                            isAfter = true;
                        } else {
                            if (isAfter) {
                                afterHTML += liElement.outerHTML;
                            } else {
                                beforeHTML += liElement.outerHTML;
                            }
                        }
                    });
                    if (beforeHTML) {
                        beforeHTML = `<ul data-tight="true" data-marker="*" data-block="0">${beforeHTML}</ul>`;
                    }
                    taskItemElement.parentElement.outerHTML = `${beforeHTML}<p data-block="0">\n<wbr></p><ul data-tight="true" data-marker="*" data-block="0">${afterHTML}</ul>`;
                } else {
                    // 变成段落
                    taskItemElement.parentElement.insertAdjacentHTML("afterend", `<p data-block="0">\n<wbr></p>`);
                    if (taskItemElement.parentElement.querySelectorAll("li").length === 1) {
                        taskItemElement.parentElement.remove();
                    } else {
                        taskItemElement.remove();
                    }
                }
            } else {
                // 光标后文字添加到新列表中
                range.setEndAfter(taskItemElement.lastChild);
                taskItemElement.insertAdjacentHTML("afterend", `<li class="vditor-task"><input type="checkbox"> <wbr></li>`);
                document.querySelector("wbr").after(range.extractContents());
            }
            setRangeByWbr(vditor.wysiwyg.element, range);
            afterRenderEvent(vditor);
            scrollCenter(vditor.wysiwyg.element);
            event.preventDefault();
            return true;
        }
    }

    // 删除有子工具栏的块
    if (processKeymap("⌘-⇧-x", event, () => {
        const itemElement: HTMLElement = vditor.wysiwyg.popover.querySelector('[data-type="remove"]');
        if (itemElement) {
            itemElement.click();
        }
    })) {
        return true;
    }

    // 在有子工具栏的块后插入行
    if (processKeymap("⌘-⇧-e", event, () => {
        const itemElement: HTMLElement = vditor.wysiwyg.popover.querySelector('[data-type="insert-after"]')
            || vditor.wysiwyg.popover.querySelector('[data-type="indent"]');
        if (itemElement) {
            itemElement.click();
        }
    })) {
        return true;
    }

    // 在有子工具栏的块前插入行
    if (processKeymap("⌘-⇧-s", event, () => {
        const itemElement: HTMLElement = vditor.wysiwyg.popover.querySelector('[data-type="insert-before"]')
            || vditor.wysiwyg.popover.querySelector('[data-type="outdent"]');
        if (itemElement) {
            itemElement.click();
        }
    })) {
        return true;
    }

    // tab 处理，需放在 cell tab 处理之后
    if (event.key === "Tab") {
        if (event.shiftKey) {
            // TODO shift+tab
        } else {
            if (range.collapsed) {
                range.insertNode(document.createTextNode(vditor.options.tab));
                range.collapse(false);
                if (codeRenderElement) {
                    processCodeRender(codeRenderElement, vditor);
                }
            } else {
                range.extractContents();
                range.insertNode(document.createTextNode(vditor.options.tab));
                range.collapse(false);
            }
        }
        afterRenderEvent(vditor);
        event.preventDefault();
        return true;
    }

    if (!event.metaKey && !event.ctrlKey && event.shiftKey && !event.altKey && event.key === "Enter") {
        range.insertNode(document.createTextNode("\n"));
        range.collapse(false);
        setSelectionFocus(range);
        afterRenderEvent(vditor);
        scrollCenter(vditor.wysiwyg.element);
        event.preventDefault();
        return true;
    }

    if (event.key === "Enter") {
        scrollCenter(vditor.wysiwyg.element);
    }

    return false;
}
