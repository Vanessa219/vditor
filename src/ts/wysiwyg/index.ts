import {getSelectPosition} from "../editor/getSelectPosition";
import {getSelectText} from "../editor/getSelectText";
import {setSelectionFocus} from "../editor/setSelection";
import {copyEvent, focusEvent, hotkeyEvent, scrollCenter} from "../util/editorCommenEvent";
import {getParentBlock} from "./getParentBlock";
import {setRange} from "./setRange";

class WYSIWYG {
    public element: HTMLPreElement;

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
                // if (blockElement.lastElementChild.className !== "newline") {
                //     blockElement.insertAdjacentHTML("beforeend", "<span class='newline'>\n\n</span>");
                // }
                const caret = getSelectPosition(this.element, range);
                const content = this.element.textContent.replace(/\n{1,2}$/, "");
                if (content === "*") {
                    return;
                }
                const formatHTML = vditor.lute.RenderVditorDOM(content, caret.start, caret.end);
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
                    console.log("enter caret", caret);
                    const formatHTML = vditor.lute.VditorOperation(this.element.textContent, caret.start, caret.end,
                        "newline");
                    this.luteRender(vditor, range, formatHTML[0] || formatHTML[1]);
                    // if (caret.end === blockElement.textContent.replace(/\n{1,2}$/, "").length) {
                    //     // 段末换行
                    //     blockElement.insertAdjacentHTML("afterend", newlineHTML[0] || newlineHTML[1]);
                    //     setRange(this.element, range);
                    // } else if (caret.start === 0) {
                    //     // 段前换行
                    //     blockElement.insertAdjacentHTML("beforebegin", newlineHTML[0] || newlineHTML[1]);
                    //     setRange(this.element, range);
                    // } else {
                    //     // 分段
                    //     brNode.innerHTML = "\n\n";
                    //     range.insertNode(brNode.childNodes[0]);
                    //     range.collapse(false);
                    //     this.luteRender(vditor, range);
                    // }

                }
                scrollCenter(this.element);
                event.preventDefault();
            }
        });
    }
}

export {WYSIWYG};
