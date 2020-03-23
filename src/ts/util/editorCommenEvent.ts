import {processKeydown as irProcessKeydown} from "../ir/processKeydown";
import {getSelectText} from "../sv/getSelectText";
import {insertText} from "../sv/insertText";
import {processKeydown as mdProcessKeydown} from "../sv/processKeydown";
import {setEditMode} from "../toolbar/EditMode";
import {hidePanel} from "../toolbar/setToolbar";
import {getCursorPosition} from "../util/selection";
import {afterRenderEvent} from "../wysiwyg/afterRenderEvent";
import {processKeydown} from "../wysiwyg/processKeydown";
import {removeHeading, setHeading} from "../wysiwyg/setHeading";
import {isCtrl} from "./compatibility";
import {getMarkdown} from "./getMarkdown";
import {hasClosestByMatchTag} from "./hasClosest";
import {matchHotKey} from "./hotKey";

export const focusEvent = (vditor: IVditor, editorElement: HTMLElement) => {
    editorElement.addEventListener("focus", () => {
        if (vditor.options.focus) {
            vditor.options.focus(getMarkdown(vditor));
        }
        hidePanel(vditor, ["headings", "edit-mode", "emoji"]);
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
    editorElement.addEventListener("keydown", (event: KeyboardEvent & { target: HTMLElement }) => {
        // hint: 上下选择
        if ((vditor.options.hint.at || vditor.toolbar.elements.emoji) && vditor.hint.select(event, vditor)) {
            return;
        }

        if (vditor.currentMode === "sv") {
            if (mdProcessKeydown(vditor, event)) {
                return;
            }
        } else if (vditor.currentMode === "wysiwyg") {
            if (processKeydown(vditor, event)) {
                return;
            }
        } else if (vditor.currentMode === "ir") {
            if (irProcessKeydown(vditor, event)) {
                return;
            }
        }

        if (vditor.options.ctrlEnter && matchHotKey("⌘-Enter", event)) {
            vditor.options.ctrlEnter(getMarkdown(vditor));
            event.preventDefault();
            return;
        }

        // undo
        if (matchHotKey("⌘-Z", event)) {
            if (vditor.currentMode === "sv" && !vditor.toolbar.elements.undo) {
                vditor.undo.undo(vditor);
                event.preventDefault();
                return;
            } else if (vditor.currentMode === "wysiwyg" && !vditor.toolbar.elements.undo) {
                vditor.wysiwygUndo.undo(vditor);
                event.preventDefault();
                return;
            } else if (vditor.currentMode === "ir") {
                vditor.irUndo.undo(vditor);
                event.preventDefault();
                return;
            }
        }

        // redo
        if (matchHotKey("⌘-Y", event)) {
            if (vditor.currentMode === "sv" && !vditor.toolbar.elements.redo) {
                vditor.undo.redo(vditor);
                event.preventDefault();
                return;
            } else if (vditor.currentMode === "wysiwyg" && !vditor.toolbar.elements.redo) {
                vditor.wysiwygUndo.redo(vditor);
                event.preventDefault();
                return;
            } else if (vditor.currentMode === "ir") {
                vditor.irUndo.redo(vditor);
                event.preventDefault();
                return;
            }
        }

        // esc
        if (event.key === "Escape") {
            if (vditor.options.esc) {
                vditor.options.esc(getMarkdown(vditor));
            }
            const hintElement = vditor.hint && vditor.hint.element;
            if (hintElement && hintElement.style.display === "block") {
                hintElement.style.display = "none";
            }
            event.preventDefault();
            return;
        }

        // toolbar action
        if (vditor.currentMode !== "ir") {
            vditor.options.toolbar.find((menuItem: IMenuItem) => {
                if (!menuItem.hotkey) {
                    return false;
                }
                if (matchHotKey(menuItem.hotkey, event)) {
                    if (menuItem.name === "upload") {
                        (vditor.toolbar.elements[menuItem.name].querySelector("input") as HTMLElement).click();
                    } else {
                        vditor.toolbar.elements[menuItem.name].children[0].dispatchEvent(new CustomEvent("click"));
                    }
                    event.preventDefault();
                    return true;
                }
            });

            // h1 - h6 hotkey
            if (isCtrl(event) && event.altKey && !event.shiftKey && /^Digit[1-6]$/.test(event.code)) {
                if (vditor.currentMode === "wysiwyg") {
                    const tagName = event.code.replace("Digit", "H");
                    if (hasClosestByMatchTag(getSelection().getRangeAt(0).startContainer, tagName)) {
                        removeHeading(vditor);
                    } else {
                        setHeading(vditor, tagName);
                    }
                    afterRenderEvent(vditor);
                } else {
                    insertText(vditor,
                        "#".repeat(parseInt(event.code.replace("Digit", ""), 10)) + " ",
                        "", false, true);
                }
                event.preventDefault();
                return true;
            }
        }

        // toggle edit mode
        if (isCtrl(event) && event.altKey && !event.shiftKey && /^Digit[7-9]$/.test(event.code)) {
            if (event.code === "Digit7") {
                setEditMode(vditor, "wysiwyg", event);
            } else if (event.code === "Digit8") {
                setEditMode(vditor, "ir", event);
            } else if (event.code === "Digit9") {
                setEditMode(vditor, "sv", event);
            }
            return true;
        }
    });
};

export const selectEvent = (vditor: IVditor, editorElement: HTMLElement) => {
    if (!vditor.options.select) {
        return;
    }
    editorElement.addEventListener("selectstart", (event: Event) => {
        editorElement.onmouseup = () => {
            const element = vditor.currentMode === "wysiwyg" ?
                vditor.wysiwyg.element : vditor.sv.element;
            const selectText = getSelectText(element);
            vditor.options.select(selectText);
        };
    });
};
