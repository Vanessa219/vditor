import {Constants} from "../constants";
import {setCurrentToolbar} from "../toolbar/setToolbar";
import {hasClosestBlock, hasClosestByAttribute, hasClosestByMatchTag} from "../util/hasClosest";
import {getEditorRange, setRangeByWbr, setSelectionFocus} from "../util/selection";
import {afterRenderEvent} from "./afterRenderEvent";
import {genAPopover, highlightToolbar} from "./highlightToolbar";
import {getNextHTML, getPreviousHTML, splitElement} from "./inlineTag";
import {processCodeRender} from "./processCodeRender";

const listToggle = (vditor: IVditor, range: Range, type: string, cancel = true) => {
    const itemElement = hasClosestByMatchTag(range.startContainer, "LI");
    vditor.wysiwyg.element.querySelectorAll("wbr").forEach((wbr) => {
        wbr.remove();
    });
    range.insertNode(document.createElement("wbr"));

    if (cancel && itemElement) {
        // 取消
        list2p(itemElement.parentElement);
    } else {
        if (!itemElement) {
            // 添加
            let blockElement = hasClosestByAttribute(range.startContainer, "data-block", "0");
            if (!blockElement) {
                vditor.wysiwyg.element.querySelector("wbr").remove();
                blockElement = vditor.wysiwyg.element.querySelector("p");
                blockElement.innerHTML = "<wbr>";
            }
            if (type === "check") {
                blockElement.insertAdjacentHTML("beforebegin",
                    `<ul data-block="0"><li class="vditor-task"><input type="checkbox" /> ${blockElement.innerHTML}</li></ul>`);
                blockElement.remove();
            } else if (type === "list") {
                blockElement.insertAdjacentHTML("beforebegin",
                    `<ul data-block="0"><li>${blockElement.innerHTML}</li></ul>`);
                blockElement.remove();
            } else if (type === "ordered-list") {
                blockElement.insertAdjacentHTML("beforebegin",
                    `<ol data-block="0"><li>${blockElement.innerHTML}</li></ol>`);
                blockElement.remove();
            }
        } else {
            // 切换
            if (type === "check") {
                itemElement.parentElement.querySelectorAll("li").forEach((item) => {
                    item.insertAdjacentHTML("afterbegin", '<input type="checkbox" />');
                    item.classList.add("vditor-task");
                });
            } else {
                if (itemElement.querySelector("input")) {
                    itemElement.parentElement.querySelectorAll("li").forEach((item) => {
                        item.querySelector("input").remove();
                        item.classList.remove("vditor-task");
                    });
                }
                let element;
                if (type === "list") {
                    element = document.createElement("ul");
                } else {
                    element = document.createElement("ol");
                }
                element.innerHTML = itemElement.parentElement.innerHTML;
                itemElement.parentElement.parentNode.replaceChild(element, itemElement.parentElement);
            }
        }
    }
    setRangeByWbr(vditor.wysiwyg.element, range);
};

const list2p = (listElement: HTMLElement) => {
    let pHTML = "";
    for (let i = 0; i < listElement.childElementCount; i++) {
        const inputElement = listElement.children[i].querySelector("input");
        if (inputElement) {
            inputElement.remove();
        }
        pHTML += `<p data-block="0">${listElement.children[i].innerHTML.trimLeft()}</p>`;
    }
    listElement.insertAdjacentHTML("beforebegin", pHTML);
    listElement.remove();
};

const cancelBES = (range: Range, vditor: IVditor, commandName: string) => {
    let element = range.startContainer.parentElement;
    let jump = false;
    let lastTagName = "";
    let lastEndTagName = "";

    const splitHTML = splitElement(range);
    let lastBeforeHTML = splitHTML.beforeHTML;
    let lastAfterHTML = splitHTML.afterHTML;

    while (element && !jump) {
        let tagName = element.tagName;
        if (tagName === "STRIKE") {
            tagName = "S";
        }
        if (tagName === "I") {
            tagName = "EM";
        }
        if (tagName === "B") {
            tagName = "STRONG";
        }
        if (tagName === "S" || tagName === "STRONG" || tagName === "EM") {
            let insertHTML = "";
            let previousHTML = "";
            let nextHTML = "";
            if (element.parentElement.getAttribute("data-block") !== "0") {
                previousHTML = getPreviousHTML(element);
                nextHTML = getNextHTML(element);
            }

            if (lastBeforeHTML || previousHTML) {
                insertHTML = `${previousHTML}<${tagName}>${lastBeforeHTML}</${tagName}>`;
                lastBeforeHTML = insertHTML;
            }
            if ((commandName === "bold" && tagName === "STRONG") ||
                (commandName === "italic" && tagName === "EM") ||
                (commandName === "strikeThrough" && tagName === "S")) {
                // 取消
                insertHTML += `${lastTagName}${Constants.ZWSP}<wbr>${lastEndTagName}`;
                jump = true;
            }

            if (lastAfterHTML || nextHTML) {
                lastAfterHTML = `<${tagName}>${lastAfterHTML}</${tagName}>${nextHTML}`;
                insertHTML += lastAfterHTML;
            }

            if (element.parentElement.getAttribute("data-block") !== "0") {
                element = element.parentElement;
                element.innerHTML = insertHTML;
            } else {
                element.outerHTML = insertHTML;
                element = element.parentElement;
            }

            lastTagName = `<${tagName}>` + lastTagName;
            lastEndTagName = `</${tagName}>` + lastEndTagName;
        } else {
            jump = true;
        }
    }

    setRangeByWbr(vditor.wysiwyg.element, range);
};

