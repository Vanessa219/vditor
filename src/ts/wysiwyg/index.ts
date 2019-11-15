import {getSelectPosition} from "../editor/getSelectPosition";
import {setSelectionFocus} from "../editor/setSelection";
import {highlightRender} from "../markdown/highlightRender";
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
            console.log(event);
            if (event.isComposing) {
                return;
            }

            if (vditor.options.counter > 0) {
                vditor.counter.render(getText(vditor.wysiwyg.element, vditor.currentMode).length, vditor.options.counter);
            }

            if (typeof vditor.options.input === "function") {
                vditor.options.input(getText(vditor.wysiwyg.element, vditor.currentMode));
            }

            if (vditor.options.cache) {
                localStorage.setItem(`vditor${vditor.id}`, getText(vditor.wysiwyg.element, vditor.currentMode));
            }

            const range = getSelection().getRangeAt(0).cloneRange();
            if (vditor.devtools) {
                vditor.devtools.renderEchart(vditor);
            }

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
                const formatHTML = vditor.lute.MarkdownStr("", this.element.innerHTML);
                console.log("input",  this.element.innerHTML, content, caret);
                this.luteRender(vditor, range, formatHTML[0] || formatHTML[1]);
            }
        });

        this.element.addEventListener("keypress", (event: KeyboardEvent) => {
            // if (!event.metaKey && !event.ctrlKey && event.key === "Enter") {
            //     const range = getSelection().getRangeAt(0).cloneRange();
            //
            //     let isCode = false
            //     vditor.wysiwyg.element.querySelectorAll('pre > code').forEach((element) => {
            //         if (element.contains(range.commonAncestorContainer)) {
            //             isCode = true
            //         }
            //     })
            //
            //     if (event.shiftKey || isCode) {
            //         // 软换行
            //         const brNode = document.createElement("span");
            //         if (isCode && range.startContainer.textContent.length === range.startOffset) {
            //             // 代码片段末尾换行
            //             brNode.innerHTML = "\n\n";
            //         } else {
            //             brNode.innerHTML = "\n";
            //         }
            //         range.insertNode(brNode.childNodes[0]);
            //         range.collapse(false);
            //         setSelectionFocus(range);
            //     } else {
            //         const caret = getSelectPosition(this.element, range);
            //         console.log("newline", getText(this.element, vditor.currentMode), caret);
            //         const formatHTML = vditor.lute.VditorOperation(getText(this.element, vditor.currentMode),
            //             caret.start, caret.end, "newline");
            //         this.luteRender(vditor, range, formatHTML[0] || formatHTML[1]);
            //     }
            //     scrollCenter(this.element);
            //
            //     if (vditor.options.counter > 0) {
            //         vditor.counter.render(getText(vditor.wysiwyg.element, vditor.currentMode).length, vditor.options.counter);
            //     }
            //
            //     if (typeof vditor.options.input === "function") {
            //         vditor.options.input(getText(vditor.wysiwyg.element, vditor.currentMode));
            //     }
            //
            //     if (vditor.options.cache) {
            //         localStorage.setItem(`vditor${vditor.id}`, getText(vditor.wysiwyg.element, vditor.currentMode));
            //     }
            //
            //     if (vditor.devtools) {
            //         vditor.devtools.renderEchart(vditor);
            //     }
            //
            //     event.preventDefault();
            // }
        });
    }
}

export {WYSIWYG};
