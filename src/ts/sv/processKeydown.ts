import {isCtrl} from "../util/compatibility";
import {fixTab} from "../util/fixBrowserBehavior";
import {hasClosestByAttribute, hasTopClosestByAttribute} from "../util/hasClosest";
import {matchHotKey} from "../util/hotKey";
import {getEditorRange, getSelectPosition} from "../util/selection";
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
        && !isCtrl(event) && event.key !== "Escape") {
        return false;
    }
    const range = getEditorRange(vditor.sv.element);
    const startContainer = range.startContainer;
    const codeBlockElement = hasClosestByAttribute(startContainer, "data-type", "code-block");
    // blockquote
    const blockquoteLineElement = hasClosestByAttribute(startContainer, "data-type", "blockquote-line");
    if (blockquoteLineElement && !codeBlockElement) {
        const startIndex = getSelectPosition(blockquoteLineElement, vditor.sv.element, range).start;
        if (event.key === "Enter" && !isCtrl(event) && !event.altKey && startIndex !== 0) {
            const markerText = Array(blockquoteLineElement.querySelectorAll('[data-type="blockquote-marker"]').length)
                .fill(">").join(" ") + " ";
            if (startIndex === markerText.length && markerText.length > 1) {
                // 在 marker 中换行，删除 marker 标记
                blockquoteLineElement.firstElementChild.remove();
                event.preventDefault();
                processAfterRender(vditor);
                return true;
            } else if (blockquoteLineElement.textContent.trim() !== "") {
                // 换行应延续 >
                let newMarker = "\n" + markerText;
                const liMarkerElement = blockquoteLineElement.querySelector('[data-type="li-marker"]');
                if (liMarkerElement) {
                    newMarker += liMarkerElement.parentElement.getAttribute("data-space") + liMarkerElement.textContent;
                    if (blockquoteLineElement.querySelector('[data-type="task-marker"]')) {
                        newMarker += "[ ] ";
                    }
                }
                range.insertNode(document.createTextNode(newMarker));
                range.collapse(false);
                inputEvent(vditor);
                event.preventDefault();
                return true;
            }
        }
        // 光标在每一行的第一个字符后删除
        if (event.key === "Backspace" && !isCtrl(event) && !event.altKey && !event.shiftKey && startIndex === 1) {
            range.setStart(startContainer, 0);
            range.extractContents();
            if (blockquoteLineElement.firstElementChild.textContent === "") {
                blockquoteLineElement.firstElementChild.remove();
            }
            processAfterRender(vditor);
            event.preventDefault();
            return true;
        }
    }

    // list item
    const listElement = hasClosestByAttribute(startContainer, "data-type", "li");
    if (listElement && !codeBlockElement) {
        const startIndex = getSelectPosition(listElement, vditor.sv.element, range).start;
        const markerElement = listElement.querySelector('[data-type="li-marker"]');
        const taskMarkerElements = listElement.querySelectorAll('[data-type="task-marker"]');
        const paddingElement = listElement.querySelector('[data-type="padding"]');
        const paddingText = paddingElement ? paddingElement.textContent : "";
        // 回车
        if (event.key === "Enter" && !isCtrl(event) && !event.altKey && !event.shiftKey && startIndex !== 0) {
            // enter
            if (markerElement && startIndex ===
                markerElement.textContent.length + paddingText.length + (taskMarkerElements.length > 0 ? 4 : 0)) {
                let addUndoStack = true;
                const parentLiElement = hasClosestByAttribute(listElement.parentElement, "data-type", "li");
                // 清空列表标记符
                if (parentLiElement) {
                    paddingElement.textContent = paddingText.substr(0, paddingText.length -
                        parentLiElement.querySelector('[data-type="li-marker"]').textContent.length);
                    inputEvent(vditor);
                    addUndoStack = false;
                } else {
                    markerElement.remove();
                }
                if (taskMarkerElements.length > 0) {
                    listElement.querySelectorAll('[data-type="task-marker"]').forEach((item: HTMLElement) => {
                        item.remove();
                    });
                }
                if (addUndoStack) {
                    processAfterRender(vditor);
                }
            } else {
                // 添加标记符号
                let newMarker = "\n" + paddingText;
                if (markerElement) {
                    newMarker += markerElement.textContent;
                }
                if (taskMarkerElements.length > 0) {
                    newMarker += "[ ] ";
                }
                range.insertNode(document.createTextNode(newMarker));
                range.collapse(false);
                inputEvent(vditor);
            }
            event.preventDefault();
            return true;
        }
        // 光标在每一行的第一个字符后删除
        if (event.key === "Backspace" && !isCtrl(event) && !event.altKey && !event.shiftKey && startIndex === 1) {
            range.setStart(startContainer, 0);
            range.extractContents();
            // 不能使用 inputEvent，否则子列表会合并为松散列表
            processAfterRender(vditor);
            event.preventDefault();
            return true;
        }
        // 第一个 marker 后 tab 进行缩进
        if (event.key === "Tab" && markerElement && startIndex === markerElement.textContent.length + paddingText.length
            + (taskMarkerElements.length > 0 ? taskMarkerElements[1].textContent.length + 3 : 0)) {
            if (/^\d/.test(markerElement.textContent)) {
                markerElement.textContent = "1. ";
                range.selectNodeContents(markerElement.firstChild);
                range.collapse(false);
            }
            markerElement.insertAdjacentHTML("beforebegin",
                `<span data-type="padding">${markerElement.textContent.replace(/\S/g, " ")}</span>`);
            inputEvent(vditor);
            event.preventDefault();
            return true;
        }
        // toggle checked
        if (taskMarkerElements.length > 0 && matchHotKey("⌘-⇧-J", event)) {
            if (taskMarkerElements[1].textContent === " ") {
                taskMarkerElements[1].textContent = "x";
            } else {
                taskMarkerElements[1].textContent = " ";
            }
            processAfterRender(vditor);
            event.preventDefault();
            return true;
        }
    }

    // tab
    if (fixTab(vditor, range, event)) {
        return true;
    }

    const blockElement = hasClosestByAttribute(startContainer, "data-block", "0");
    // 回车。list，blockquote marker 延续和清除
    if (event.key === "Enter" && !isCtrl(event) && !event.altKey && blockElement) {
        let isFirst = false;
        if (getSelectPosition(blockElement, vditor.sv.element).start === 0) {
            // 允许段落开始换行
            isFirst = true;
        }
        let newLineText = "\n";
        if (blockElement.getAttribute("data-type") === "code-block") {
            newLineText += blockElement.querySelector('[data-type="padding"]')?.textContent || "";
        }
        range.insertNode(document.createTextNode(newLineText));
        range.collapse(false);
        if ((!blockElement || blockElement?.textContent.trim() !== "") && !isFirst) {
            inputEvent(vditor);
        } else {
            processAfterRender(vditor);
        }
        event.preventDefault();
        return true;
    }

    // 删除后光标前有 newline 的处理
    if (event.key === "Backspace" && !isCtrl(event) && !event.altKey && !event.shiftKey) {
        let deleteElement = hasTopClosestByAttribute(startContainer, "data-block", "0");
        if (deleteElement) {
            const startIndex = getSelectPosition(deleteElement, vditor.sv.element, range).start;
            // 光标在每一块的开始位置
            if (startIndex === 0 && deleteElement.previousElementSibling &&
                deleteElement.previousElementSibling.lastElementChild.getAttribute("data-type") === "newline") {
                deleteElement.previousElementSibling.lastElementChild.remove();
                range.extractContents();
                inputEvent(vditor);
                event.preventDefault();
                return true;
            }
        }
        // 光标在每一行的第一个字符后, blockquote， list 处理在上方
        deleteElement = hasClosestByAttribute(startContainer, "data-type", "text");
        if (deleteElement) {
            const startIndex = getSelectPosition(deleteElement, vditor.sv.element, range).start;
            if (startIndex === 1) {
                range.setStart(startContainer, 0);
                range.extractContents();
                inputEvent(vditor);
                event.preventDefault();
                return true;
            }
        }
    }
    return false;
};
