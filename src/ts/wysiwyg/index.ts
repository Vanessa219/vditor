import {getSelectPosition} from "../editor/getSelectPosition";
import {setSelectionFocus} from "../editor/setSelection";
import {copyEvent, focusEvent, hotkeyEvent, scrollCenter} from "../util/editorCommenEvent";
import {getText} from "../util/getText";
import {getParentBlock} from "./getParentBlock";
import {setRange} from "./setRange";

class WYSIWYG {
    public element: HTMLPreElement;
    public range: Range;

    constructor(vditor: IVditor) {
        this.element = document.createElement("pre");
        this.element.className = "vditor-reset vditor-wysiwyg";
        this.element.setAttribute("contenteditable", "true");
        if (vditor.currentMode === "markdown") {
            this.element.style.display = "none";
        }

        this.bindEvent(vditor);

        focusEvent(vditor, this.element);
        copyEvent(this.element);
        hotkeyEvent(vditor, this.element);
    }

    private luteRender(vditor: IVditor, range: Range, formatHTML: string) {
        this.element.innerHTML = formatHTML;
        console.log(formatHTML);
        setRange(this.element, range);

        if (vditor.hint) {
            vditor.hint.render(vditor);
        }

        if (vditor.devtools) {
            vditor.devtools.renderEchart(vditor);
        }
    }

    private bindEvent(vditor: IVditor) {
        // TODO drap upload file & paste
        this.element.addEventListener("input", (event: IHTMLInputEvent) => {
            if (event.isComposing) {
                return;
            }
            const range = getSelection().getRangeAt(0).cloneRange();
            const blockElement = getParentBlock(range.startContainer as HTMLElement);
            const startOffset = getSelectPosition(blockElement, range).start;

            // 开始可以输入空格
            let startSpace = true;
            for (let i = startOffset - 1; i >= 0; i--) {
                if (blockElement.textContent.charAt(i) !== " ") {
                    startSpace = false;
                    break;
                }
            }
            if (startOffset === 0) {
                startSpace = false;
            }

            // 结尾可以输入空格
            let endSpace = true;
            for (let i = startOffset - 1; i < blockElement.textContent.length; i++) {
                if (blockElement.textContent.charAt(i) !== " " && blockElement.textContent.charAt(i) !== "\n") {
                    endSpace = false;
                    break;
                }
            }

            if (!startSpace && !endSpace) {
                const caret = getSelectPosition(this.element, range);
                const content = getText(this.element, vditor.currentMode).replace(/\n{1,2}$/, "");
                if (content === "*") {
                    return;
                }
                const formatHTML = vditor.lute.RenderVditorDOM(content, caret.start, caret.end);
                console.log("input", content, caret);
                this.luteRender(vditor, range, formatHTML[0] || formatHTML[1]);
            }
        });

        this.element.addEventListener("keypress", (event: KeyboardEvent) => {
            if (!event.metaKey && !event.ctrlKey && event.key === "Enter") {
                const range = getSelection().getRangeAt(0).cloneRange();
                const brNode = document.createElement("span");
                if (event.shiftKey) {
                    // 软换行
                    brNode.innerHTML = "\n";
                    range.insertNode(brNode.childNodes[0]);
                    range.collapse(false);
                    setSelectionFocus(range);
                } else {
                    const caret = getSelectPosition(this.element, range);
                    console.log("newline", getText(this.element, vditor.currentMode), caret);
                    const formatHTML = vditor.lute.VditorOperation(getText(this.element, vditor.currentMode),
                        caret.start, caret.end, "newline");
                    this.luteRender(vditor, range, formatHTML[0] || formatHTML[1]);
                }
                scrollCenter(this.element);
                event.preventDefault();
            }
        });
    }
}

export {WYSIWYG};
