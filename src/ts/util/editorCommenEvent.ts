import {formatRender} from "../editor/formatRender";
import {getSelectPosition} from "../editor/getSelectPosition";
import {getText} from "../editor/getText";
import {insertText} from "../editor/insertText";
import {getCursorPosition} from "../hint/getCursorPosition";
import {getCurrentLinePosition} from "./getCurrentLinePosition";

const getContent = (vditor: IVditor, editorElement: HTMLElement) => {
    if (vditor.currentEditorName === "wysiwyg") {
        return editorElement.textContent;
    } else {
        return getText(editorElement);
    }
};

export const focusEvent = (vditor: IVditor, editorElement: HTMLElement) => {
    editorElement.addEventListener("focus", () => {
        if (vditor.options.focus) {
            vditor.options.focus(getContent(vditor, editorElement));
        }
        if (vditor.toolbar.elements.emoji && vditor.toolbar.elements.emoji.children[1]) {
            const emojiPanel = vditor.toolbar.elements.emoji.children[1] as HTMLElement;
            emojiPanel.style.display = "none";
        }
        if (vditor.toolbar.elements.headings && vditor.toolbar.elements.headings.children[1]) {
            const headingsPanel = vditor.toolbar.elements.headings.children[1] as HTMLElement;
            headingsPanel.style.display = "none";
        }
    });

};

export const copyEvent = (vditor: IVditor, editorElement: HTMLElement) => {
    editorElement.addEventListener("copy", async (event: ClipboardEvent) => {
        event.stopPropagation();
        event.preventDefault();
        event.clipboardData.setData("text/plain", getContent(vditor, editorElement));
    });
};

export const scrollCenter = (editorElement: HTMLElement) => {
    const cursorTop = getCursorPosition(editorElement).top;
    const center = editorElement.clientHeight / 2;
    if (cursorTop > center) {
        editorElement.scrollTop = editorElement.scrollTop + (cursorTop - center);
    }
};

