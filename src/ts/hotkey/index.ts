import {getSelectText} from "../editor/getSelectText";
import {code160to32, quickInsertText} from "../editor/insertText";

export class Hotkey {
    public hintElement: HTMLElement;
    public vditor: IVditor;

    constructor(vditor: IVditor) {
        this.hintElement = vditor.hint && vditor.hint.element;
        this.vditor = vditor;
        this.bindHotkey();
    }

    private processKeymap(hotkey: string, event: KeyboardEvent, action: () => void) {
        const hotkeys = hotkey.split("-");
        const hasShift = hotkeys.length === 3 && (hotkeys[1] === "shift" || hotkeys[1] === "⇧");
        const key = hasShift ? hotkeys[2] : hotkeys[1];
        if ((hotkeys[0] === "ctrl" || hotkeys[0] === "⌘") && (event.metaKey || event.ctrlKey)
            && event.key.toLowerCase() === key.toLowerCase()) {
            if ((!hasShift && !event.shiftKey) || (hasShift && event.shiftKey)) {
                action();
                event.preventDefault();
                event.stopPropagation();
            }
        }
    }

    private bindHotkey(): void {
        this.vditor.editor.element.addEventListener("keydown", (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && this.vditor.options.ctrlEnter &&
                event.key.toLowerCase() === "enter") {
                this.vditor.options.ctrlEnter(code160to32(this.vditor.editor.element.innerText));
            }

            if (this.vditor.options.esc) {
                if (event.key.toLowerCase() === "Escape".toLowerCase()) {
                    this.vditor.options.esc(code160to32(this.vditor.editor.element.innerText));
                }
            }

            if (this.vditor.options.hint.at || this.vditor.toolbar.elements.emoji) {
                this.hint(event);
            }

            // editor actions
            if (this.vditor.options.keymap.deleteLine) {
                this.processKeymap(this.vditor.options.keymap.deleteLine, event, () => {
                    const range = window.getSelection().getRangeAt(0);
                    if (range.startContainer.nodeType === 3) {
                        range.setStartBefore(range.startContainer);
                    } else {
                        range.setStartBefore(range.startContainer.childNodes[range.startOffset]);
                    }
                    if (range.endContainer.nodeType === 3 && range.endContainer.nextSibling) {
                        range.setEndAfter(range.endContainer.nextSibling);
                    } else if (range.endOffset <= range.endContainer.childNodes.length - 1) {
                        range.setEndAfter(range.endContainer.childNodes[range.endOffset]);
                    }

                    // last line
                    let isLastLine = true;
                    let endOffset = range.endOffset;
                    while (range.endContainer.childNodes[endOffset] && isLastLine) {
                        if (range.endContainer.childNodes[endOffset].nodeType === 3 &&
                            range.endContainer.childNodes[endOffset].textContent !== "") {
                            isLastLine = false;
                        }
                        if (range.endContainer.childNodes[endOffset].nodeName === "BR") {
                            isLastLine = false;
                        }
                        endOffset++;
                    }

                    if (isLastLine) {
                        let startOffset = range.startOffset - 1;
                        while (startOffset > 0 && range.startContainer.childNodes[startOffset].nodeType === 3 &&
                        range.startContainer.childNodes[startOffset].textContent === "") {
                            startOffset--;
                        }
                        if (startOffset >= 0) {
                            range.setStart(range.startContainer, startOffset);
                        }
                    }

                    quickInsertText("");
                });
            }
            if (this.vditor.options.keymap.duplicate) {
                this.processKeymap(this.vditor.options.keymap.duplicate, event, () => {
                    const range = window.getSelection().getRangeAt(0);
                    let selectText = "";
                    if (range.collapsed) {
                        range.setStart(range.startContainer, 0);
                        range.setEnd(range.endContainer, range.endContainer.textContent.length);
                        selectText = "\n" + getSelectText(range, this.vditor.editor.element);
                    } else {
                        selectText = getSelectText(range, this.vditor.editor.element);
                    }
                    range.setStart(range.endContainer, range.endOffset);
                    quickInsertText(selectText);
                });
            }

            // toolbar action
            this.vditor.options.toolbar.forEach((menuItem: IMenuItem) => {
                if (!menuItem.hotkey) {
                    return;
                }
                this.processKeymap(menuItem.hotkey, event, () => {
                    (this.vditor.toolbar.elements[menuItem.name].children[0] as HTMLElement).click();
                });
            });

            if (this.vditor.options.tab && event.key.toLowerCase() === "tab") {
                const selectionValue = getSelectText(window.getSelection().getRangeAt(0), this.vditor.editor.element);
                const selectionResult = selectionValue.split("\n").map((value) => {
                    return this.vditor.options.tab + value;
                });

                quickInsertText(selectionResult.join("\n"));

                event.preventDefault();
                event.stopPropagation();
            }
        });
    }

    private hint(event: KeyboardEvent) {
        if (this.hintElement.querySelectorAll("li").length === 0 ||
            this.hintElement.style.display === "none") {
            return;
        }

        const currentHintElement: HTMLElement = this.hintElement.querySelector(".vditor-hint--current");

        if (event.key.toLowerCase() === "arrowdown") {
            event.preventDefault();
            event.stopPropagation();
            if (!currentHintElement.nextElementSibling) {
                this.hintElement.children[0].className = "vditor-hint--current";
            } else {
                currentHintElement.nextElementSibling.className = "vditor-hint--current";
            }
            currentHintElement.removeAttribute("class");
        } else if (event.key.toLowerCase() === "arrowup") {
            event.preventDefault();
            event.stopPropagation();
            if (!currentHintElement.previousElementSibling) {
                const length = this.hintElement.children.length;
                this.hintElement.children[length - 1].className = "vditor-hint--current";
            } else {
                currentHintElement.previousElementSibling.className = "vditor-hint--current";
            }
            currentHintElement.removeAttribute("class");
        } else if (event.key.toLowerCase() === "enter") {
            event.preventDefault();
            event.stopPropagation();
            this.vditor.hint.fillEmoji(currentHintElement);
        }
    }
}
