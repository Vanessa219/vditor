import {Constants} from "../constants";
import {isCtrl} from "../util/compatibility";
import {scrollCenter} from "../util/editorCommenEvent";
import {
    getLastNode,
    getTopList, hasClosestBlock, hasClosestByAttribute,
    hasClosestByClassName,
    hasClosestByMatchTag, hasClosestByTag,
    hasTopClosestByTag,
} from "../util/hasClosest";
import {matchHotKey} from "../util/hotKey";
import {processList} from "../util/processList";
import {mdKeydown, processTab} from "../util/processMD";
import {tableHotkey} from "../util/processTable";
import {getSelectPosition, setRangeByWbr, setSelectionFocus} from "../util/selection";
import {afterRenderEvent} from "./afterRenderEvent";
import {listOutdent} from "./highlightToolbar";
import {nextIsCode} from "./inlineTag";
import {processCodeRender, showCode} from "./processCodeRender";
import {removeHeading, setHeading} from "./setHeading";

export const processKeydown = (vditor: IVditor, event: KeyboardEvent) => {
    // Chrome firefox 触发 compositionend 机制不一致 https://github.com/Vanessa219/vditor/issues/188
    vditor.wysiwyg.composingLock = event.isComposing;
    if (event.isComposing) {
        return false;
    }

    // 添加第一次记录 undo 的光标
    if (event.key.indexOf("Arrow") === -1) {
        vditor.wysiwygUndo.recordFirstWbr(vditor, event);
    }

    // 仅处理以下快捷键操作
    if (event.key !== "Enter" && event.key !== "Tab" && event.key !== "Backspace"
        && !isCtrl(event) && event.key !== "Escape") {
        return false;
    }

    const range = getSelection().getRangeAt(0);
    const startContainer = range.startContainer;

    const blockElement = hasClosestBlock(startContainer);
    const pElement = hasClosestByMatchTag(startContainer, "P");

    if (pElement) {
        // md 处理
        if (mdKeydown(event, vditor, pElement, range)) {
            return true;
        }
        // li
        if (processList(range, vditor, pElement, event)) {
            return true;
        }
    }

    // table
    if (tableHotkey(vditor, event, range)) {
        return true;
    }

    // code render
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
        if (!isCtrl(event) && !event.shiftKey && event.altKey && event.key === "Enter" &&
            codeRenderElement.getAttribute("data-type") === "code-block") {
            const inputElemment = (vditor.wysiwyg.popover.querySelector(".vditor-input") as HTMLInputElement);
            inputElemment.focus();
            inputElemment.select();
            event.preventDefault();
            return true;
        }

        // 行级代码块中 command + a，近对当前代码块进行全选
        if (codeRenderElement.getAttribute("data-block") === "0" && matchHotKey("⌘-A", event)) {
            range.selectNodeContents(codeRenderElement.firstElementChild.firstElementChild);
            event.preventDefault();
            return true;
        }

        // 换行
        if (!isCtrl(event) && !event.altKey && event.key === "Enter" &&
            codeRenderElement.getAttribute("data-block") === "0") {
            if (!codeRenderElement.firstElementChild.firstElementChild.textContent.endsWith("\n")) {
                codeRenderElement.firstElementChild.firstElementChild.insertAdjacentText("beforeend", "\n");
            }
            range.insertNode(document.createTextNode("\n"));
            range.collapse(false);
            afterRenderEvent(vditor);
            processCodeRender(codeRenderElement, vditor);
            scrollCenter(vditor.wysiwyg.element);
            event.preventDefault();
            return true;
        }

        // tab
        if (vditor.options.tab && event.key === "Tab" && !event.shiftKey && range.toString() === "" &&
            codeRenderElement.getAttribute("data-block") === "0") {
            range.insertNode(document.createTextNode(vditor.options.tab));
            range.collapse(false);
            afterRenderEvent(vditor);
            processCodeRender(codeRenderElement, vditor);
            event.preventDefault();
            return true;
        }

        // TODO shift + tab, shift and 选中文字

        if (event.key === "Backspace" && !isCtrl(event) && !event.shiftKey && !event.altKey
            && codeRenderElement.getAttribute("data-block") === "0") {
            const codePosition = getSelectPosition(codeRenderElement, range);
            if ((codePosition.start === 0 ||
                (codePosition.start === 1 && codeRenderElement.innerText === "\n")) // 空代码块，光标在 \n 后
                && range.toString() === "") {
                // Backspace: 光标位于第零个字符，仅删除代码块标签
                codeRenderElement.outerHTML =
                    `<p data-block="0"><wbr>${codeRenderElement.firstElementChild.firstElementChild.innerHTML}</p>`;
                setRangeByWbr(vditor.wysiwyg.element, range);
                afterRenderEvent(vditor);
                event.preventDefault();
                return true;
            }
        }
    }

    // 顶层 blockquote
    const topBQElement = hasTopClosestByTag(startContainer, "BLOCKQUOTE");
    if (topBQElement) {
        if (!event.shiftKey && event.altKey && event.key === "Enter") {
            if (!isCtrl(event)) {
                // alt+enter: 跳出多层 blockquote 嵌套之后 https://github.com/Vanessa219/vditor/issues/51
                range.setStartAfter(topBQElement);
            } else {
                // ctrl+alt+enter: 跳出多层 blockquote 嵌套之前
                range.setStartBefore(topBQElement);
            }
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
    }

    // blockquote
    const blockquoteElement = hasClosestByMatchTag(startContainer, "BLOCKQUOTE");
    if (blockquoteElement && range.toString() === "") {
        if (event.key === "Backspace" && !isCtrl(event) && !event.shiftKey && !event.altKey &&
            getSelectPosition(blockquoteElement, range).start === 0) {
            // Backspace: 光标位于引用中的第零个字符，仅删除引用标签
            range.insertNode(document.createElement("wbr"));
            blockquoteElement.outerHTML = blockquoteElement.innerHTML;
            setRangeByWbr(vditor.wysiwyg.element, range);
            afterRenderEvent(vditor);
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
                (vditor.wysiwyg.popover.querySelector('[data-type="insert-after"]') as HTMLElement).click();
                event.preventDefault();
                return true;
            }
        }

        if (blockElement && matchHotKey("⌘-⇧-:", event)) {
            // 插入 blockquote
            range.insertNode(document.createElement("wbr"));
            blockElement.outerHTML = `<blockquote data-block="0">${blockElement.outerHTML}</blockquote>`;
            setRangeByWbr(vditor.wysiwyg.element, range);
            afterRenderEvent(vditor);
            event.preventDefault();
            return true;
        }
    }

    // h1-h6
    const headingElement = hasClosestByTag(startContainer, "H");
    if (headingElement && headingElement.tagName.length === 2) {
        if (headingElement.tagName === "H6" && startContainer.textContent.length === range.startOffset &&
            !isCtrl(event) && !event.shiftKey && !event.altKey && event.key === "Enter") {
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
        if (matchHotKey("⌘-=", event)) {
            const index = parseInt((headingElement as HTMLElement).tagName.substr(1), 10) - 1;
            if (index < 1) {
                return;
            }
            setHeading(vditor, `h${index}`);
            afterRenderEvent(vditor);
            event.preventDefault();
            return true;
        }

        // enter++: 标题变小
        if (matchHotKey("⌘--", event)) {
            const index = parseInt((headingElement as HTMLElement).tagName.substr(1), 10) + 1;
            if (index > 6) {
                return;
            }
            setHeading(vditor, `h${index}`);
            afterRenderEvent(vditor);
            event.preventDefault();
            return true;
        }

        if (event.key === "Backspace" && !isCtrl(event) && !event.shiftKey && !event.altKey
            && headingElement.textContent === "") {
            // 空标题删除
            removeHeading(vditor);
        }
    }

    // task list
    const taskItemElement = hasClosestByClassName(startContainer, "vditor-task");
    if (taskItemElement) {
        if (matchHotKey("⌘-⇧-J", event)) {
            // ctrl + shift: toggle checked
            const inputElement = taskItemElement.firstElementChild as HTMLInputElement;
            if (inputElement.checked) {
                inputElement.removeAttribute("checked");
            } else {
                inputElement.setAttribute("checked", "checked");
            }
            afterRenderEvent(vditor);
            event.preventDefault();
            return true;
        }

        // Backspace: 在选择框前进行删除
        if (event.key === "Backspace" && !isCtrl(event) && !event.shiftKey && !event.altKey && range.toString() === ""
            && range.startOffset === 1
            && ((startContainer.nodeType === 3 && startContainer.previousSibling &&
                (startContainer.previousSibling as HTMLElement).tagName === "INPUT")
                || startContainer.nodeType !== 3)) {
            const previousElement = taskItemElement.previousElementSibling;
            taskItemElement.querySelector("input").remove();
            if (previousElement) {
                const lastNode = getLastNode(previousElement);
                lastNode.parentElement.insertAdjacentHTML("beforeend", "<wbr>" + taskItemElement.innerHTML.trim());
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

        if (event.key === "Enter" && !isCtrl(event) && !event.shiftKey && !event.altKey) {
            if (taskItemElement.textContent.trim() === "") {
                // 当前任务列表无文字
                if (hasClosestByClassName(taskItemElement.parentElement, "vditor-task")) {
                    // 为子元素时，需进行反向缩进
                    const topListElement = getTopList(startContainer);
                    if (topListElement) {
                        listOutdent(vditor, taskItemElement, range, topListElement);
                    }
                } else {
                    // 仅有一级任务列表
                    if (taskItemElement.nextElementSibling) {
                        // 任务列表下方还有元素，需要使用用段落隔断
                        let afterHTML = "";
                        let beforeHTML = "";
                        let isAfter = false;
                        Array.from(taskItemElement.parentElement.children).forEach((taskItem) => {
                            if (taskItemElement.isEqualNode(taskItem)) {
                                isAfter = true;
                            } else {
                                if (isAfter) {
                                    afterHTML += taskItem.outerHTML;
                                } else {
                                    beforeHTML += taskItem.outerHTML;
                                }
                            }
                        });
                        const parentTagName = taskItemElement.parentElement.tagName;
                        const dataMarker = taskItemElement.parentElement.tagName === "OL" ? "" : ` data-marker="${taskItemElement.parentElement.getAttribute("data-marker")}"`;
                        let startAttribute = "";
                        if (beforeHTML) {
                            startAttribute = taskItemElement.parentElement.tagName === "UL" ? "" : ` start="1"`;
                            beforeHTML = `<${parentTagName} data-tight="true"${dataMarker} data-block="0">${beforeHTML}</${parentTagName}>`;
                        }
                        taskItemElement.parentElement.outerHTML = `${beforeHTML}<p data-block="0">\n<wbr></p><${parentTagName}
 data-tight="true"${dataMarker} data-block="0"${startAttribute}>${afterHTML}</${parentTagName}>`;
                    } else {
                        // 任务列表下方无任务列表元素
                        taskItemElement.parentElement.insertAdjacentHTML("afterend", `<p data-block="0">\n<wbr></p>`);
                        if (taskItemElement.parentElement.querySelectorAll("li").length === 1) {
                            // 任务列表仅有一项时，使用 p 元素替换
                            taskItemElement.parentElement.remove();
                        } else {
                            // 任务列表有多项时，当前任务列表位于最后一项，移除该任务列表
                            taskItemElement.remove();
                        }
                    }
                }
            } else if (startContainer.nodeType !== 3 && range.startOffset === 0 &&
                (startContainer.firstChild as HTMLElement).tagName === "INPUT") {
                // 光标位于 input 之前
                range.setStart(startContainer.childNodes[1], 1);
            } else {
                // 当前任务列表有文字，光标后的文字需添加到新任务列表中
                range.setEndAfter(taskItemElement.lastChild);
                taskItemElement.insertAdjacentHTML("afterend", `<li class="vditor-task" data-marker="${taskItemElement.getAttribute("data-marker")}"><input type="checkbox"> <wbr></li>`);
                document.querySelector("wbr").after(range.extractContents());
            }
            setRangeByWbr(vditor.wysiwyg.element, range);
            afterRenderEvent(vditor);
            scrollCenter(vditor.wysiwyg.element);
            event.preventDefault();
            return true;
        }
    }

    // alt+enter
    if (event.altKey && event.key === "Enter" && !isCtrl(event) && !event.shiftKey) {
        // 切换到链接、链接引用、脚注引用弹出的输入框中
        const aElement = hasClosestByMatchTag(startContainer, "A");
        const linRefElement = hasClosestByAttribute(startContainer, "data-type", "link-ref");
        const footnoteRefElement = hasClosestByAttribute(startContainer, "data-type", "footnotes-ref");
        if (aElement || linRefElement || footnoteRefElement ||
            (headingElement && headingElement.tagName.length === 2)) {
            const inputElement = vditor.wysiwyg.popover.querySelector("input");
            inputElement.focus();
            inputElement.select();
        }
    }

    // 删除有子工具栏的块
    if (matchHotKey("⌘-⇧-X", event)) {
        const itemElement: HTMLElement = vditor.wysiwyg.popover.querySelector('[data-type="remove"]');
        if (itemElement) {
            itemElement.click();
            event.preventDefault();
            return true;
        }
    }

    // 在有子工具栏的块后插入行
    if (matchHotKey("⌘-⇧-E", event)) {
        const itemElement: HTMLElement = vditor.wysiwyg.popover.querySelector('[data-type="insert-after"]')
            || vditor.wysiwyg.popover.querySelector('[data-type="indent"]');
        if (itemElement) {
            itemElement.click();
            event.preventDefault();
            return true;
        }
    }

    // 在有子工具栏的块前插入行
    if (matchHotKey("⌘-⇧-S", event)) {
        const itemElement: HTMLElement = vditor.wysiwyg.popover.querySelector('[data-type="insert-before"]')
            || vditor.wysiwyg.popover.querySelector('[data-type="outdent"]');
        if (itemElement) {
            itemElement.click();
            event.preventDefault();
            return true;
        }
    }

    // 对有子工具栏的块缩进
    if (matchHotKey("⌘-⇧-I", event)) {
        const itemElement: HTMLElement = vditor.wysiwyg.popover.querySelector('[data-type="indent"]');
        if (itemElement) {
            itemElement.click();
            event.preventDefault();
            return true;
        }
    }

    // 对有子工具栏的块反向缩进
    if (matchHotKey("⌘-⇧-O", event)) {
        const itemElement: HTMLElement = vditor.wysiwyg.popover.querySelector('[data-type="outdent"]');
        if (itemElement) {
            itemElement.click();
            event.preventDefault();
            return true;
        }
    }

    if (processTab(vditor, range, event)) {
        return true;
    }

    // shift+enter：软换行，但 table/hr/heading 处理、cell 内换行、block render 换行、li 软换行处理单独写在上面
    if (!isCtrl(event) && event.shiftKey && !event.altKey && event.key === "Enter") {
        if (["STRONG", "S", "STRONG", "I", "EM", "B"].includes(startContainer.parentElement.tagName)) {
            // 行内元素软换行需继续 https://github.com/Vanessa219/vditor/issues/170
            range.insertNode(document.createTextNode("\n" + Constants.ZWSP));
        } else {
            range.insertNode(document.createTextNode("\n"));
        }
        range.collapse(false);
        setSelectionFocus(range);
        afterRenderEvent(vditor);
        scrollCenter(vditor.wysiwyg.element);
        event.preventDefault();
        return true;
    }

    // 删除
    if (event.key === "Backspace" && !isCtrl(event) && !event.shiftKey && !event.altKey && range.toString() === "") {
        const offsetChildNode = startContainer.childNodes[range.startOffset] as HTMLElement;
        if (startContainer.nodeType !== 3 && offsetChildNode && range.startOffset > 0 &&
            (offsetChildNode.tagName === "TABLE" || offsetChildNode.tagName === "HR")) {
            // 光标位于 table/hr 前，table/hr 前有内容
            range.selectNodeContents(offsetChildNode.previousElementSibling);
            range.collapse(false);
            event.preventDefault();
            return true;
        }

        if (blockElement) {
            if (blockElement.previousElementSibling
                && blockElement.previousElementSibling.classList.contains("vditor-wysiwyg__block")
                && blockElement.previousElementSibling.getAttribute("data-block") === "0") {
                const rangeStart = getSelectPosition(blockElement, range).start;
                if (rangeStart === 0 || (rangeStart === 1 && blockElement.innerText.startsWith(Constants.ZWSP))) {
                    // 当前块删除后光标落于代码渲染块上，当前块会被删除，因此需要阻止事件，不能和 keyup 中的代码块处理合并
                    showCode(blockElement.previousElementSibling.lastElementChild as HTMLElement, false);
                    if (blockElement.innerHTML.trim() === "") {
                        // 当前块为空且不是最后一个时，需要删除
                        blockElement.remove();
                        afterRenderEvent(vditor);
                    }
                    event.preventDefault();
                    return true;
                }
            }

            const rangeStartOffset = range.startOffset;
            if (range.toString() === "" && startContainer.nodeType === 3 &&
                startContainer.textContent.charAt(rangeStartOffset - 2) === "\n" &&
                startContainer.textContent.charAt(rangeStartOffset - 1) !== Constants.ZWSP
                && ["STRONG", "S", "STRONG", "I", "EM", "B"].includes(startContainer.parentElement.tagName)) {
                // 保持行内元素软换行需继续的一致性
                startContainer.textContent = startContainer.textContent.substring(0, rangeStartOffset - 1) +
                    Constants.ZWSP;
                range.setStart(startContainer, rangeStartOffset);
                range.collapse(true);
                afterRenderEvent(vditor);
                event.preventDefault();
                return true;
            }

            // inline code、math、html 行前零宽字符后进行删除
            if (startContainer.textContent === Constants.ZWSP && range.startOffset === 1
                && !startContainer.previousSibling && nextIsCode(range)) {
                startContainer.textContent = "";
                // 不能返回，其前面为代码渲染块时需进行以下处理：修正光标位于 inline math/html 前，按下删除按钮 code 中内容会被删除
            }

            // 修正光标位于 inline math/html 前，按下删除按钮 code 中内容会被删除, 不能返回，还需要进行后续处理
            blockElement.querySelectorAll("span.vditor-wysiwyg__block").forEach((item) => {
                (item.firstElementChild as HTMLElement).style.display = "inline";
                (item.lastElementChild as HTMLElement).style.display = "none";
            });
        }
    }

    // 除 md 处理、cell 内换行、table 添加新行/列、代码块语言切换、block render 换行、跳出/逐层跳出 blockquote、h6 换行、
    // 任务列表换行、软换行外需在换行时调整文档位置
    if (event.key === "Enter") {
        scrollCenter(vditor.wysiwyg.element);
    }

    return false;
};
