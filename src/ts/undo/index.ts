import DiffMatchPatch, {diff_match_patch, patch_obj} from "diff-match-patch";
import {disableToolbar, enableToolbar} from "../toolbar/setToolbar";
import {isFirefox, isSafari} from "../util/compatibility";
import {scrollCenter} from "../util/editorCommonEvent";
import {execAfterRender} from "../util/fixBrowserBehavior";
import {highlightToolbar} from "../util/highlightToolbar";
import {processCodeRender} from "../util/processCode";
import {setRangeByWbr, setSelectionFocus} from "../util/selection";

interface IUndo {
    hasUndo: boolean;
    lastText: string;
    redoStack: patch_obj[][];
    undoStack: patch_obj[][];
}

class Undo {
    private stackSize = 50;
    private dmp: diff_match_patch;
    private wysiwyg: IUndo;
    private ir: IUndo;
    private sv: IUndo;

    constructor() {
        this.resetStack();
        // @ts-ignore
        this.dmp = new DiffMatchPatch();
    }

    public clearStack(vditor: IVditor) {
        this.resetStack();
        this.resetIcon(vditor);
    }

    public resetIcon(vditor: IVditor) {
        if (!vditor.toolbar) {
            return;
        }

        if (this[vditor.currentMode].undoStack.length > 1) {
            enableToolbar(vditor.toolbar.elements, ["undo"]);
        } else {
            disableToolbar(vditor.toolbar.elements, ["undo"]);
        }

        if (this[vditor.currentMode].redoStack.length !== 0) {
            enableToolbar(vditor.toolbar.elements, ["redo"]);
        } else {
            disableToolbar(vditor.toolbar.elements, ["redo"]);
        }
    }

    public undo(vditor: IVditor) {
        if (vditor[vditor.currentMode].element.getAttribute("contenteditable") === "false") {
            return;
        }
        if (this[vditor.currentMode].undoStack.length < 2) {
            return;
        }
        const state = this[vditor.currentMode].undoStack.pop();
        if (!state) {
            return;
        }
        this[vditor.currentMode].redoStack.push(state);
        this.renderDiff(state, vditor);
        this[vditor.currentMode].hasUndo = true;
    }

    public redo(vditor: IVditor) {
        if (vditor[vditor.currentMode].element.getAttribute("contenteditable") === "false") {
            return;
        }
        const state = this[vditor.currentMode].redoStack.pop();
        if (!state) {
            return;
        }
        this[vditor.currentMode].undoStack.push(state);
        this.renderDiff(state, vditor, true);
    }

