import {formatRender} from "../editor/formatRender";
import {getSelectPosition} from "../editor/getSelectPosition";
import {getText} from "../editor/getText";
import {selectIsEditor} from "../editor/selectIsEditor";
import {code160to32} from "../util/code160to32";
import {getCursorPosition} from "./getCursorPosition";

export class Hint {
    public timeId: number;
    public vditor: IVditor;
    public element: HTMLUListElement;

    constructor(vditor: IVditor) {
        this.timeId = -1;
        this.vditor = vditor;

        this.element = document.createElement("ul");
        this.element.className = "vditor-hint";

        this.vditor.editor.element.parentElement.appendChild(this.element);
    }

    public render() {
        if (!window.getSelection().focusNode) {
            return;
        }
        const position = getSelectPosition(this.vditor.editor.element);
        const currentLineValue = getText(this.vditor.editor.element).substring(0, position.end).split("\n")
            .slice(-1).pop();

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
            if (isAt && this.vditor.options.hint.at) {
                clearTimeout(this.timeId);
                this.timeId = window.setTimeout(() => {
                    this.genHTML(this.vditor.options.hint.at(key), key, this.vditor.editor.element);
                }, this.vditor.options.hint.delay);
            }
            if (!isAt) {
                import(/* webpackChunkName: "allEmoji" */ "../emoji/allEmoji")
                    .then((allEmoji) => {
                        const emojiHint = key === "" ? this.vditor.options.hint.emoji : Object.assign(
                            allEmoji.getAllEmoji(this.vditor.options.hint.emojiPath), this.vditor.options.hint.emoji);
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
                        this.genHTML(matchEmojiData, key, this.vditor.editor.element);
                    })
                    .catch((err) => {
                        console.error("Failed to load emoji", err);
                    });
            }
        }
    }

    public fillEmoji = (element: HTMLElement) => {
        this.element.style.display = "none";

        const value = element.getAttribute("data-value");
        const splitChar = value.indexOf("@") === 0 ? "@" : ":";

        let range: Range = window.getSelection().getRangeAt(0);
        if (!selectIsEditor(this.vditor.editor.element, range)) {
            range = this.vditor.editor.range;
        }
        const position = getSelectPosition(this.vditor.editor.element, range);
        const text = getText(this.vditor.editor.element);
        const preText = text.substring(0, text.substring(0, position.start).lastIndexOf(splitChar));
        formatRender(this.vditor, preText + value + text.substring(position.start),
            {
                end: (preText + value).length,
                start: (preText + value).length,
            });
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

    private genHTML(data: IHintData[], key: string, editorElement: HTMLPreElement) {
        if (data.length === 0) {
            this.element.style.display = "none";
            return;
        }

        const textareaPosition = getCursorPosition(this.vditor.editor.element);
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
                this.fillEmoji(element);
            });
        });
        // hint 展现在上部
        if (this.element.getBoundingClientRect().bottom > window.innerHeight) {
            this.element.style.top = `${y - this.element.offsetHeight}px`;
        }
    }
}
