import {insertText} from "../editor/insertText";
import {setSelectionFocus} from "../editor/setSelection";
import {i18n} from "../i18n/index";
import {getEventName} from "../util/getEventName";
import {hasClosestByMatchTag} from "../util/hasClosest";
import {afterRenderEvent} from "../wysiwyg/afterRenderEvent";
import {highlightToolbar} from "../wysiwyg/highlightToolbar";

export class MenuItem {
    public element: HTMLElement;
    public menuItem: IMenuItem;

    constructor(vditor: IVditor, menuItem: IMenuItem) {
        this.menuItem = menuItem;
        this.element = document.createElement("div");
        const iconElement = document.createElement(menuItem.name === "upload" ? "div" : "button");
        iconElement.setAttribute("data-type", menuItem.name);
        iconElement.className = `vditor-tooltipped vditor-tooltipped__${menuItem.tipPosition}`;

        let hotkey = this.menuItem.hotkey ? ` <${this.menuItem.hotkey}>` : "";
        if (/Mac/.test(navigator.platform)) {
            hotkey = hotkey.replace("ctrl", "⌘");
        } else {
            hotkey = hotkey.replace("⌘", "ctrl");
        }
        iconElement.setAttribute("aria-label",
            this.menuItem.tip ? this.menuItem.tip + hotkey : i18n[vditor.options.lang][this.menuItem.name] + hotkey);
        this.element.appendChild(iconElement);
    }

    public bindEvent(vditor: IVditor, replace: boolean = false) {
        this.element.children[0].addEventListener(getEventName(), (event) => {
            if (vditor.currentMode === "wysiwyg") {
                let useHighlight = true;
                const actionBtn = this.element.children[0];
                if (actionBtn.classList.contains("vditor-menu--disabled")) {
                    return;
                }
                if (vditor.wysiwyg.element.querySelector("wbr")) {
                    vditor.wysiwyg.element.querySelector("wbr").remove();
                }
                const range = getSelection().getRangeAt(0);
                let commandName = actionBtn.getAttribute("data-type");
                if (actionBtn.classList.contains("vditor-menu--current")) {
                    if (commandName === "bold" || commandName === "italic" || commandName === "strike") {
                        useHighlight = false;
                        actionBtn.classList.remove("vditor-menu--current");
                    }
                    if (commandName === "strike") {
                        commandName = "strikeThrough";
                    } else if (commandName === "list" || commandName === "check") {
                        commandName = "insertUnorderedList";
                    } else if (commandName === "ordered-list") {
                        commandName = "insertOrderedList";
                    }
                    if (commandName === "quote") {
                        const quoteElement = hasClosestByMatchTag(range.startContainer.nodeType === 3 ?
                            range.startContainer.parentNode as HTMLElement :
                            range.startContainer as HTMLElement, "BLOCKQUOTE");
                        const tempElement = document.createElement("div");
                        tempElement.innerHTML = quoteElement.innerHTML;
                        quoteElement.parentNode.replaceChild(tempElement, quoteElement);
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
                    } else {
                        // bold, italic, check
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
                    } else if (commandName === "list") {
                        commandName = "insertUnorderedList";
                    } else if (commandName === "ordered-list") {
                        commandName = "insertOrderedList";
                    }

                    if (commandName === "quote") {
                        document.execCommand("formatBlock", false, "BLOCKQUOTE");
                    } else if (commandName === "check") {
                        const liElement = hasClosestByMatchTag(range.startContainer.nodeType === 3 ?
                            range.startContainer.parentNode as HTMLElement : range.startContainer as HTMLElement, "LI");
                        if (liElement) {
                            range.setStartAfter(liElement);
                            range.collapse(true);
                            document.execCommand("insertHTML", false,
                                '<li class="vditor-task"><input type="checkbox" /> </li>');
                        } else {
                            document.execCommand("insertHTML", false,
                                '<ul data-block="0"><li class="vditor-task"><input type="checkbox" /> </li></ul>');
                        }

                    } else if (commandName === "inline-code") {
                        if (range.collapsed) {
                            const node = document.createTextNode("``");
                            range.insertNode(node);
                            range.setStart(node, 1);
                            range.collapse(true);
                        } else {
                            const node = document.createElement("code");
                            range.surroundContents(node);
                            range.insertNode(node);
                        }
                        setSelectionFocus(range);
                    } else if (commandName === "code") {
                        if (range.collapsed) {
                            const node = document.createElement("div");
                            node.className = "vditor-wysiwyg__block";
                            node.setAttribute("data-type", "code-block");
                            node.innerHTML = `<pre data-block="0"><code></code></pre>`;
                            range.insertNode(node);
                            range.selectNodeContents(node.firstChild.firstChild);
                            setSelectionFocus(range);
                        } else {
                            const node = document.createElement("div");
                            node.className = "vditor-wysiwyg__block";
                            node.setAttribute("data-type", "code-block");
                            node.innerHTML = `<pre data-block="0"><code>${range.toString()}</code></pre>`;
                            range.deleteContents();
                            range.insertNode(node);
                            range.selectNodeContents(node.firstChild.firstChild);
                            setSelectionFocus(range);
                        }
                    } else if (commandName === "link") {
                        if (range.collapsed) {
                            const textNode = document.createTextNode("[]()");
                            range.insertNode(textNode);
                            range.setStart(textNode, 1);
                            range.collapse(true);
                        } else {
                            const node = document.createElement("a");
                            node.setAttribute("href", "");
                            node.innerHTML = range.toString();
                            range.surroundContents(node);
                            range.insertNode(node);
                        }
                        setSelectionFocus(range);
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

                afterRenderEvent(vditor);
            } else {
                insertText(vditor, this.menuItem.prefix || "", this.menuItem.suffix || "",
                    replace, true);
            }
            event.preventDefault();
        });
    }
}
