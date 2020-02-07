import {Constants} from "../constants";
import {setSelectionFocus} from "../editor/setSelection";
import {i18n} from "../i18n";
import {setCurrentToolbar} from "../toolbar/setCurrentToolbar";
import {hasClosestByAttribute, hasClosestByMatchTag} from "../util/hasClosest";
import {afterRenderEvent} from "./afterRenderEvent";
import {genAPopover, highlightToolbar} from "./highlightToolbar";
import {processCodeRender} from "./processCodeRender";
import {setRangeByWbr} from "./setRangeByWbr";

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

const getBES = (node: INode, commandName: string) => {
    const list = [];
    let element = node.parentElement;
    let jump = false
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
            if (!(commandName === "bold" && tagName === "STRONG") &&
                !(commandName === "italic" && tagName === "EM") &&
                !(commandName === "strikeThrough" && tagName === "S")) {
                list.push(tagName);
            }
            if (element.nextSibling) {
                jump = true
            } else {
                element = element.parentElement;
            }
        } else {
            jump = true;
        }
    }
    return {
        element,
        list,
    };
};

export const toolbarEvent = (vditor: IVditor, actionBtn: Element) => {
    let useHighlight = true;
    let useRender = true;
    if (actionBtn.classList.contains("vditor-menu--disabled")) {
        return;
    }
    if (vditor.wysiwyg.element.querySelector("wbr")) {
        vditor.wysiwyg.element.querySelector("wbr").remove();
    }
    if (getSelection().rangeCount === 0) {
        vditor.wysiwyg.element.focus();
    }
    const range = getSelection().getRangeAt(0);
    if (!vditor.wysiwyg.element.contains(range.startContainer)) {
        // 光标位于编辑器之外
        vditor.wysiwyg.element.focus();
    }

    let commandName = actionBtn.getAttribute("data-type");

    // 移除
    if (actionBtn.classList.contains("vditor-menu--current")) {
        if (commandName === "bold" || commandName === "italic" || commandName === "strike") {
            useHighlight = false;
            actionBtn.classList.remove("vditor-menu--current");
        }
        if (commandName === "strike") {
            commandName = "strikeThrough";
        }

        if (commandName === "quote") {
            const quoteElement = hasClosestByMatchTag(range.startContainer, "BLOCKQUOTE");
            if (quoteElement) {
                const tempElement = document.createElement("div");
                tempElement.innerHTML = quoteElement.innerHTML;
                quoteElement.parentNode.replaceChild(tempElement, quoteElement);
            }
            vditor.wysiwyg.element.focus();
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
            if (range.toString() === "") {
                const ebs = getBES(range.startContainer as INode, commandName);
                const emptyElement = document.createElement("span");
                ebs.list.forEach((tagName, index) => {
                    const node = document.createElement(tagName);
                    if (index === ebs.list.length - 1) {
                        node.textContent = Constants.ZWSP;
                        if (ebs.list.length === 1) {
                            emptyElement.append(node);
                        } else {
                            emptyElement.firstElementChild.append(node);
                        }
                    } else {
                        emptyElement.append(node);
                    }
                });
                if (ebs.list.length > 0) {
                    ebs.element.insertAdjacentElement("afterend", emptyElement.firstElementChild)
                    if (ebs.list.length === 1) {
                        range.setStart(ebs.element.nextElementSibling.firstChild, 1);
                    } else {
                        range.setStart(ebs.element.nextElementSibling.firstElementChild.firstChild, 1);
                    }
                } else {
                    emptyElement.textContent = Constants.ZWSP;
                    ebs.element.insertAdjacentElement("afterend", emptyElement)
                    range.setStart(ebs.element.nextElementSibling.firstChild, 1);
                }

                range.collapse(true);
                setSelectionFocus(range);
            } else {
                document.execCommand(commandName, false, "");
            }
        }
    } else {
        // 添加
        if (commandName === "bold" || commandName === "italic" || commandName === "strike") {
            useHighlight = false;
            actionBtn.classList.add("vditor-menu--current");
        }

        if (commandName === "line") {
            commandName = "insertHorizontalRule";
        } else if (commandName === "strike") {
            commandName = "strikeThrough";
        }

        if (commandName === "quote") {
            document.execCommand("formatBlock", false, "BLOCKQUOTE");
            getSelection().getRangeAt(0).startContainer.parentElement.setAttribute("data-block", "0");
        } else if (commandName === "check" || commandName === "list" || commandName === "ordered-list") {
            listToggle(vditor, range, commandName, false);
            useHighlight = false;
            actionBtn.classList.add("vditor-menu--current");
        } else if (commandName === "inline-code") {
            if (range.collapsed) {
                const node = document.createTextNode("``");
                range.insertNode(node);
                range.setStart(node, 1);
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
            if (range.collapsed) {
                node.className = "vditor-wysiwyg__block";
                node.setAttribute("data-type", "code-block");
                node.innerHTML = `<pre data-block="0"><code></code></pre>`;
                range.insertNode(node);
                range.selectNodeContents(node.firstChild.firstChild);
                setSelectionFocus(range);
            } else {
                node.className = "vditor-wysiwyg__block";
                node.setAttribute("data-type", "code-block");
                node.innerHTML = `<pre data-block="0"><code>${range.toString()}</code></pre>`;
                range.deleteContents();
                range.insertNode(node);
                range.selectNodeContents(node.firstChild.firstChild);
                setSelectionFocus(range);
            }
            processCodeRender(node, vditor);
            (node.querySelector(".vditor-wysiwyg__preview") as HTMLElement).click();
        } else if (commandName === "link") {
            if (range.toString() === "") {
                const aElement = document.createElement("a");
                aElement.innerText = Constants.ZWSP;
                range.insertNode(aElement)
                range.setStart(aElement.firstChild, 1)
                range.collapse(true);
                genAPopover(vditor, aElement);
                const textInputElement = vditor.wysiwyg.popover.querySelector('input')
                textInputElement.value = ""
                textInputElement.focus()
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
                "<table data-block=\"0\"><thead><tr><th>col1</th><th>col2</th><th>col3</th></tr></thead>"
                + "<tbody><tr><td></td><td></td><td>"
                + "</td></tr><tr><td></td><td></td><td></td></tr></tbody></table>");
        } else {
            // bold, italic, strike, line
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
                range.setStart(node, 1);
                range.collapse(true)
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