export const toolbarEvent = (vditor: IVditor, actionBtn: Element) => {
    if (vditor.wysiwyg.composingLock) {
        // Mac Chrome 中韩文结束会出发此事件，导致重复末尾字符 https://github.com/Vanessa219/vditor/issues/188
        return;
    }

    let useHighlight = true;
    let useRender = true;
    if (actionBtn.classList.contains(Constants.CLASS_MENU_DISABLED)) {
        return;
    }
    if (vditor.wysiwyg.element.querySelector("wbr")) {
        vditor.wysiwyg.element.querySelector("wbr").remove();
    }
    const range = getEditorRange(vditor.wysiwyg.element);
    if (!vditor.wysiwyg.element.contains(range.startContainer)) {
        // 光标位于编辑器之外
        vditor.wysiwyg.element.focus();
    }

    let commandName = actionBtn.getAttribute("data-type");

    // 移除
    if (actionBtn.classList.contains("vditor-menu--current")) {
        if (commandName === "strike") {
            commandName = "strikeThrough";
        }

        if (commandName === "quote") {
            let quoteElement = hasClosestByMatchTag(range.startContainer, "BLOCKQUOTE");
            if (!quoteElement) {
                quoteElement = range.startContainer.childNodes[range.startOffset] as HTMLElement;
            }
            if (quoteElement) {
                useHighlight = false;
                actionBtn.classList.remove("vditor-menu--current");
                range.insertNode(document.createElement("wbr"));
                quoteElement.outerHTML = quoteElement.innerHTML.trim() === "" ?
                    `<p data-block="0">${quoteElement.innerHTML}</p>` : quoteElement.innerHTML;
                setRangeByWbr(vditor.wysiwyg.element, range);
            }
        } else if (commandName === "inline-code") {
            if (!range.collapsed) {
                document.execCommand("removeFormat", false, "");
            } else {
                range.selectNode(range.startContainer.parentElement);
                document.execCommand("removeFormat", false, "");
            }
        } else if (commandName === "link") {
            if (!range.collapsed) {
                document.execCommand("unlink", false, "");
            } else {
                range.selectNode(range.startContainer.parentElement);
                document.execCommand("unlink", false, "");
            }
        } else if (commandName === "check" || commandName === "list" || commandName === "ordered-list") {
            listToggle(vditor, range, commandName);
            useHighlight = false;
            actionBtn.classList.remove("vditor-menu--current");
        } else {
            // bold, italic, strike
            useHighlight = false;
            actionBtn.classList.remove("vditor-menu--current");
            if (range.toString() === "") {
                cancelBES(range, vditor, commandName);
            } else {
                document.execCommand(commandName, false, "");
            }
        }
    } else {
        // 添加
        if (vditor.wysiwyg.element.childNodes.length === 0) {
            vditor.wysiwyg.element.innerHTML = '<p data-block="0"><wbr></p>';
            setRangeByWbr(vditor.wysiwyg.element, range);
        }

        if (commandName === "quote") {
            let blockElement = hasClosestBlock(range.startContainer);
            if (!blockElement) {
                blockElement = range.startContainer.childNodes[range.startOffset] as HTMLElement;
            }

            if (blockElement) {
                useHighlight = false;
                actionBtn.classList.add("vditor-menu--current");
                range.insertNode(document.createElement("wbr"));

                const liElement = hasClosestByMatchTag(range.startContainer, "LI");
                // li 中软换行
                if (liElement && blockElement.contains(liElement)) {
                    liElement.innerHTML = `<blockquote data-block="0">${liElement.innerHTML}</blockquote>`;
                } else {
                    blockElement.outerHTML = `<blockquote data-block="0">${blockElement.outerHTML}</blockquote>`;
                }
                setRangeByWbr(vditor.wysiwyg.element, range);
            }
        } else if (commandName === "check" || commandName === "list" || commandName === "ordered-list") {
            listToggle(vditor, range, commandName, false);
            useHighlight = false;
            actionBtn.classList.add("vditor-menu--current");
        } else if (commandName === "inline-code") {
            if (range.toString() === "") {
                const node = document.createElement("code");
                node.textContent = Constants.ZWSP;
                range.insertNode(node);
                range.setStart(node.firstChild, 1);
                range.collapse(true);
                setSelectionFocus(range);
            } else if (range.startContainer.nodeType === 3) {
                const node = document.createElement("code");
                range.surroundContents(node);
                range.insertNode(node);
                setSelectionFocus(range);
            }
            useHighlight = false;
            setCurrentToolbar(vditor.toolbar.elements, ["inline-code"]);
        } else if (commandName === "code") {
            const node = document.createElement("div");
            node.className = "vditor-wysiwyg__block";
            node.setAttribute("data-type", "code-block");
            node.setAttribute("data-block", "0");
            node.setAttribute("data-marker", "```");
            if (range.toString() === "") {
                node.innerHTML = "<pre><code><wbr>\n</code></pre>";
            } else {
                node.innerHTML = `<pre><code>${range.toString()}<wbr></code></pre>`;
                range.deleteContents();
            }
            range.insertNode(node);
            const blockElement = hasClosestByAttribute(range.startContainer, "data-block", "0");
            if (blockElement) {
                blockElement.outerHTML = vditor.lute.SpinVditorDOM(blockElement.outerHTML);
            }
            setRangeByWbr(vditor.wysiwyg.element, range);
            vditor.wysiwyg.element.querySelectorAll(".vditor-wysiwyg__block").forEach(
                (blockRenderItem: HTMLElement) => {
                    processCodeRender(blockRenderItem, vditor);
                });
        } else if (commandName === "link") {
            if (range.toString() === "") {
                const aElement = document.createElement("a");
                aElement.innerText = Constants.ZWSP;
                range.insertNode(aElement);
                range.setStart(aElement.firstChild, 1);
                range.collapse(true);
                genAPopover(vditor, aElement);
                const textInputElement = vditor.wysiwyg.popover.querySelector("input");
                textInputElement.value = "";
                textInputElement.focus();
                useHighlight = false;
                useRender = false;
            } else {
                const node = document.createElement("a");
                node.setAttribute("href", "");
                node.innerHTML = range.toString();
                range.surroundContents(node);
                range.insertNode(node);
                setSelectionFocus(range);
            }
        } else if (commandName === "table") {
            document.execCommand("insertHTML", false,
                "<table data-block=\"0\"><thead><tr><th>col1<wbr></th><th>col2</th><th>col3</th></tr></thead>"
                + "<tbody><tr><td> </td><td> </td><td> "
                + "</td></tr><tr><td> </td><td> </td><td> </td></tr></tbody></table>");
            range.selectNode(vditor.wysiwyg.element.querySelector("wbr").previousSibling);
            vditor.wysiwyg.element.querySelector("wbr").remove();
            setSelectionFocus(range);
        } else if (commandName === "line") {
            let element = range.startContainer as HTMLElement;
            if (element.nodeType === 3) {
                element = range.startContainer.parentElement;
            }
            element.insertAdjacentHTML("afterend", '<hr data-block="0"><p data-block="0">\n<wbr></p>');
            setRangeByWbr(vditor.wysiwyg.element, range);
        } else {
            // bold, italic, strike
            useHighlight = false;
            actionBtn.classList.add("vditor-menu--current");

            if (commandName === "strike") {
                commandName = "strikeThrough";
            }
            if (range.toString() === "" && (commandName === "bold" || commandName === "italic" || commandName === "strikeThrough")) {
                let tagName = "strong";
                if (commandName === "italic") {
                    tagName = "em";
                } else if (commandName === "strikeThrough") {
                    tagName = "s";
                }
                const node = document.createElement(tagName);
                node.textContent = Constants.ZWSP;

                range.insertNode(node);

                if (node.previousSibling && node.previousSibling.textContent === Constants.ZWSP) {
                    // 移除多层嵌套中的 zwsp
                    node.previousSibling.textContent = "";
                }

                range.setStart(node.firstChild, 1);
                range.collapse(true);
                setSelectionFocus(range);
            } else {
                document.execCommand(commandName, false, "");
            }
        }
    }

    if (useHighlight) {
        highlightToolbar(vditor);
    }

    if (useRender) {
        afterRenderEvent(vditor);
    }
};
