import {formatRender} from "../editor/formatRender";
import {getSelectPosition} from "../editor/getSelectPosition";
import {getSelectText} from "../editor/getSelectText";
import {getText} from "../editor/getText";
import {insertText} from "../editor/insertText";
import {setSelectionByPosition} from "../editor/setSelection";
import {getCurrentLinePosition} from "../util/getCurrentLinePosition";

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
        this.vditor.editor.element.addEventListener("keypress", (event: KeyboardEvent) => {
            if (!event.metaKey && !event.ctrlKey && event.key.toLowerCase() === "enter") {
                insertText(this.vditor, "\n", "", true);
                this.vditor.editor.element.scrollTop = this.vditor.editor.element.scrollHeight
                event.preventDefault();
            }
        });

        this.vditor.editor.element.addEventListener("keydown", (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && this.vditor.options.ctrlEnter &&
                event.key.toLowerCase() === "enter") {
                this.vditor.options.ctrlEnter(getText(this.vditor.editor.element));
                return;
            }

            if (event.key === "Escape") {
                if (this.vditor.options.esc) {
                    this.vditor.options.esc(getText(this.vditor.editor.element));
                }
                if (this.hintElement && this.hintElement.style.display === "block") {
                    this.hintElement.style.display = "none";
                }
                return;
            }

            if (this.vditor.options.tab && event.key.toLowerCase() === "tab") {
                const selectionValue = getSelectText(this.vditor.editor.element);
                const selectionResult = selectionValue.split("\n").map((value) => {
                    return this.vditor.options.tab + value;
                }).join("\n");
                const position = getSelectPosition(this.vditor.editor.element);
                insertText(this.vditor, selectionResult, "", true);
                setSelectionByPosition(position.start,
                    position.start + selectionResult.length, this.vditor.editor.element);
                event.preventDefault();
                event.stopPropagation();
                return;
            }

            if (!event.metaKey && !event.ctrlKey && !event.shiftKey && event.keyCode === 8) {
                const position = getSelectPosition(this.vditor.editor.element);
                if (position.start !== position.end) {
                    insertText(this.vditor, "", "", true);
                } else {
                    const text = getText(this.vditor.editor.element);
                    const emojiMatch = text.substring(0, position.start).match(/([\u{1F300}-\u{1F5FF}]|[\u{1F100}-\u{1F1FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F200}-\u{1F2FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F000}-\u{1F02F}]|[\u{FE00}-\u{FE0F}]|[\u{1F0A0}-\u{1F0FF}]|[\u{0000}-\u{007F}][\u{20D0}-\u{20FF}]|[\u{0000}-\u{007F}][\u{FE00}-\u{FE0F}][\u{20D0}-\u{20FF}])$/u);
                    const deleteChar = emojiMatch ? emojiMatch[0].length : 1;
                    formatRender(this.vditor,
                        text.substring(0, position.start - deleteChar) + text.substring(position.start),
                        {
                            end: position.start - deleteChar,
                            start: position.start - deleteChar,
                        });
                }
                event.preventDefault();
                event.stopPropagation();
                return;
            }

            // editor actions
            if (this.vditor.options.keymap.deleteLine) {
                this.processKeymap(this.vditor.options.keymap.deleteLine, event, () => {
                    const position = getSelectPosition(this.vditor.editor.element);
                    const text = getText(this.vditor.editor.element);
                    const linePosition = getCurrentLinePosition(position, text);
                    const deletedText = text.substring(0, linePosition.start) + text.substring(linePosition.end);
                    const startIndex = Math.min(deletedText.length, position.start);
                    formatRender(this.vditor, deletedText, {
                        end: startIndex,
                        start: startIndex,
                    });
                });
            }

            if (this.vditor.options.keymap.duplicate) {
                this.processKeymap(this.vditor.options.keymap.duplicate, event, () => {
                    const position = getSelectPosition(this.vditor.editor.element);
                    const text = getText(this.vditor.editor.element);
                    let lineText = text.substring(position.start, position.end);
                    if (position.start === position.end) {
                        const linePosition = getCurrentLinePosition(position, text);
                        lineText = text.substring(linePosition.start, linePosition.end);
                        formatRender(this.vditor,
                            text.substring(0, linePosition.end) + lineText + text.substring(linePosition.end),
                            {
                                end: position.end + lineText.length,
                                start: position.start + lineText.length,
                            });
                    } else {
                        formatRender(this.vditor,
                            text.substring(0, position.end) + lineText + text.substring(position.end),
                            {
                                end: position.end + lineText.length,
                                start: position.start + lineText.length,
                            });
                    }
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
            if (!this.vditor.toolbar.elements.undo && (event.metaKey || event.ctrlKey) && event.key === "z") {
                this.vditor.undo.undo(this.vditor);
                event.preventDefault();
            }
            if (!this.vditor.toolbar.elements.redo && (event.metaKey || event.ctrlKey) && event.key === "y") {
                this.vditor.undo.redo(this.vditor);
                event.preventDefault();
            }

            // hint: 上下选择
            if (this.vditor.options.hint.at || this.vditor.toolbar.elements.emoji) {
                this.hint(event);
            }
        });
    }

    private hint(event: KeyboardEvent) {
        if (!this.hintElement) {
            return;
        }

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
