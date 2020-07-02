import {scrollCenter} from "../util/editorCommonEvent";
import {hasClosestByAttribute} from "../util/hasClosest";
import {log} from "../util/log";
import {getSelectPosition, setRangeByWbr} from "../util/selection";
import {processAfterRender} from "./process";

export const inputEvent = (vditor: IVditor, event?: InputEvent) => {
    const range = getSelection().getRangeAt(0).cloneRange();
    let blockElement = hasClosestByAttribute(range.startContainer, "data-block", "0");
    // 前可以输入空格
    if (blockElement && event) {
        // 前空格处理
        const startOffset = getSelectPosition(blockElement, range).start;

        // 开始可以输入空格
        let startSpace = true;
        for (let i = startOffset - 1;
            // 软换行后有空格
             i > blockElement.textContent.substr(0, startOffset).lastIndexOf("\n");
             i--) {
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
            return;
        }
    }
    // TODO: 代码块、table 等元素不需要渲染
    if (!blockElement) {
        blockElement = vditor.sv.element;
    }
    // 添加光标位置
    range.insertNode(document.createTextNode(Lute.Caret));
    // 清除浏览器自带的样式
    blockElement.querySelectorAll("[style]").forEach((item) => {
        item.removeAttribute("style");
    });
    blockElement.querySelectorAll("font").forEach((item) => {
        item.outerHTML = item.innerHTML;
    });
    let html = blockElement.textContent;
    if (event?.inputType === "insertParagraph" && blockElement.previousElementSibling
        && blockElement.previousElementSibling.textContent.trim() !== "") {
        // 在粗体中换行
        html = blockElement.previousElementSibling.outerHTML + html;
        blockElement.previousElementSibling.remove();
    }
    // TODO: 链接引用，脚注？
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
    }
    log("SpinVditorSVDOM", html, "argument", vditor.options.debugger);
    html = vditor.lute.SpinVditorSVDOM(html);
    log("SpinVditorSVDOM", html, "result", vditor.options.debugger);
    if (isSVElement) {
        blockElement.innerHTML = html;
    } else {
        blockElement.outerHTML = html;
    }
    setRangeByWbr(vditor.sv.element, range);

    scrollCenter(vditor);

    processAfterRender(vditor, {
        enableAddUndoStack: true,
        enableHint: true,
        enableInput: true,
    });
};
