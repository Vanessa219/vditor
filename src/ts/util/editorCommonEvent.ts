import {processHeading} from "../ir/process";
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
        hidePanel(vditor, ["headings", "emoji", "submenu"]);
    });
};

export const scrollCenter = (vditor: IVditor) => {
    if (!vditor.options.typewriterMode) {
        return;
    }
    const editorElement = vditor[vditor.currentMode].element;
    const cursorTop = getCursorPosition(editorElement).top;
    if (typeof vditor.options.height === "string" && !vditor.element.classList.contains("vditor--fullscreen")) {
        window.scrollTo(window.scrollX,
            cursorTop + vditor.element.offsetTop + vditor.toolbar.element.offsetHeight - window.innerHeight / 2 + 10);
    }
    if (typeof vditor.options.height === "number" || vditor.element.classList.contains("vditor--fullscreen")) {
        editorElement.scrollTop = cursorTop + editorElement.scrollTop - editorElement.clientHeight / 2 + 10;
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
            if (vditor.hint.element.style.display === "block") {
                vditor.hint.element.style.display = "none";
            }
            event.preventDefault();
            return;
        }

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
            } else if (vditor.currentMode === "sv") {
                insertText(vditor,
                    "#".repeat(parseInt(event.code.replace("Digit", ""), 10)) + " ",
                    "", false, true);
            } else if (vditor.currentMode === "ir") {
                processHeading(vditor, "#".repeat(parseInt(event.code.replace("Digit", ""), 10)) + " ");
            }
            event.preventDefault();
            return true;
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

        // toolbar action
        vditor.options.toolbar.find((menuItem: IMenuItem) => {
            if (!menuItem.hotkey || menuItem.toolbar) {
                if (menuItem.toolbar) {
                    const sub = menuItem.toolbar.find((subMenuItem: IMenuItem) => {
                        if (!subMenuItem.hotkey) {
                            return false;
                        }
                        if (matchHotKey(subMenuItem.hotkey, event)) {
                            vditor.toolbar.elements[subMenuItem.name].children[0]
                                .dispatchEvent(new CustomEvent("click"));
                            event.preventDefault();
                            return true;
                        }
                    })
                    return sub ? true : false;
                }
                return false;
            }
            if (matchHotKey(menuItem.hotkey, event)) {
                vditor.toolbar.elements[menuItem.name].children[0].dispatchEvent(new CustomEvent("click"));
                event.preventDefault();
                return true;
            }
        });
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
