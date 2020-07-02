import DiffMatchPatch, {diff_match_patch, patch_obj} from "diff-match-patch";
import {processAfterRender} from "../sv/process";
import {disableToolbar} from "../toolbar/setToolbar";
import {enableToolbar} from "../toolbar/setToolbar";
import {isFirefox, isSafari} from "../util/compatibility";
import {scrollCenter} from "../util/editorCommonEvent";
import {setRangeByWbr, setSelectionFocus} from "../util/selection";

class Undo {
    private undoStack: patch_obj[][];
    private redoStack: patch_obj[][];
    private stackSize = 50;
    private dmp: diff_match_patch;
    private lastText: string;
    private hasUndo: boolean;

    constructor() {
        this.redoStack = [];
        this.undoStack = [];
        // @ts-ignore
        this.dmp = new DiffMatchPatch();
        this.lastText = "";
        this.hasUndo = false;
    }

    public clearStack(vditor: IVditor) {
        this.redoStack = [];
        this.undoStack = [];
        this.lastText = "";
        this.hasUndo = false;
        this.resetIcon(vditor);
    }

    public resetIcon(vditor: IVditor) {
        if (!vditor.toolbar) {
            return;
        }
        if (this.undoStack.length > 1) {
            enableToolbar(vditor.toolbar.elements, ["undo"]);
        } else {
            disableToolbar(vditor.toolbar.elements, ["undo"]);
        }

        if (this.redoStack.length !== 0) {
            enableToolbar(vditor.toolbar.elements, ["redo"]);
        } else {
            disableToolbar(vditor.toolbar.elements, ["redo"]);
        }
    }

    public undo(vditor: IVditor) {
        if (vditor.sv.element.getAttribute("contenteditable") === "false") {
            return;
        }
        if (this.undoStack.length < 2) {
            return;
        }
        const state = this.undoStack.pop();
        if (!state) {
            return;
        }
        this.redoStack.push(state);
        this.renderDiff(state, vditor);
        this.hasUndo = true;
    }

    public redo(vditor: IVditor) {
        if (vditor.sv.element.getAttribute("contenteditable") === "false") {
            return;
        }
        const state = this.redoStack.pop();
        if (!state) {
            return;
        }
        this.undoStack.push(state);
        this.renderDiff(state, vditor, true);
    }

    public recordFirstPosition(vditor: IVditor, event: KeyboardEvent) {
        if (getSelection().rangeCount === 0) {
            return;
        }
        if (this.undoStack.length !== 1 || this.undoStack[0].length === 0) {
            return;
        }
        if (isFirefox() && event.key === "Backspace") {
            // Firefox 第一次删除无效
            return;
        }
        if (isSafari()) {
            // Safari keydown 在 input 之后，不需要重复记录历史
            return;
        }
        getSelection().getRangeAt(0).insertNode(document.createElement("wbr"));
        this.undoStack[0][0].diffs[0][1] = vditor.lute.SpinVditorSVDOM(vditor.sv.element.textContent);
        this.lastText = this.undoStack[0][0].diffs[0][1];
        if (vditor.sv.element.querySelector("wbr")) {
            vditor.sv.element.querySelector("wbr").remove();
        }
    }

    public addToUndoStack(vditor: IVditor) {
        let cloneRange: Range;
        if (getSelection().rangeCount !== 0 && !vditor.sv.element.querySelector("wbr")) {
            const range = getSelection().getRangeAt(0);
            cloneRange = range.cloneRange();
            if (vditor.sv.element.contains(range.startContainer)) {
                range.insertNode(document.createElement("wbr"));
            }
        }
        const text = vditor.lute.SpinVditorSVDOM(vditor.sv.element.textContent);
        if (vditor.sv.element.querySelector("wbr")) {
            vditor.sv.element.querySelector("wbr").remove();
        }
        if (cloneRange) {
            setSelectionFocus(cloneRange);
        }
        const diff = this.dmp.diff_main(text, this.lastText, true);
        const patchList = this.dmp.patch_make(text, this.lastText, diff);
        if (patchList.length === 0 && this.undoStack.length > 0) {
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
        }

        if (this.undoStack.length > 1) {
            enableToolbar(vditor.toolbar.elements, ["undo"]);
        }
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
        vditor.sv.element.innerHTML = text;
        setRangeByWbr(vditor.sv.element, vditor.sv.element.ownerDocument.createRange());
        scrollCenter(vditor);
        processAfterRender(vditor, {
            enableAddUndoStack: false,
            enableHint: false,
            enableInput: true,
        });

        if (this.undoStack.length > 1) {
            enableToolbar(vditor.toolbar.elements, ["undo"]);
        } else {
            disableToolbar(vditor.toolbar.elements, ["undo"]);
        }

        if (this.redoStack.length !== 0) {
            enableToolbar(vditor.toolbar.elements, ["redo"]);
        } else {
            disableToolbar(vditor.toolbar.elements, ["redo"]);
        }
    }
}

export {Undo};
