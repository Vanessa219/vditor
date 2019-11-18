import {insertText} from "../editor/insertText";
import {i18n} from "../i18n/index";
import {getEventName} from "../util/getEventName";
import {setSelectionFocus} from "../editor/setSelection";
import {highlightToolbar, showAPopover} from "../wysiwyg/highlightToolbar";

export class MenuItem {
    public element: HTMLElement;
    public menuItem: IMenuItem;

    constructor(vditor: IVditor, menuItem: IMenuItem) {
        this.menuItem = menuItem;
        this.element = document.createElement("div");
        const iconElement = document.createElement("button");
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
                const actionBtn = this.element.children[0];
                if (actionBtn.classList.contains("vditor-menu--disabled")) {
                    return
                }
                let commandName = actionBtn.getAttribute("data-type");
                if (actionBtn.classList.contains("vditor-menu--current")) {
                    if (commandName === "inline-code") {
                        commandName = "removeFormat";
                    } else if (commandName === "link") {
                        commandName = "unlink";
                    } else if (commandName === "strike") {
                        commandName = "strikeThrough"
                    } else if (commandName === "list") {
                        commandName = "insertUnorderedList"
                    } else if (commandName === 'ordered-list') {
                        commandName = "insertOrderedList"
                    }

                    document.execCommand(commandName, false, "");
                    actionBtn.classList.remove("vditor-menu--current");
                } else {
                    if (commandName === "line") {
                        commandName = 'insertHorizontalRule'
                    } else if (commandName === "strike") {
                        commandName = "strikeThrough"
                    } else if (commandName === "list") {
                        commandName = "insertUnorderedList"
                        vditor.toolbar.elements['ordered-list'] &&
                        vditor.toolbar.elements['ordered-list'].children[0].classList.remove("vditor-menu--current");
                    } else if (commandName === 'ordered-list') {
                        commandName = "insertOrderedList"
                        vditor.toolbar.elements['list'] &&
                        vditor.toolbar.elements['list'].children[0].classList.remove("vditor-menu--current");
                    }

                    const range = getSelection().getRangeAt(0)

                    if (commandName === "quote") {
                        if (range.collapsed) {
                            document.execCommand('insertHTML', false, '<blockquote></blockquote>')
                        } else {
                            const node = document.createElement('blockquote')
                            range.surroundContents(node);
                            range.insertNode(node)
                            setSelectionFocus(range);
                        }
                    } else if (commandName === "check") {
                        if (range.collapsed) {
                            document.execCommand('insertHTML', false, '<ul><li class="vditor-task"><input type="checkbox" /> </li></ul>');
                        } else {
                            const node = document.createElement('ul')
                            node.innerHTML = `<li class="vditor-task"><input type="checkbox" /> ${range.toString()}</li>`
                            range.deleteContents();
                            range.insertNode(node)
                            range.selectNodeContents(node)
                            setSelectionFocus(range);
                        }
                    } else if (commandName === 'inline-code') {
                        if (range.collapsed) {
                            const node = document.createTextNode('``')
                            range.insertNode(node)
                            range.setStart(node, 1)
                            range.collapse(true)
                        } else {
                            const node = document.createElement('code')
                            range.surroundContents(node);
                            range.insertNode(node)
                        }
                        setSelectionFocus(range);
                    } else if (commandName === 'code') {
                        if (range.collapsed) {
                            document.execCommand('insertHTML', false, '<pre><code>\n</code></pre>');
                        } else {
                            const node = document.createElement('pre')
                            node.innerHTML = `<code>${range.toString()}</code>`
                            range.deleteContents();
                            range.insertNode(node)
                            range.selectNodeContents(node)
                            setSelectionFocus(range);
                        }
                    } else if (commandName === 'link') {
                        if (range.collapsed) {
                            const textNode = document.createTextNode('[]()')
                            range.insertNode(textNode)
                            range.setStart(textNode, 1)
                            range.collapse(true)
                            setSelectionFocus(range);
                        } else {
                            const node = document.createElement('a')
                            node.innerHTML = range.toString()
                            range.surroundContents(node);
                            range.insertNode(node)
                            showAPopover(node, vditor)
                        }
                    } else if (commandName === 'table') {
                        document.execCommand('insertHTML', false, '<table><thead><tr><th>col1</th><th>col2</th><th>col3</th></tr></thead><tbody><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></tbody></table>');
                    } else {
                        document.execCommand(commandName, false, "");
                    }

                    if (commandName !== 'insertHorizontalRule'
                        && commandName !== 'check' && commandName !== "quote"
                        && commandName !== 'code' && commandName !== 'table') {
                        actionBtn.classList.add("vditor-menu--current");
                    }
                }
            } else {
                insertText(vditor, this.menuItem.prefix || "", this.menuItem.suffix || "",
                    replace, true);
            }
            event.preventDefault();
        });
    }
}
