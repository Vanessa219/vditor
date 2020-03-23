import {Constants} from "../constants";
import {processAfterRender} from "../ir/process";
import {formatRender} from "../sv/formatRender";
import {code160to32} from "../util/code160to32";
import {getMarkdown} from "../util/getMarkdown";
import {hasClosestByAttribute, hasClosestByClassName} from "../util/hasClosest";
import {getCursorPosition, getSelectPosition, insertHTML, setSelectionFocus} from "../util/selection";
import {afterRenderEvent} from "../wysiwyg/afterRenderEvent";
import {processCodeRender} from "../wysiwyg/processCodeRender";

export class Hint {
    public timeId: number;
    public element: HTMLDivElement;

    constructor() {
        this.timeId = -1;
        this.element = document.createElement("div");
        this.element.className = "vditor-hint";
    }

    public render(vditor: IVditor) {
        if (!window.getSelection().focusNode) {
            return;
        }
        const position = getSelectPosition(vditor.currentMode === "wysiwyg" ?
            vditor.wysiwyg.element : vditor.sv.element);
        let currentLineValue: string;
        if (vditor.currentMode !== "sv") {
            const range = getSelection().getRangeAt(0);
            currentLineValue = range.startContainer.textContent.substring(0, range.startOffset) || "";
        } else {
            currentLineValue = getMarkdown(vditor)
                .substring(0, position.end).split("\n").slice(-1).pop();
        }

        let key = this.getKey(currentLineValue, ":");
        let isAt = false;

        if (typeof key === "undefined") {
            isAt = true;
            key = this.getKey(currentLineValue, "@");
        }

        if (key === undefined) {
            this.element.style.display = "none";
            clearTimeout(this.timeId);
        } else {
            if (isAt && vditor.options.hint.at) {
                clearTimeout(this.timeId);
                this.timeId = window.setTimeout(() => {
                    this.genHTML(vditor.options.hint.at(key), key, vditor);
                }, vditor.options.hint.delay);
            }
            if (!isAt) {
                const emojiHint = key === "" ? vditor.options.hint.emoji : vditor.lute.GetEmojis();
                const matchEmojiData: IHintData[] = [];
                Object.keys(emojiHint).forEach((keyName) => {
                    if (keyName.indexOf(key.toLowerCase()) === 0) {
                        if (emojiHint[keyName].indexOf(".") > -1) {
                            matchEmojiData.push({
                                html: `<img src="${emojiHint[keyName]}" title=":${keyName}:"/> :${keyName}:`,
                                value: `:${keyName}:`,
                            });
                        } else {
                            matchEmojiData.push({
                                html: `<span class="vditor-hint__emoji">${emojiHint[keyName]}</span>${keyName}`,
                                value: emojiHint[keyName],
                            });
                        }
                    }
                });
                this.genHTML(matchEmojiData, key, vditor);
            }
        }
    }

    public genHTML(data: IHintData[], key: string, vditor: IVditor) {
        if (data.length === 0) {
            this.element.style.display = "none";
            return;
        }

        let editorElement = vditor.sv.element;
        if (vditor.currentMode === "wysiwyg") {
            editorElement = vditor.wysiwyg.element;
        } else if (vditor.currentMode === "ir") {
            editorElement = vditor.ir.element;
        }

        const textareaPosition = getCursorPosition(editorElement);
        const x = textareaPosition.left;
        const y = textareaPosition.top;
        let hintsHTML = "";

        data.forEach((hintData, i) => {
            if (i > 7) {
                return;
            }
            // process high light
            let html = hintData.html;
            if (key !== "") {
                const lastIndex = html.lastIndexOf(">") + 1;
                let replaceHtml = html.substr(lastIndex);
                const replaceIndex = replaceHtml.toLowerCase().indexOf(key.toLowerCase());
                if (replaceIndex > -1) {
                    replaceHtml = replaceHtml.substring(0, replaceIndex) + "<b>" +
                        replaceHtml.substring(replaceIndex, replaceIndex + key.length) + "</b>" +
                        replaceHtml.substring(replaceIndex + key.length);
                    html = html.substr(0, lastIndex) + replaceHtml;
                }
            }
            hintsHTML += `<button data-value="${hintData.value} "
${i === 0 ? "class='vditor-hint--current'" : ""}> ${html}</button>`;
        });

        this.element.innerHTML = hintsHTML;
        const lineHeight = parseInt(document.defaultView.getComputedStyle(editorElement, null)
            .getPropertyValue("line-height"), 10);
        this.element.style.top = `${y + (lineHeight || 22)}px`;
        this.element.style.left = `${x}px`;
        this.element.style.display = "block";

        this.element.querySelectorAll("button").forEach((element) => {
            element.addEventListener("click", (event) => {
                this.fillEmoji(element, vditor);
                event.preventDefault();
            });
        });
        // hint 展现在上部
        if (this.element.getBoundingClientRect().bottom > window.innerHeight) {
            this.element.style.top = `${y - this.element.offsetHeight}px`;
        }
    }

