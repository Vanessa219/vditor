import {getSelectPosition} from "../editor/getSelectPosition";
import {setSelectionFocus} from "../editor/setSelection";
import {getCursorPosition} from "../hint/getCursorPosition";
import {i18n} from "../i18n";
import {copyEvent, focusEvent, hotkeyEvent, selectEvent} from "../util/editorCommenEvent";
import {getText} from "../util/getText";
import {getParentBlock} from "./getParentBlock";
import {highlightToolbar} from "./highlightToolbar";

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
        selectEvent(vditor, this.element);
    }

    private bindEvent(vditor: IVditor) {
        // TODO drap upload file & paste
        this.element.addEventListener("input", (event: IHTMLInputEvent) => {
            if (event.isComposing) {
                return;
            }

            if (vditor.options.counter > 0) {
                vditor.counter.render(getText(vditor).length,
                    vditor.options.counter);
            }

            if (typeof vditor.options.input === "function") {
                vditor.options.input(getText(vditor));
            }

            if (vditor.options.cache) {
                localStorage.setItem(`vditor${vditor.id}`, getText(vditor));
            }

            const range = getSelection().getRangeAt(0).cloneRange();

            // 前后空格处理
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

            if (!startSpace && !endSpace && event.inputType !== "formatItalic" && event.inputType !== "formatBold"
                && event.inputType !== "formatRemove"
                && event.inputType !== ""   // document.execCommand('unlink', false)
            ) {
                // 保存光标
                this.element.querySelectorAll("wbr").forEach((wbr) => {
                    wbr.remove();
                });
                const wbrNode = document.createElement("span");
                wbrNode.innerHTML = "<wbr/>";
                range.insertNode(wbrNode.childNodes[0]);

                // markdown 纠正
                console.log(`RenderVditorDOM-argument:[${this.element.innerHTML.replace(/&gt;/g, ">")}]`);
                const formatHTMLTemp = vditor.lute.RenderVditorDOM(this.element.innerHTML.replace(/&gt;/g, ">"));
                const formatHTML = formatHTMLTemp[0] || formatHTMLTemp[1];
                console.log(`RenderVditorDOM-result:[${formatHTML}]`);
                this.element.innerHTML = formatHTML;

                // 设置光标
                const wbrElement = this.element.querySelector("wbr");
                if (!wbrElement.previousElementSibling) {
                    if (wbrElement.previousSibling) {
                        // text<wbr>
                        range.setStart(wbrElement.previousSibling, wbrElement.previousSibling.textContent.length);
                    } else {
                        // 内容为空
                        range.setStartBefore(wbrElement);
                    }
                } else {
                    if (wbrElement.previousElementSibling.isEqualNode(wbrElement.previousSibling)) {
                        // <em>text</em><wbr>
                        range.setStart(wbrElement.previousElementSibling.lastChild,
                            wbrElement.previousElementSibling.lastChild.textContent.length);
                    } else {
                        // <em>text</em>text<wbr>
                        range.setStart(wbrElement.previousSibling, wbrElement.previousSibling.textContent.length);
                    }
                }
                setSelectionFocus(range);

                if (vditor.hint) {
                    vditor.hint.render(vditor);
                }

                if (vditor.devtools) {
                    vditor.devtools.renderEchart(vditor);
                }
            }
        });

        this.element.addEventListener("click", (event: IHTMLInputEvent) => {
            highlightToolbar(vditor);
            if (event.target.tagName === "INPUT") {
                if (event.target.checked) {
                    event.target.setAttribute("checked", "checked");
                } else {
                    event.target.removeAttribute("checked");
                }
            }

            if (event.target.tagName === "IMG") {
                const clientRect = event.target.getClientRects()[0];
                const editorRect = this.element.parentElement.getBoundingClientRect();
                const position = {
                    left: clientRect.left - editorRect.left,
                    top: clientRect.top - editorRect.top,
                };
                const btn = document.createElement("button");
                btn.textContent = i18n[vditor.options.lang].update;
                btn.onclick = () => {
                    event.target.setAttribute("href", (btn.previousElementSibling as HTMLInputElement).value);
                    vditor.popover.style.display = "none";
                };
                vditor.popover.innerHTML = `<input value="${event.target.getAttribute("src")}">`;
                vditor.popover.insertAdjacentElement("beforeend", btn);

                vditor.popover.style.top = position.top + "px";
                vditor.popover.style.left = position.left + "px";
                vditor.popover.style.display = "block";
            }
        });

        this.element.addEventListener("keyup", (event: KeyboardEvent) => {
            highlightToolbar(vditor);
        });

        this.element.addEventListener("keypress", (event: KeyboardEvent) => {
            if (!event.metaKey && !event.ctrlKey && event.key === "Enter" && event.shiftKey) {
                // 软换行
                const range = getSelection().getRangeAt(0).cloneRange();
                const brNode = document.createElement("span");
                if (range.startContainer.textContent.length === range.startOffset) {
                    // 代码片段末尾换行
                    brNode.innerHTML = "\n\n";
                } else {
                    brNode.innerHTML = "\n";
                }
                range.insertNode(brNode.childNodes[0]);
                range.collapse(false);
                setSelectionFocus(range);

                if (vditor.options.counter > 0) {
                    vditor.counter.render(getText(vditor).length, vditor.options.counter);
                }

                if (typeof vditor.options.input === "function") {
                    vditor.options.input(getText(vditor));
                }

                if (vditor.options.cache) {
                    localStorage.setItem(`vditor${vditor.id}`, getText(vditor));
                }

                if (vditor.devtools) {
                    vditor.devtools.renderEchart(vditor);
                }

                // event.preventDefault();
            }
        });
    }
}

export {WYSIWYG};
