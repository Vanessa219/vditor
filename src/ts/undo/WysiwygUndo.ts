import DiffMatchPatch, {diff_match_patch, patch_obj} from "diff-match-patch";
import {scrollCenter} from "../util/editorCommenEvent";
import {afterRenderEvent} from "../wysiwyg/afterRenderEvent";
import {setRangeByWbr} from "../wysiwyg/setRangeByWbr";

class WysiwygUndo {
    private undoStack: patch_obj[][];
    private redoStack: patch_obj[][];
    private stackSize = 50;
    private dmp: diff_match_patch;
    private lastText: string;
    private hasUndo: boolean;
    private timeout: number;

    constructor() {
        this.redoStack = [];
        this.undoStack = [];
        // @ts-ignore
        this.dmp = new DiffMatchPatch();
        this.lastText = "";
        this.hasUndo = false;
    }

    public undo(vditor: IVditor) {
        if (this.undoStack.length < 2) {
            return;
        }
        const state = this.undoStack.pop();
        if (!state || !state) {
            return;
        }
        this.redoStack.push(state);
        this.renderDiff(state, vditor);
        this.hasUndo = true;
    }

    public redo(vditor: IVditor) {
        const state = this.redoStack.pop();
        if (!state) {
            return;
        }
        this.undoStack.push(state);
        this.renderDiff(state, vditor, true);
    }

    public addToUndoStack(vditor: IVditor) {
        clearTimeout(this.timeout);
        this.timeout = window.setTimeout(() => {
            const text = vditor.lute.SpinVditorDOM(vditor.wysiwyg.element.innerHTML);
            const diff = this.dmp.diff_main(text, this.lastText, true);
            const patchList = this.dmp.patch_make(text, this.lastText, diff);
            if (patchList.length === 0) {
                return;
            }
            this.lastText = text;
            this.undoStack.push(patchList);
            if (this.undoStack.length > this.stackSize) {
                this.undoStack.shift();
            }
            if (this.hasUndo) {
                this.redoStack = [];
                this.hasUndo = false;
                if (vditor.toolbar.elements.redo) {
                    if (!vditor.toolbar.elements.redo.children[0].classList.contains("vditor-menu--disabled")) {
                        vditor.toolbar.elements.redo.children[0].classList.add("vditor-menu--disabled");
                    }
                }
            }

            if (vditor.toolbar.elements.undo && this.undoStack.length > 1) {
                vditor.toolbar.elements.undo.children[0].classList.remove("vditor-menu--disabled");
            }
        }, 500);
    }

    private renderDiff(state: patch_obj[], vditor: IVditor, isRedo: boolean = false) {
        let text;
        if (isRedo) {
            const redoPatchList = this.dmp.patch_deepCopy(state).reverse();
            redoPatchList.forEach((patch) => {
                patch.diffs.forEach((diff) => {
                    diff[0] = -diff[0];
                });
            });
            text = this.dmp.patch_apply(redoPatchList, this.lastText)[0];
        } else {
            text = this.dmp.patch_apply(state, this.lastText)[0];
        }

        this.lastText = text;

        vditor.wysiwyg.element.innerHTML = text;
        vditor.wysiwyg.element.insertAdjacentElement("beforeend", vditor.wysiwyg.popover);
        setRangeByWbr(vditor.wysiwyg.element, vditor.wysiwyg.element.ownerDocument.createRange());
        scrollCenter(vditor.wysiwyg.element);
        afterRenderEvent(vditor);

        if (vditor.toolbar.elements.undo) {
            if (this.undoStack.length > 1) {
                vditor.toolbar.elements.undo.children[0].classList.remove("vditor-menu--disabled");
            } else if (!vditor.toolbar.elements.undo.children[0].classList.contains("vditor-menu--disabled")) {
                vditor.toolbar.elements.undo.children[0].classList.add("vditor-menu--disabled");
            }
        }

        if (vditor.toolbar.elements.redo) {
            if (this.redoStack.length !== 0) {
                vditor.toolbar.elements.redo.children[0].classList.remove("vditor-menu--disabled");
            } else if (!vditor.toolbar.elements.redo.children[0].classList.contains("vditor-menu--disabled")) {
                vditor.toolbar.elements.redo.children[0].classList.add("vditor-menu--disabled");
            }
        }
    }
}

export {WysiwygUndo};
