import DiffMatchPatch, {diff_match_patch, patch_obj} from "diff-match-patch";
import {disableToolbar} from "../toolbar/setToolbar";
import {enableToolbar} from "../toolbar/setToolbar";
import {isFirefox, isSafari} from "../util/compatibility";
import {scrollCenter} from "../util/editorCommenEvent";
import {setRangeByWbr, setSelectionFocus} from "../util/selection";
import {afterRenderEvent} from "../wysiwyg/afterRenderEvent";
import {highlightToolbar} from "../wysiwyg/highlightToolbar";
import {processCodeRender} from "../wysiwyg/processCodeRender";

class WysiwygUndo {
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

    public resetIcon(vditor: IVditor) {
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
        if (vditor.wysiwyg.element.getAttribute("contenteditable") === "false") {
            return;
        }
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
        if (vditor.wysiwyg.element.getAttribute("contenteditable") === "false") {
            return;
        }
        const state = this.redoStack.pop();
        if (!state) {
            return;
        }
        this.undoStack.push(state);
        this.renderDiff(state, vditor, true);
    }

    public recordFirstWbr(vditor: IVditor, event: KeyboardEvent) {
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
        this.undoStack[0][0].diffs[0][1] = vditor.lute.SpinVditorDOM(vditor.wysiwyg.element.innerHTML);
        this.lastText = this.undoStack[0][0].diffs[0][1];
        if (vditor.wysiwyg.element.querySelector("wbr")) {
            vditor.wysiwyg.element.querySelector("wbr").remove();
        }
        // 不能添加 setSelectionFocus(cloneRange); 否则 windows chrome 首次输入会烂
    }

    public addToUndoStack(vditor: IVditor) {
        // wysiwyg/afterRenderEvent.ts 已经 debounce
        let cloneRange: Range;
        if (getSelection().rangeCount !== 0 && !vditor.wysiwyg.element.querySelector("wbr")) {
            const range = getSelection().getRangeAt(0);
            if (vditor.wysiwyg.element.contains(range.startContainer)) {
                cloneRange = range.cloneRange();
                range.insertNode(document.createElement("wbr"));
            }
        }
        const text = vditor.lute.SpinVditorDOM(vditor.wysiwyg.element.innerHTML);
        if (vditor.wysiwyg.element.querySelector("wbr")) {
            vditor.wysiwyg.element.querySelector("wbr").remove();
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
            disableToolbar(vditor.toolbar.elements, ["redo"]);
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

        vditor.wysiwyg.element.innerHTML = text;
        vditor.wysiwyg.element.querySelectorAll(".vditor-wysiwyg__block").forEach((blockElement: HTMLElement) => {
            processCodeRender(blockElement, vditor);
        });
        setRangeByWbr(vditor.wysiwyg.element, vditor.wysiwyg.element.ownerDocument.createRange());
        scrollCenter(vditor.wysiwyg.element);
        afterRenderEvent(vditor, {
            enableAddUndoStack: false,
            enableHint: false,
            enableInput: true,
        });
        highlightToolbar(vditor);

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

export {WysiwygUndo};