    public recordFirstPosition(vditor: IVditor, event: KeyboardEvent) {
        if (getSelection().rangeCount === 0) {
            return;
        }
        if (this[vditor.currentMode].undoStack.length !== 1 || this[vditor.currentMode].undoStack[0].length === 0) {
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
        if (vditor.currentMode === "wysiwyg") {
            this[vditor.currentMode].undoStack[0][0].diffs[0][1] =
                vditor.lute.SpinVditorDOM(vditor[vditor.currentMode].element.innerHTML);
        } else if (vditor.currentMode === "ir") {
            this[vditor.currentMode].undoStack[0][0].diffs[0][1] =
                vditor.lute.SpinVditorIRDOM(vditor[vditor.currentMode].element.innerHTML);
        } else {
            this[vditor.currentMode].undoStack[0][0].diffs[0][1] = vditor[vditor.currentMode].element.innerHTML;
        }
        this[vditor.currentMode].lastText = this[vditor.currentMode].undoStack[0][0].diffs[0][1];
        const wbrElement =
            vditor[vditor.currentMode].element.querySelector("wbr");
        if (wbrElement) {
            wbrElement.remove();
        }
        // 不能添加 setSelectionFocus(cloneRange); 否则 windows chrome 首次输入会烂
    }

    public addToUndoStack(vditor: IVditor) {
        // afterRenderEvent.ts 已经 debounce
        let cloneRange: Range;
        if (getSelection().rangeCount !== 0 && !vditor[vditor.currentMode].element.querySelector("wbr")) {
            const range = getSelection().getRangeAt(0);
            if (vditor[vditor.currentMode].element.contains(range.startContainer)) {
                cloneRange = range.cloneRange();
                range.insertNode(document.createElement("wbr"));
            }
        }
        let text;
        if (vditor.currentMode === "wysiwyg") {
            text = vditor.lute.SpinVditorDOM(vditor[vditor.currentMode].element.innerHTML);
        } else if (vditor.currentMode === "ir") {
            text = vditor.lute.SpinVditorIRDOM(vditor[vditor.currentMode].element.innerHTML);
        } else {
            text = vditor[vditor.currentMode].element.innerHTML;
        }
        const wbrElement = vditor[vditor.currentMode].element.querySelector("wbr");
        if (wbrElement) {
            wbrElement.remove();
        }
        if (cloneRange) {
            setSelectionFocus(cloneRange);
        }
        const diff = this.dmp.diff_main(text, this[vditor.currentMode].lastText, true);
        const patchList = this.dmp.patch_make(text, this[vditor.currentMode].lastText, diff);
        if (patchList.length === 0 && this[vditor.currentMode].undoStack.length > 0) {
            return;
        }
        this[vditor.currentMode].lastText = text;
        this[vditor.currentMode].undoStack.push(patchList);
        if (this[vditor.currentMode].undoStack.length > this.stackSize) {
            this[vditor.currentMode].undoStack.shift();
        }
        if (this[vditor.currentMode].hasUndo) {
            this[vditor.currentMode].redoStack = [];
            this[vditor.currentMode].hasUndo = false;
            disableToolbar(vditor.toolbar.elements, ["redo"]);
        }

        if (this[vditor.currentMode].undoStack.length > 1) {
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
            text = this.dmp.patch_apply(redoPatchList, this[vditor.currentMode].lastText)[0];
        } else {
            text = this.dmp.patch_apply(state, this[vditor.currentMode].lastText)[0];
        }

        this[vditor.currentMode].lastText = text;
        vditor[vditor.currentMode].element.innerHTML = text;
        if (vditor.currentMode !== "sv") {
            vditor[vditor.currentMode].element.querySelectorAll(`.vditor-${vditor.currentMode}__preview[data-render='2']`)
                .forEach((blockElement: HTMLElement) => {
                    processCodeRender(blockElement, vditor);
                });
        }

        if (!vditor[vditor.currentMode].element.querySelector("wbr")) {
            // Safari 第一次输入没有光标，需手动定位到结尾
            const range = getSelection().getRangeAt(0);
            range.setEndBefore(vditor[vditor.currentMode].element);
            range.collapse(false);
        } else {
            setRangeByWbr(
                vditor[vditor.currentMode].element, vditor[vditor.currentMode].element.ownerDocument.createRange());
            scrollCenter(vditor);
        }

        execAfterRender(vditor, {
            enableAddUndoStack: false,
            enableHint: false,
            enableInput: true,
        });
        highlightToolbar(vditor);

        if (this[vditor.currentMode].undoStack.length > 1) {
            enableToolbar(vditor.toolbar.elements, ["undo"]);
        } else {
            disableToolbar(vditor.toolbar.elements, ["undo"]);
        }

        if (this[vditor.currentMode].redoStack.length !== 0) {
            enableToolbar(vditor.toolbar.elements, ["redo"]);
        } else {
            disableToolbar(vditor.toolbar.elements, ["redo"]);
        }
    }

    private resetStack() {
        this.ir = {
            hasUndo: false,
            lastText: "",
            redoStack: [],
            undoStack: [],
        };
        this.sv = {
            hasUndo: false,
            lastText: "",
            redoStack: [],
            undoStack: [],
        };
        this.wysiwyg = {
            hasUndo: false,
            lastText: "",
            redoStack: [],
            undoStack: [],
        };
    }
}

export {Undo};