    public fillEmoji = (element: HTMLElement, vditor: IVditor) => {
        this.element.style.display = "none";

        const value = element.getAttribute("data-value");
        const splitChar = value.indexOf("@") === 0 ? "@" : ":";
        const range: Range = window.getSelection().getRangeAt(0);

        if (vditor.currentMode !== "sv") {
            if (vditor.currentMode === "ir") {
                const preBeforeElement = hasClosestByAttribute(range.startContainer, "data-type", "code-block-info");
                if (preBeforeElement) {
                    preBeforeElement.textContent = Constants.ZWSP + value.trimRight();
                    range.selectNodeContents(preBeforeElement);
                    range.collapse(false);
                    processAfterRender(vditor);
                    return;
                }
            }
            if (vditor.currentMode === "wysiwyg" && range.startContainer.nodeType !== 3 &&
                (range.startContainer as HTMLElement).firstElementChild.classList.contains("vditor-input")) {
                const inputElement = (range.startContainer as HTMLElement).firstElementChild as HTMLInputElement;
                inputElement.value = value.trimRight();
                range.selectNodeContents(inputElement);
                range.collapse(false);
                inputElement.dispatchEvent(new CustomEvent("input"));
                return;
            }

            range.setStart(range.startContainer, range.startContainer.textContent.lastIndexOf(splitChar));
            range.deleteContents();
            if (value.indexOf(":") > -1) {
                insertHTML(vditor.lute.SpinVditorDOM(value), vditor);
                range.insertNode(document.createTextNode(" "));
            } else {
                range.insertNode(document.createTextNode(value));
            }
            range.collapse(false);
            setSelectionFocus(range);

            if (vditor.currentMode === "wysiwyg") {
                const blockRenderElement = hasClosestByClassName(range.startContainer, "vditor-wysiwyg__block");
                if (blockRenderElement) {
                    processCodeRender(blockRenderElement, vditor);
                }
                afterRenderEvent(vditor);
            } else {
                processAfterRender(vditor);
            }
        } else {
            const position = getSelectPosition(vditor.sv.element, range);
            const text = getMarkdown(vditor);
            const preText = text.substring(0, text.substring(0, position.start).lastIndexOf(splitChar));
            formatRender(vditor, preText + value + text.substring(position.start),
                {
                    end: (preText + value).length,
                    start: (preText + value).length,
                });
        }
    }

    public select(event: KeyboardEvent, vditor: IVditor) {

        if (this.element.querySelectorAll("button").length === 0 ||
            this.element.style.display === "none") {
            return false;
        }

        const currentHintElement: HTMLElement = this.element.querySelector(".vditor-hint--current");

        if (event.key === "ArrowDown") {
            event.preventDefault();
            event.stopPropagation();
            currentHintElement.removeAttribute("class");
            if (!currentHintElement.nextElementSibling) {
                this.element.children[0].className = "vditor-hint--current";
            } else {
                currentHintElement.nextElementSibling.className = "vditor-hint--current";
            }
            return true;
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            event.stopPropagation();
            currentHintElement.removeAttribute("class");
            if (!currentHintElement.previousElementSibling) {
                const length = this.element.children.length;
                this.element.children[length - 1].className = "vditor-hint--current";
            } else {
                currentHintElement.previousElementSibling.className = "vditor-hint--current";
            }
            return true;
        } else if (event.key === "Enter") {
            event.preventDefault();
            event.stopPropagation();
            this.fillEmoji(currentHintElement, vditor);
            return true;
        }
        return false;
    }

    private getKey(currentLineValue: string, splitChar: string) {
        const lineArray = currentLineValue.split(splitChar);
        let key;
        const lastItem = lineArray[lineArray.length - 1];
        const maxLength = 32;
        if (lineArray.length > 1 && lastItem.trim() === lastItem) {
            if (lineArray.length === 2 && lineArray[0] === "" && lineArray[1].length < maxLength) {
                key = lineArray[1];
            } else {
                const preChar = lineArray[lineArray.length - 2].slice(-1);
                if (code160to32(preChar) === " " && lastItem.length < maxLength) {
                    key = lastItem;
                }
            }
        }
        return key;
    }
}
