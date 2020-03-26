import {isCtrl} from "./compatibility";
import {hasClosestByMatchTag} from "./hasClosest";
import {execAfterRender} from "./processMD";
import {getSelectPosition, setRangeByWbr} from "./selection";

export const processList = (range: Range, vditor: IVditor, pElement: HTMLElement, event: KeyboardEvent) => {
    const startContainer = range.startContainer;
    const liElement = hasClosestByMatchTag(startContainer, "LI");
    if (liElement) {
        if (!isCtrl(event) && !event.altKey && event.key === "Enter" &&
            (event.shiftKey // 软换行
                // fix li 中有多个 P 时，在第一个 P 中换行会在下方生成新的 li
                || (!event.shiftKey && pElement && liElement.contains(pElement) && pElement.nextElementSibling))) {
            if (liElement && !liElement.textContent.endsWith("\n")) {
                // li 结尾需 \n
                liElement.insertAdjacentText("beforeend", "\n");
            }
            range.insertNode(document.createTextNode("\n"));
            range.collapse(false);
            execAfterRender(vditor);
            event.preventDefault();
            return true;
        }

        if (!isCtrl(event) && !event.shiftKey && !event.altKey && event.key === "Backspace" &&
            !liElement.previousElementSibling && range.toString() === "" &&
            getSelectPosition(liElement, range).start === 0) {
            // 光标位于点和第一个字符中间时，无法删除 li 元素
            if (liElement.nextElementSibling) {
                liElement.parentElement.insertAdjacentHTML("beforebegin",
                    `<p data-block="0"><wbr>${liElement.innerHTML}</p>`);
                liElement.remove();
            } else {
                liElement.parentElement.outerHTML = `<p data-block="0"><wbr>${liElement.innerHTML}</p>`;
            }
            setRangeByWbr(vditor[vditor.currentMode].element, range);
            execAfterRender(vditor);
            event.preventDefault();
            return true;
        }

        if (!isCtrl(event) && !event.altKey && event.key === "Tab") {
            // 光标位于第一/零字符时，tab 用于列表的缩进
            let isFirst = false;
            if (range.startOffset === 0
                && ((startContainer.nodeType === 3 && !startContainer.previousSibling)
                    || (startContainer.nodeType !== 3 && startContainer.nodeName === "LI"))) {
                // 有序/无序列表
                isFirst = true;
            } else if (liElement.classList.contains("vditor-task") && range.startOffset === 1
                && startContainer.previousSibling.nodeType !== 3
                && (startContainer.previousSibling as HTMLElement).tagName === "INPUT") {
                // 任务列表
                isFirst = true;
            }

            // TODO
            if (isFirst) {
                if (event.shiftKey) {
                    vditor.wysiwyg.popover.querySelector('button[data-type="outdent"]').dispatchEvent(new CustomEvent("click"));
                } else {
                    vditor.wysiwyg.popover.querySelector('button[data-type="indent"]').dispatchEvent(new CustomEvent("click"));
                }
                event.preventDefault();
                return true;
            }
        }
    }
    return false;
};
