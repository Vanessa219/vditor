import {processAfterRender} from "../ir/process";
import {afterRenderEvent} from "../wysiwyg/afterRenderEvent";
import {isCtrl} from "./compatibility";
import {scrollCenter} from "./editorCommenEvent";
import {getLastNode} from "./hasClosest";
import {getSelectPosition, setRangeByWbr} from "./selection";

export const isHrMD = (text: string) => {
    // - _ *
    const marker = text.trimRight().split("\n").pop();
    if (marker === "") {
        return false;
    }
    if (marker.replace(/ |-/g, "") === ""
        || marker.replace(/ |_/g, "") === ""
        || marker.replace(/ |\*/g, "") === "") {
        if (marker.replace(/ /g, "").length > 2) {
            if (marker.indexOf("-") > -1 && marker.trimLeft().indexOf(" ") === -1
                && text.trimRight().split("\n").length > 1) {
                // 满足 heading
                return false;
            }
            if (marker.indexOf("    ") === 0 || marker.indexOf("\t") === 0) {
                // 代码块
                return false;
            }
            return true;
        }
        return false;
    }
    return false;
};

export const isHeadingMD = (text: string) => {
    // - =
    const textArray = text.trimRight().split("\n");
    text = textArray.pop();

    if (text.indexOf("    ") === 0 || text.indexOf("\t") === 0) {
        return false;
    }

    text = text.trimLeft();
    if (text === "" || textArray.length === 0) {
        return false;
    }
    if (text.replace(/-/g, "") === ""
        || text.replace(/=/g, "") === "") {
        return true;
    }
    return false;
};

export const isToC = (text: string) => {
    return text.trim().toLowerCase() === "[toc]";
};

export const renderToc = (editorElement: HTMLPreElement) => {
    const tocElement = editorElement.querySelector('[data-type="toc-block"]');
    if (!tocElement) {
        return;
    }
    let tocHTML = "";
    Array.from(editorElement.children).forEach((item: HTMLElement) => {
        if (item.tagName.indexOf("H") === 0 && item.tagName.length === 2 && item.textContent.trim() !== "") {
            const space = new Array((parseInt(item.tagName.substring(1), 10) - 1) * 2).fill("&emsp;").join("");
            tocHTML += `${space}<span data-type="toc-h">${item.textContent.trim()}</span><br>`;
        }
    });
    tocElement.innerHTML = tocHTML || "[ToC]";
};

export const mdKeydown = (event: KeyboardEvent, vditor: IVditor, pElement: HTMLElement, range: Range) => {
    if (!isCtrl(event) && !event.altKey && event.key === "Enter") {
        const pText = String.raw`${pElement.textContent}`.replace(/\\\|/g, "").trim();
        const pTextList = pText.split("|");
        if (pText.startsWith("|") && pText.endsWith("|") && pTextList.length > 3) {
            // table 自动完成
            let tableHeaderMD = pTextList.map(() => "---").join("|");
            tableHeaderMD =
                pElement.textContent + tableHeaderMD.substring(3, tableHeaderMD.length - 3) + "\n|<wbr>";
            pElement.outerHTML = vditor.lute.SpinVditorDOM(tableHeaderMD);
            setRangeByWbr(vditor[vditor.currentMode].element, range);
            execAfterRender(vditor);
            scrollCenter(vditor[vditor.currentMode].element);
            event.preventDefault();
            return true;
        }

        // hr 渲染
        if (isHrMD(pElement.innerHTML)) {
            // 软换行后 hr 前有内容
            let pInnerHTML = "";
            const innerHTMLList = pElement.innerHTML.trimRight().split("\n");
            if (innerHTMLList.length > 1) {
                innerHTMLList.pop();
                pInnerHTML = `<p data-block="0">${innerHTMLList.join("\n")}</p>`;
            }

            pElement.insertAdjacentHTML("afterend",
                `${pInnerHTML}<hr data-block="0"><p data-block="0">\n<wbr></p>`);
            pElement.remove();
            setRangeByWbr(vditor[vditor.currentMode].element, range);
            execAfterRender(vditor);
            scrollCenter(vditor[vditor.currentMode].element);
            event.preventDefault();
            return true;
        }

        if (isHeadingMD(pElement.innerHTML)) {
            // heading 渲染
            pElement.outerHTML = vditor.lute.SpinVditorDOM(pElement.innerHTML + '<p data-block="0">\n<wbr></p>');
            setRangeByWbr(vditor[vditor.currentMode].element, range);
            execAfterRender(vditor);
            scrollCenter(vditor[vditor.currentMode].element);
            event.preventDefault();
            return true;
        }
    }

    // 软换行会被切割 https://github.com/Vanessa219/vditor/issues/220
    if (pElement.previousElementSibling && event.key === "Backspace" && !isCtrl(event) && !event.altKey &&
        !event.shiftKey && pElement.textContent.trimRight().split("\n").length > 1 &&
        getSelectPosition(pElement, range).start === 0) {
        const lastElement = getLastNode(pElement.previousElementSibling) as HTMLElement;
        if (!lastElement.textContent.endsWith("\n")) {
            lastElement.textContent = lastElement.textContent + "\n";
        }
        lastElement.parentElement.insertAdjacentHTML("beforeend", `<wbr>${pElement.innerHTML}`);
        pElement.remove();
        setRangeByWbr(vditor[vditor.currentMode].element, range);
        return false;
    }
    return false;
};

// tab 处理: block code render, table, 列表第一个字符中的 tab 处理单独写在上面
export const processTab = (vditor: IVditor, range: Range, event: KeyboardEvent) => {
    if (vditor.options.tab && event.key === "Tab") {
        if (event.shiftKey) {
            // TODO shift+tab
        } else {
            if (range.toString() === "") {
                range.insertNode(document.createTextNode(vditor.options.tab));
                range.collapse(false);
            } else {
                range.extractContents();
                range.insertNode(document.createTextNode(vditor.options.tab));
                range.collapse(false);
            }
        }
        execAfterRender(vditor);
        event.preventDefault();
        return true;
    }
};

export const execAfterRender = (vditor: IVditor) => {
    if (vditor.currentMode === "wysiwyg") {
        afterRenderEvent(vditor);
    } else if (vditor.currentMode === "ir") {
        processAfterRender(vditor);
    }
};
