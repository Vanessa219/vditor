import {scrollCenter} from "../util/editorCommonEvent";
import {hasClosestByAttribute} from "../util/hasClosest";
import {getSelectPosition, setRangeByWbr} from "../util/selection";
import {processAfterRender, processSpinVditorSVDOM} from "./process";

export const inputEvent = (vditor: IVditor, event?: InputEvent) => {
    const range = getSelection().getRangeAt(0).cloneRange();
    let startContainer = range.startContainer;
    if (range.startContainer.nodeType !== 3 && (range.startContainer as HTMLElement).tagName === "DIV") {
        startContainer = range.startContainer.childNodes[range.startOffset - 1];
    }
    let blockElement = hasClosestByAttribute(startContainer, "data-block", "0");
    // 不调用 lute 解析
    if (blockElement && event && (event.inputType === "deleteContentBackward" || event.data === " ")) {
        // 开始可以输入空格
        const startOffset = getSelectPosition(blockElement, vditor.sv.element, range).start;
        let startSpace = true;
        for (let i = startOffset - 1;
            // 软换行后有空格
             i > blockElement.textContent.substr(0, startOffset).lastIndexOf("\n"); i--) {
            if (blockElement.textContent.charAt(i) !== " " &&
                // 多个 tab 前删除不形成代码块 https://github.com/Vanessa219/vditor/issues/162 1
                blockElement.textContent.charAt(i) !== "\t") {
                startSpace = false;
                break;
            }
        }
        if (startOffset === 0) {
            startSpace = false;
        }
        if (startSpace) {
            processAfterRender(vditor);
            return;
        }
        // 删除或空格不解析，否则会 format 回去
        if ((event.data === " " || event.inputType === "deleteContentBackward") &&
            (hasClosestByAttribute(startContainer, "data-type", "padding") // 场景：b 前进行删除 [> 1. a\n>   b]
                || hasClosestByAttribute(startContainer, "data-type", "li-marker")  // 场景：删除最后一个字符 [* 1\n* ]
                || hasClosestByAttribute(startContainer, "data-type", "task-marker")  // 场景：删除最后一个字符 [* [ ] ]
                // 场景：删除前面的飘号 [```\n``` ]
                || hasClosestByAttribute(startContainer, "data-type", "code-block-open-marker")
                // 场景：删除后面的飘号 [```\n``` ]
                || hasClosestByAttribute(startContainer, "data-type", "code-block-close-marker")
                || hasClosestByAttribute(startContainer, "data-type", "blockquote-marker")  // 场景：删除最后一个字符 [> ]
            )) {
            processAfterRender(vditor);
            return;
        }
    }
    if (blockElement && blockElement.textContent.trimRight() === "$$") {
        // 内联数学公式
        processAfterRender(vditor);
        return;
    }
    if (!blockElement) {
        blockElement = vditor.sv.element;
    }
    if (blockElement.firstElementChild.getAttribute("data-type") === "link-ref-defs-block") {
        // 修改链接引用
        blockElement = vditor.sv.element;
    }
    if (hasClosestByAttribute(startContainer, "data-type", "footnotes-link")) {
        // 修改脚注角标
        blockElement = vditor.sv.element;
    }
    const footnotesElement = hasClosestByAttribute(startContainer, "data-type", "footnotes-block");
    if (footnotesElement) {
        // 修改脚注
        blockElement = footnotesElement;
    }
    // 添加光标位置
    if (blockElement.textContent.indexOf(Lute.Caret) === -1) {
        // 点击工具栏会插入 Caret
        range.insertNode(document.createTextNode(Lute.Caret));
    }
    // 清除浏览器自带的样式
    blockElement.querySelectorAll("[style]").forEach((item) => { // 不可前置，否则会影响 newline 的样式
        item.removeAttribute("style");
    });
    blockElement.querySelectorAll("font").forEach((item) => { // 不可前置，否则会影响光标的位置
        item.outerHTML = item.innerHTML;
    });
    let html = blockElement.textContent;
    if (event?.inputType === "insertParagraph" && blockElement.previousElementSibling
        && blockElement.previousElementSibling.textContent.trim() !== "") {
        // 在粗体中换行
        html = blockElement.previousElementSibling.outerHTML + html;
        blockElement.previousElementSibling.remove();
    }
    const isSVElement = blockElement.isEqualNode(vditor.sv.element);
    if (isSVElement) {
        html = blockElement.textContent;
    } else {
        // 添加前一个块元素
        if (blockElement.previousElementSibling) {
            html = blockElement.previousElementSibling.textContent + html;
            blockElement.previousElementSibling.remove();
        }
        // 添加链接引用
        const allLinkRefDefsElement = vditor.sv.element.querySelector("[data-type='link-ref-defs-block']");
        if (allLinkRefDefsElement && !blockElement.isEqualNode(allLinkRefDefsElement)) {
            html += allLinkRefDefsElement.parentElement.textContent;
            allLinkRefDefsElement.parentElement.remove();
        }
        // 添加脚注
        const allFootnoteElement = vditor.sv.element.querySelector("[data-type='footnotes-block']");
        if (allFootnoteElement && !blockElement.isEqualNode(allFootnoteElement)) {
            html += allFootnoteElement.parentElement.textContent;
            allFootnoteElement.parentElement.remove();
        }
    }
    html = processSpinVditorSVDOM(html, vditor);
    if (isSVElement) {
        blockElement.innerHTML = html;
    } else {
        blockElement.outerHTML = html;

        const allLinkRefDefsElement = vditor.sv.element.querySelector("[data-type='link-ref-defs-block']");
        if (allLinkRefDefsElement) {
            vditor.sv.element.insertAdjacentElement("beforeend", allLinkRefDefsElement.parentElement);
        }

        const allFootnoteElement = vditor.sv.element.querySelector("[data-type='footnotes-block']");
        if (allFootnoteElement) {
            vditor.sv.element.insertAdjacentElement("beforeend", allFootnoteElement.parentElement);
        }
    }
    setRangeByWbr(vditor.sv.element, range);

    scrollCenter(vditor);

    processAfterRender(vditor, {
        enableAddUndoStack: true,
        enableHint: true,
        enableInput: true,
    });
};
