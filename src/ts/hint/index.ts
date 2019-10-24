import {formatRender} from "../editor/formatRender";
import {getSelectPosition} from "../editor/getSelectPosition";
import {selectIsEditor} from "../editor/selectIsEditor";
import {code160to32} from "../util/code160to32";
import {getText} from "../util/getText";
import {getCursorPosition} from "./getCursorPosition";

export class Hint {
    public timeId: number;
    public element: HTMLUListElement;

    constructor() {
        this.timeId = -1;
        this.element = document.createElement("ul");
        this.element.className = "vditor-hint";
    }

    public render(vditor: IVditor) {
        if (!window.getSelection().focusNode) {
            return;
        }
        const position = getSelectPosition(vditor.currentMode === "wysiwyg" ?
            vditor.wysiwyg.element : vditor.editor.element);
        const currentLineValue = vditor.currentMode === "wysiwyg" ?
            getSelection().getRangeAt(0).startContainer.textContent.split("\n")[0] :
            getText(vditor.editor.element, vditor.currentMode).substring(0, position.end).split("\n").slice(-1).pop();

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
                    this.genHTML(vditor.options.hint.at(key), key,
                        vditor.currentMode === "wysiwyg" ?
                            vditor.wysiwyg.element : vditor.editor.element, vditor);
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
                this.genHTML(matchEmojiData, key, vditor.currentMode === "wysiwyg" ?
                    vditor.wysiwyg.element : vditor.editor.element, vditor);
            }
        }
    }

    public fillEmoji = (element: HTMLElement, vditor: IVditor) => {
        this.element.style.display = "none";

        const value = element.getAttribute("data-value");
        const splitChar = value.indexOf("@") === 0 ? "@" : ":";

        if (vditor.currentMode === "wysiwyg") {
            // TODO wysiwyg

        } else {
            let range: Range = window.getSelection().getRangeAt(0);
            if (!selectIsEditor(vditor.editor.element, range)) {
                range = vditor.editor.range;
            }
            const position = getSelectPosition(vditor.editor.element, range);
            const text = getText(vditor.editor.element, vditor.currentMode);
            const preText = text.substring(0, text.substring(0, position.start).lastIndexOf(splitChar));
            formatRender(vditor, preText + value + text.substring(position.start),
                {
                    end: (preText + value).length,
                    start: (preText + value).length,
                });
        }
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

    private genHTML(data: IHintData[], key: string, editorElement: HTMLElement, vditor: IVditor) {
        if (data.length === 0) {
            this.element.style.display = "none";
            return;
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
            hintsHTML += `<li data-value="${hintData.value} " class="${i || "vditor-hint--current"}"> ${html}</li>`;
        });

        this.element.innerHTML = hintsHTML;
        const lineHeight = parseInt(document.defaultView.getComputedStyle(editorElement, null)
            .getPropertyValue("line-height"), 10);
        this.element.style.top = `${y + (lineHeight || 22)}px`;
        this.element.style.left = `${x}px`;
        this.element.style.display = "block";

        this.element.querySelectorAll("li").forEach((element) => {
            element.addEventListener("click", () => {
                this.fillEmoji(element, vditor);
            });
        });
        // hint 展现在上部
        if (this.element.getBoundingClientRect().bottom > window.innerHeight) {
            this.element.style.top = `${y - this.element.offsetHeight}px`;
        }
    }
}
