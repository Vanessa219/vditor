import {Constants} from "../constants";
import {isCtrl} from "../util/compatibility";
import {scrollCenter} from "../util/editorCommenEvent";
import {
    fixBlockquote,
    fixCodeBlock, fixDelete,
    fixList,
    fixMarkdown,
    fixTab,
    fixTable,
    fixTask,
} from "../util/fixBrowserBehavior";
import {
    hasClosestBlock,
    hasClosestByAttribute,
    hasClosestByClassName, hasClosestByHeadings,
    hasClosestByMatchTag,
    hasTopClosestByTag,
} from "../util/hasClosest";
import {matchHotKey} from "../util/hotKey";
import {getSelectPosition, setSelectionFocus} from "../util/selection";
import {afterRenderEvent} from "./afterRenderEvent";
import {nextIsCode} from "./inlineTag";
import {removeHeading, setHeading} from "./setHeading";
import {showCode} from "./showCode";

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

    // md 处理
    if (fixMarkdown(event, vditor, pElement, range)) {
        return true;
    }

    // li
    if (fixList(range, vditor, pElement, event)) {
        return true;
    }

    // table
    if (fixTable(vditor, event, range)) {
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

        if (codeRenderElement.getAttribute("data-block") === "0" &&
            fixCodeBlock(vditor, event, codeRenderElement.firstElementChild as HTMLElement, range)) {
            return true;
        }
    }

    // blockquote
    if (fixBlockquote(vditor, range, event, pElement)) {
        return true;
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

    // h1-h6
    const headingElement = hasClosestByHeadings(startContainer);
    if (headingElement) {
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
    if (fixTask(vditor, range, event)) {
        return true;
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

    if (fixTab(vditor, range, event)) {
        return true;
    }

    // shift+enter：软换行，但 table/hr/heading 处理、cell 内换行、block render 换行处理单独写在上面
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
        if (pElement && fixDelete(vditor, range, event, pElement)) {
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
