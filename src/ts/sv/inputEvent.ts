import {scrollCenter} from "../util/editorCommonEvent";
import {hasClosestByAttribute} from "../util/hasClosest";
import {log} from "../util/log";
import {getSelectPosition, setRangeByWbr} from "../util/selection";
import {processAfterRender} from "./process";

export const inputEvent = (vditor: IVditor, event?: InputEvent) => {
    const range = getSelection().getRangeAt(0).cloneRange();
    let blockElement = hasClosestByAttribute(range.startContainer, "data-block", "0");
    // 不调用 lute 解析
    if (blockElement && event && (event.inputType === "deleteContentBackward" || event.data === " ")) {
        // 开始可以输入空格
        const startOffset = getSelectPosition(blockElement, range).start;
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
        //  list item marker 删除或空格
        const listElement = hasClosestByAttribute(range.startContainer, "data-type", "li");
        if (listElement) {
            if (event.data === " " &&
                (hasClosestByAttribute(range.startContainer, "data-type", "li-marker") ||
                    hasClosestByAttribute(range.startContainer, "data-type", "task-marker"))) {
                processAfterRender(vditor);
                return;
            }
            const liMarkerElement = listElement.querySelector('[data-type="li-marker"]');
            if (event.inputType === "deleteContentBackward" && getSelectPosition(listElement, range).start <=
                listElement.getAttribute("data-space").length +
                (liMarkerElement ? liMarkerElement.textContent.length : 0) +
                (listElement.querySelector('[data-type="task-marker"]') ? 4 : 0)
            ) {
                processAfterRender(vditor);
                return;
            }
        }
        // heading marker 删除或空格
        const headingElement = hasClosestByAttribute(range.startContainer, "data-type", "heading-marker");
        if (headingElement && (event.data === " " || event.inputType === "deleteContentBackward")) {
            processAfterRender(vditor);
            return;
        }
        // blockquote marker 删除或空格
        const blockquoteElement = hasClosestByAttribute(range.startContainer, "data-type", "blockquote-marker");
        if (blockquoteElement && (event.data === " " || event.inputType === "deleteContentBackward")) {
            processAfterRender(vditor);
            return;
        }
        // block code marker 删除
        const blockCodeElement =
            hasClosestByAttribute(range.startContainer, "data-type", "code-block");
        if (blockCodeElement && event.inputType === "deleteContentBackward") {
            const startIndex = getSelectPosition(blockElement, range).start;
            if (startIndex <= 2 || startIndex === blockCodeElement.textContent.length - 1) {
                if (blockElement.querySelectorAll(".vditor-sv__marker").length !== 2) {
                    blockElement.querySelector(".vditor-sv__marker").remove();
                }
                processAfterRender(vditor);
                return;
            }
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
    // 添加光标位置
    range.insertNode(document.createTextNode(Lute.Caret));
    // 清除浏览器自带的样式
    blockElement.querySelectorAll("[style]").forEach((item) => { // 不可前置，否则会影响 newline 的样式
        item.removeAttribute("style");
    });
    blockElement.querySelectorAll("font").forEach((item) => { // 不可前置，否则会影响光标的位置
        item.outerHTML = item.innerHTML;
    });
    if (blockElement.getAttribute("data-type") === "link-ref-defs-block") {
        // 修改链接引用
        blockElement = vditor.sv.element;
    }
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
        if (blockElement.previousElementSibling) {
            html = blockElement.previousElementSibling.textContent + html;
            blockElement.previousElementSibling.remove();
        }
        if (blockElement.nextElementSibling) {
            html = html + blockElement.nextElementSibling.textContent;
            blockElement.nextElementSibling.remove();
        }
        // TODO: 脚注？
        // 添加链接引用
        const allLinkRefDefsElement = vditor.sv.element.querySelector("[data-type='link-ref-defs-block']");
        if (allLinkRefDefsElement && !blockElement.isEqualNode(allLinkRefDefsElement)) {
            html += allLinkRefDefsElement.textContent;
            allLinkRefDefsElement.remove();
        }
    }
    log("SpinVditorSVDOM", html, "argument", vditor.options.debugger);
    html = vditor.lute.SpinVditorSVDOM(html);
    log("SpinVditorSVDOM", html, "result", vditor.options.debugger);
    if (isSVElement) {
        blockElement.innerHTML = html;
    } else {
        blockElement.outerHTML = html;

        const allLinkRefDefsElement = vditor.sv.element.querySelector("[data-type='link-ref-defs-block']");
        if (allLinkRefDefsElement) {
            vditor.sv.element.insertAdjacentElement("beforeend", allLinkRefDefsElement);
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