export const hotkeyEvent = (vditor: IVditor, editorElement: HTMLElement) => {
    const processKeymap = (hotkey: string, event: KeyboardEvent, action: () => void) => {
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
    };

    const hint = (event: KeyboardEvent, hintElement: HTMLElement) => {
        if (!hintElement) {
            return;
        }

        if (hintElement.querySelectorAll("li").length === 0 ||
            hintElement.style.display === "none") {
            return;
        }

        const currentHintElement: HTMLElement = hintElement.querySelector(".vditor-hint--current");

        if (event.key === "ArrowDown") {
            event.preventDefault();
            event.stopPropagation();
            if (!currentHintElement.nextElementSibling) {
                hintElement.children[0].className = "vditor-hint--current";
            } else {
                currentHintElement.nextElementSibling.className = "vditor-hint--current";
            }
            currentHintElement.removeAttribute("class");
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            event.stopPropagation();
            if (!currentHintElement.previousElementSibling) {
                const length = hintElement.children.length;
                hintElement.children[length - 1].className = "vditor-hint--current";
            } else {
                currentHintElement.previousElementSibling.className = "vditor-hint--current";
            }
            currentHintElement.removeAttribute("class");
        } else if (event.key === "Enter") {
            event.preventDefault();
            event.stopPropagation();
            vditor.hint.fillEmoji(currentHintElement, vditor.currentEditorName);
        }
    };

    editorElement.addEventListener("keydown", (event: KeyboardEvent) => {
        const hintElement = vditor.hint && vditor.hint.element;

        if ((event.metaKey || event.ctrlKey) && vditor.options.ctrlEnter && event.key === "Enter") {
            vditor.options.ctrlEnter(getContent(vditor, editorElement));
            return;
        }

        if (event.key === "Escape") {
            if (vditor.options.esc) {
                vditor.options.esc(getContent(vditor, editorElement));
            }
            if (hintElement && hintElement.style.display === "block") {
                hintElement.style.display = "none";
            }
            return;
        }

        // if (vditor.options.tab && event.key === "Tab") {
        //     event.preventDefault();
        //     event.stopPropagation();
        //
        //     const position = getSelectPosition(this.vditor.editor.element);
        //     const text = getText(this.vditor.editor.element);
        //     const selectLinePosition = getCurrentLinePosition(position, text);
        //     const selectLineList = text.substring(selectLinePosition.start, selectLinePosition.end - 1).split("\n");
        //
        //     if (event.shiftKey) {
        //         let shiftCount = 0;
        //         let startIsShift = false;
        //         const selectionShiftResult = selectLineList.map((value, index) => {
        //             let shiftLineValue = value;
        //             if (value.indexOf(vditor.options.tab) === 0) {
        //                 if (index === 0) {
        //                     startIsShift = true;
        //                 }
        //                 shiftCount++;
        //                 shiftLineValue = value.replace(vditor.options.tab, "");
        //             }
        //             return shiftLineValue;
        //         }).join("\n");
        //
        //         formatRender(this.vditor, text.substring(0, selectLinePosition.start) +
        //             selectionShiftResult + text.substring(selectLinePosition.end - 1),
        //             {
        //                 end: position.end - shiftCount * vditor.options.tab.length,
        //                 start: position.start - (startIsShift ? vditor.options.tab.length : 0),
        //             });
        //         return;
        //     }
        //
        //     if (position.start === position.end) {
        //         insertText(this.vditor, vditor.options.tab, "");
        //         return;
        //     }
        //     const selectionResult = selectLineList.map((value) => {
        //         return vditor.options.tab + value;
        //     }).join("\n");
        //     formatRender(this.vditor, text.substring(0, selectLinePosition.start) + selectionResult +
        //         text.substring(selectLinePosition.end - 1),
        //         {
        //             end: position.end + selectLineList.length * vditor.options.tab.length,
        //             start: position.start + vditor.options.tab.length,
        //         });
        //     return;
        // }
        //
        // if (!event.metaKey && !event.ctrlKey && !event.shiftKey && event.keyCode === 8) {
        //     const position = getSelectPosition(this.vditor.editor.element);
        //     if (position.start !== position.end) {
        //         insertText(this.vditor, "", "", true);
        //     } else {
        //         const text = getText(this.vditor.editor.element);
        //         const emojiMatch = text.substring(0, position.start).match(/([\u{1F300}-\u{1F5FF}][\u{2000}-\u{206F}][\u{2700}-\u{27BF}]|([\u{1F900}-\u{1F9FF}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F600}-\u{1F64F}])[\u{2000}-\u{206F}][\u{2600}-\u{26FF}]|[\u{1F300}-\u{1F5FF}]|[\u{1F100}-\u{1F1FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F200}-\u{1F2FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F000}-\u{1F02F}]|[\u{FE00}-\u{FE0F}]|[\u{1F0A0}-\u{1F0FF}]|[\u{0000}-\u{007F}][\u{20D0}-\u{20FF}]|[\u{0000}-\u{007F}][\u{FE00}-\u{FE0F}][\u{20D0}-\u{20FF}])$/u);
        //         const deleteChar = emojiMatch ? emojiMatch[0].length : 1;
        //         formatRender(this.vditor,
        //             text.substring(0, position.start - deleteChar) + text.substring(position.start),
        //             {
        //                 end: position.start - deleteChar,
        //                 start: position.start - deleteChar,
        //             });
        //     }
        //     event.preventDefault();
        //     event.stopPropagation();
        //     return;
        // }
        //
        // // editor actions
        // if (vditor.options.keymap.deleteLine) {
        //     this.processKeymap(vditor.options.keymap.deleteLine, event, () => {
        //         const position = getSelectPosition(this.vditor.editor.element);
        //         const text = getText(this.vditor.editor.element);
        //         const linePosition = getCurrentLinePosition(position, text);
        //         const deletedText = text.substring(0, linePosition.start) + text.substring(linePosition.end);
        //         const startIndex = Math.min(deletedText.length, position.start);
        //         formatRender(this.vditor, deletedText, {
        //             end: startIndex,
        //             start: startIndex,
        //         });
        //     });
        // }
        //
        // if (vditor.options.keymap.duplicate) {
        //     this.processKeymap(vditor.options.keymap.duplicate, event, () => {
        //         const position = getSelectPosition(this.vditor.editor.element);
        //         const text = getText(this.vditor.editor.element);
        //         let lineText = text.substring(position.start, position.end);
        //         if (position.start === position.end) {
        //             const linePosition = getCurrentLinePosition(position, text);
        //             lineText = text.substring(linePosition.start, linePosition.end);
        //             formatRender(this.vditor,
        //                 text.substring(0, linePosition.end) + lineText + text.substring(linePosition.end),
        //                 {
        //                     end: position.end + lineText.length,
        //                     start: position.start + lineText.length,
        //                 });
        //         } else {
        //             formatRender(this.vditor,
        //                 text.substring(0, position.end) + lineText + text.substring(position.end),
        //                 {
        //                     end: position.end + lineText.length,
        //                     start: position.start + lineText.length,
        //                 });
        //         }
        //     });
        // }
        //
        // // toolbar action
        // vditor.options.toolbar.forEach((menuItem: IMenuItem) => {
        //     if (!menuItem.hotkey) {
        //         return;
        //     }
        //     this.processKeymap(menuItem.hotkey, event, () => {
        //         (this.vditor.toolbar.elements[menuItem.name].children[0] as HTMLElement).click();
        //     });
        // });
        // if (!this.vditor.toolbar.elements.undo && (event.metaKey || event.ctrlKey) && event.key === "z") {
        //     this.vditor.undo.undo(this.vditor);
        //     event.preventDefault();
        // }
        // if (!this.vditor.toolbar.elements.redo && (event.metaKey || event.ctrlKey) && event.key === "y") {
        //     this.vditor.undo.redo(this.vditor);
        //     event.preventDefault();
        // }

        // hint: 上下选择
        if (vditor.options.hint.at || vditor.toolbar.elements.emoji) {
            hint(event, hintElement);
        }
    });

};
