import {getCursorPosition} from "./getCursorPosition";
import {insertText} from "../editor/insertText";
import {inputEvent} from "../editor/inputEvent";

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
        const currentLineValue = window.getSelection().focusNode.textContent.substring(0, window.getSelection().anchorOffset);
        const atKey = this.getKey(currentLineValue, "@");
        const emojiKey = this.getKey(currentLineValue, ":");

        if (atKey === undefined && emojiKey === undefined) {
            this.element.style.display = "none";
            clearTimeout(this.timeId);
        } else {
            if (atKey !== undefined && this.vditor.options.hint.at) {
                clearTimeout(this.timeId);
                this.timeId = window.setTimeout(() => {
                    this.genHTML(this.vditor.options.hint.at(atKey), atKey);
                }, this.vditor.options.hint.delay);
            }
            if (emojiKey !== undefined) {
                import(/* webpackChunkName: "allEmoji" */ "../emoji/allEmoji")
                    .then((allEmoji) => {
                        const emojiHint = emojiKey === "" ? this.vditor.options.hint.emoji : allEmoji.getAllEmoji(this.vditor.options.hint.emojiPath);
                        const matchEmojiData: IHintData[] = [];
                        Object.keys(emojiHint).forEach((key) => {
                            if (key.indexOf(emojiKey.toLowerCase()) === 0) {
                                if (emojiHint[key].indexOf(".") > -1) {
                                    matchEmojiData.push({
                                        html: `<img src="${emojiHint[key]}" title=":${key}:"/> :${key}:`,
                                        value: `:${key}:`,
                                    });
                                } else {
                                    matchEmojiData.push({
                                        html: `<span class="vditor-hint__emoji">${emojiHint[key]}</span>${key}`,
                                        value: emojiHint[key],
                                    });
                                }
                            }
                        });
                        this.genHTML(matchEmojiData, emojiKey);
                    })
                    .catch((err) => {
                        console.error("Failed to load emoji", err);
                    });
            }
        }
    }

    private getKey(currentLineValue: string, splitChar: string) {
        if (!String.prototype.trim) {
            String.prototype.trim = function () {
                return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
            };
        }

        const lineArray = currentLineValue.split(splitChar);

        let key;
        if (lineArray.length > 1) {
            if (lineArray.length === 2 && lineArray[0] === "") {
                if ((lineArray[1] === "" || lineArray[1].trim() !== "") &&
                    lineArray[1].indexOf(" ") === -1 &&
                    lineArray[1].length < 33) {
                    key = lineArray[1];
                }
            } else {
                const prefAt = lineArray[lineArray.length - 2];
                const currentAt = lineArray.slice(-1).pop();
                if (prefAt.slice(-1) === " " && currentAt.indexOf(" ") === -1 &&
                    ((currentAt === "" || currentAt.trim() !== "") &&
                        currentAt.length < 33)) {
                    key = currentAt;
                }
            }
        }
        return key;
    }

    private genHTML(data: IHintData[], key: string) {
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
        this.element.style.top = `${y}px`;
        this.element.style.left = `${x}px`;
        this.element.style.display = "block";

        this.element.querySelectorAll("li").forEach((element) => {
            element.addEventListener("click", () => {
                this.element.style.display = "none";

                const value = element.getAttribute("data-value");
                const splitChar = value.indexOf("@") === 0 ? "@" : ":";

                const range = this.vditor.editor.range;
                range.setStart(range.startContainer, range.commonAncestorContainer.textContent.substr(0, range.startOffset).lastIndexOf(splitChar))
                insertText(value, "", true, true, range);
                inputEvent(this.vditor)
            });
        });
        // hint 展现在上部
        if (this.element.getBoundingClientRect().bottom > window.innerHeight) {
            this.element.style.top = `${y - this.element.offsetHeight}px`;
        }
    }
}
