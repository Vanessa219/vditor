import {scrollCenter} from "../util/editorCommonEvent";
import {hasClosestByAttribute} from "../util/hasClosest";
import {getSelectPosition, setRangeByWbr} from "../util/selection";
import {getSideByType, processAfterRender, processSpinVditorSVDOM} from "./process";
import {combineFootnote} from "./combineFootnote";

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

        if (event.inputType === "deleteContentBackward") {
            // https://github.com/Vanessa219/vditor/issues/584 代码块 marker 删除
            const codeBlockMarkerElement =
                hasClosestByAttribute(startContainer, "data-type", "code-block-open-marker") ||
                hasClosestByAttribute(startContainer, "data-type", "code-block-close-marker");
            if (codeBlockMarkerElement) {
                if (codeBlockMarkerElement.getAttribute("data-type") === "code-block-close-marker") {
                    const openMarkerElement = getSideByType(startContainer, "code-block-open-marker");
                    if (openMarkerElement) {
                        openMarkerElement.textContent = codeBlockMarkerElement.textContent;
                        processAfterRender(vditor);
                        return;
                    }
                }
                if (codeBlockMarkerElement.getAttribute("data-type") === "code-block-open-marker") {
                    const openMarkerElement = getSideByType(startContainer, "code-block-close-marker", false);
                    if (openMarkerElement) {
                        openMarkerElement.textContent = codeBlockMarkerElement.textContent;
                        processAfterRender(vditor);
                        return;
                    }
                }
            }
            // https://github.com/Vanessa219/vditor/issues/877 数学公式输入删除生成节点
            const mathBlockMarkerElement =
                hasClosestByAttribute(startContainer, "data-type", "math-block-open-marker");
            if (mathBlockMarkerElement) {
                const mathBlockCloseElement = mathBlockMarkerElement.nextElementSibling.nextElementSibling;
                if (mathBlockCloseElement && mathBlockCloseElement.getAttribute("data-type") === "math-block-close-marker") {
                    mathBlockCloseElement.remove();
                    processAfterRender(vditor);
                }
                return;
            }

            blockElement.querySelectorAll('[data-type="code-block-open-marker"]').forEach((item: HTMLElement) => {
                if (item.textContent.length === 1) {
                    item.remove();
                }
            });
            blockElement.querySelectorAll('[data-type="code-block-close-marker"]').forEach((item: HTMLElement) => {
                if (item.textContent.length === 1) {
                    item.remove();
                }
            });

            // 标题删除
            const headingElement = hasClosestByAttribute(startContainer, "data-type", "heading-marker");
            if (headingElement && headingElement.textContent.indexOf("#") === -1) {
                processAfterRender(vditor);
                return;
            }
        }
        // 删除或空格不解析，否则会 format 回去
        if ((event.data === " " || event.inputType === "deleteContentBackward") &&
            (hasClosestByAttribute(startContainer, "data-type", "padding") // 场景：b 前进行删除 [> 1. a\n>   b]
                || hasClosestByAttribute(startContainer, "data-type", "li-marker")  // 场景：删除最后一个字符 [* 1\n* ]
                || hasClosestByAttribute(startContainer, "data-type", "task-marker")  // 场景：删除最后一个字符 [* [ ] ]
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
    if (blockElement.firstElementChild?.getAttribute("data-type") === "link-ref-defs-block") {
        // 修改链接引用
        blockElement = vditor.sv.element;
    }
    if (hasClosestByAttribute(startContainer, "data-type", "footnotes-link")) {
        // 修改脚注角标
        blockElement = vditor.sv.element;
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
    const isSVElement = blockElement.isEqualNode(vditor.sv.element);
    if (isSVElement) {
        html = blockElement.textContent;
    } else {
        // 添加前一个块元素
        if (blockElement.previousElementSibling) {
            html = blockElement.previousElementSibling.textContent + html;
            blockElement.previousElementSibling.remove();
        }
        if (blockElement.previousElementSibling && html.indexOf("---\n") === 0) {
            // 确认 yaml-front 是否为首行
            html = blockElement.previousElementSibling.textContent + html;
            blockElement.previousElementSibling.remove();
        }
        // 添加链接引用
        let footnotes = ""

        vditor.sv.element.querySelectorAll("[data-type='link-ref-defs-block']").forEach((item, index) => {
            if (item && !(blockElement as HTMLElement).isEqualNode(item.parentElement)) {
                footnotes += item.parentElement.textContent + "\n";
                item.parentElement.remove();
            }
        });

        // 添加脚注到文章头，便于lute处理
        vditor.sv.element.querySelectorAll("[data-type='footnotes-link']").forEach((item, index) => {
            if (item && !(blockElement as HTMLElement).isEqualNode(item.parentElement)) {
                footnotes += item.parentElement.textContent + "\n";
                item.parentElement.remove();
            }
        });
        html = footnotes + html;
    }
    html = processSpinVditorSVDOM(html, vditor);
    if (isSVElement) {
        blockElement.innerHTML = html;
    } else {
        blockElement.outerHTML = html;
    }

    vditor.sv.element.querySelectorAll("[data-type='link-ref-defs-block']").forEach((item) => {
        vditor.sv.element.insertAdjacentElement("beforeend", item.parentElement)
    })

    // 合并脚注
    combineFootnote(vditor.sv.element, (root: HTMLElement) => {
        vditor.sv.element.insertAdjacentElement("beforeend", root)
    })

    setRangeByWbr(vditor.sv.element, range);

    scrollCenter(vditor);

    processAfterRender(vditor, {
        enableAddUndoStack: true,
        enableHint: true,
        enableInput: true,
    });
};
