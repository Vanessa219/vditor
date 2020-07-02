import {isCtrl} from "../util/compatibility";
import {fixTab} from "../util/fixBrowserBehavior";
import {hasClosestByAttribute, hasClosestByClassName} from "../util/hasClosest";
import {getEditorRange, getSelectPosition, setRangeByWbr} from "../util/selection";
import {inputEvent} from "./inputEvent";
import {processAfterRender} from "./process";

export const processKeydown = (vditor: IVditor, event: KeyboardEvent) => {
    vditor.sv.composingLock = event.isComposing;
    if (event.isComposing) {
        return false;
    }

    if (event.key.indexOf("Arrow") === -1) {
        vditor.undo.recordFirstPosition(vditor, event);
    }

    // 仅处理以下快捷键操作
    if (event.key !== "Enter" && event.key !== "Tab" && event.key !== "Backspace" && event.key.indexOf("Arrow") === -1
        && !isCtrl(event) && event.key !== "Escape" && event.key !== " ") {
        return false;
    }
    const range = getEditorRange(vditor.sv.element);
    const startContainer = range.startContainer;
    // 回车
    if (event.key === "Enter" && !isCtrl(event) && !event.altKey) {
        const blockElement = hasClosestByAttribute(startContainer, "data-block", "0");
        if (blockElement && !blockElement.textContent.endsWith("\n")) {
            // 结尾需 \n
            blockElement.insertAdjacentText("beforeend", "\n");
        }
        range.insertNode(document.createTextNode("\n"));
        range.collapse(false);
        if (!blockElement || (blockElement && blockElement.innerHTML.trim() !== "")) {
            inputEvent(vditor);
        }
        event.preventDefault();
        return true;
    }

    // 代码块
    const preElement = hasClosestByClassName(startContainer, "vditor-sv__marker--pre");
    if (preElement && event.key === "Backspace" && !isCtrl(event) && !event.shiftKey && !event.altKey) {
        // Backspace: 光标位于第零个字符，仅删除代码块标签
        const codePosition = getSelectPosition(preElement, range);
        if ((codePosition.start === 0 ||
            (codePosition.start === 1 && preElement.innerText === "\n")) // 空代码块，光标在 \n 后
            && range.toString() === "") {
            preElement.parentElement.outerHTML =
                `<p data-block="0"><wbr>${preElement.firstElementChild.innerHTML}</p>`;
            setRangeByWbr(vditor[vditor.currentMode].element, range);
            processAfterRender(vditor);
            event.preventDefault();
            return true;
        }
    }

    // 代码块语言或飘号后
    const codeInfoElement = hasClosestByAttribute(startContainer, "data-type", "code-block-info") ||
        hasClosestByAttribute(startContainer, "data-type", "code-block-open-marker") ||
        hasClosestByAttribute(startContainer, "data-type", "math-block-open-marker");
    if (codeInfoElement && (event.key === "Enter" || event.key === "Tab")) {
        // 回车/tab 到代码块中
        range.selectNodeContents(codeInfoElement.parentElement.querySelector("code"));
        range.collapse(true);
        event.preventDefault();
        return true;
    }

    // 删除或空格不调用 lute 解析
    if (event.key === "Backspace" || event.key === " ") {
        range.insertNode(document.createElement("wbr"));
        const wbrElement = document.querySelector("wbr");
        let markerElement;
        if (wbrElement.parentElement?.className.indexOf("vditor-sv__marker") > -1) {
            markerElement = wbrElement.parentElement;
        } else if (wbrElement.previousSibling && wbrElement.previousSibling.nodeType !== 3 &&
            (wbrElement.previousSibling as HTMLElement).className.indexOf("vditor-sv__marker") > -1) {
            markerElement = wbrElement.previousSibling;
        }
        if (markerElement) {
            const lastIndex = wbrElement.previousSibling.textContent.lastIndexOf(" ");
            if (event.key === "Backspace" && lastIndex > -1) {
                markerElement.textContent = markerElement.textContent.substr(0, lastIndex);
                range.selectNode(markerElement.firstChild);
                range.collapse(false);
                event.preventDefault();
                return true;
            }
            if (event.key === " ") {
                markerElement.textContent = markerElement.textContent + " ";
                range.selectNode(markerElement.firstChild);
                range.collapse(false);
                event.preventDefault();
                return true;
            }
        }
        wbrElement.remove();
    }

    // tab
    if (fixTab(vditor, range, event)) {
        return true;
    }

    return false;
};
