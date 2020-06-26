import {hasClosestBlock} from "../util/hasClosest";
import {log} from "../util/log";
import {getSelectPosition, setRangeByWbr} from "../util/selection";
import {processAfterRender} from "./process";

export const inputEvent = (vditor: IVditor, event: InputEvent) => {
    const range = getSelection().getRangeAt(0).cloneRange();
    let blockElement = hasClosestBlock(range.startContainer);
    // 前可以输入空格
    if (blockElement) {
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
    if (!blockElement.querySelector("wbr")) {
        range.insertNode(document.createElement("wbr"));
    }
    // 清除浏览器自带的样式
    blockElement.querySelectorAll("[style]").forEach((item) => {
        item.removeAttribute("style");
    });
    let html = blockElement.outerHTML;
    if (event.inputType === "insertParagraph" && blockElement.previousElementSibling
        && blockElement.previousElementSibling.textContent.trim() !== "") {
        // 在粗体中换行
        html = blockElement.previousElementSibling.outerHTML + html;
        blockElement.previousElementSibling.remove();
    }
    // TODO: 链接引用，脚注，列表需要到最顶层？
    const isSVElement = blockElement.isEqualNode(vditor.sv.element);
    if (isSVElement) {
        html = blockElement.innerHTML;
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

    processAfterRender(vditor, {
        enableAddUndoStack: true,
        enableHint: true,
        enableInput: true,
    });
};
