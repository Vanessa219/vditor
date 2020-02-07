import {setSelectionFocus} from "../editor/setSelection";
import {i18n} from "../i18n";
import {setCurrentToolbar} from "../toolbar/setCurrentToolbar";
import {hasClosestByMatchTag} from "../util/hasClosest";
import {afterRenderEvent} from "./afterRenderEvent";
import {genAPopover, highlightToolbar} from "./highlightToolbar";
import {listToggle} from "./listToggle";
import {processCodeRender} from "./processCodeRender";

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
            // bold, italic
            document.execCommand(commandName, false, "");
        }
        vditor.wysiwyg.element.focus();
    } else {
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
                genAPopover(vditor, aElement);
                const buttonElement = document.createElement("button");
                buttonElement.innerText = i18n[vditor.options.lang].confirm;
                buttonElement.className = "vditor-btn";
                buttonElement.onclick = () => {
                    if (textElement.value === "") {
                        textElement.focus();
                        return;
                    }
                    range.insertNode(aElement);
                    vditor.wysiwyg.popover.style.display = "none";
                };
                const textElement = vditor.wysiwyg.popover.querySelector("input");
                vditor.wysiwyg.popover.insertAdjacentElement("beforeend", buttonElement);
                vditor.wysiwyg.popover.style.top = "40px";
                vditor.wysiwyg.popover.style.left = (vditor.wysiwyg.element.clientWidth - 380) / 2 + "px";
                vditor.wysiwyg.popover.style.display = "block";
                textElement.focus();
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
            document.execCommand(commandName, false, "");
            vditor.wysiwyg.element.focus();
        }
    }

    if (useHighlight) {
        highlightToolbar(vditor);
    }

    if (useRender) {
        afterRenderEvent(vditor);
    }
};
