import {addScript} from "../util/addScript";
import {processPasteCode} from "../util/processPasteCode";
import {insertText} from "./insertText";
import {setSelectionByInlineText} from "./setSelection";
import {gfm} from "./turndown-plugin-gfm";

declare const TurndownService: {
    prototype: {
        escape(name: string): string;
    }
    new({}): ITurndown,
};

export const html2md = async (vditor: IVditor, textHTML: string, textPlain?: string) => {
    // process word
    const doc = new DOMParser().parseFromString(textHTML, "text/html");
    if (doc.body) {
        textHTML = doc.body.innerHTML;
    }

    // process copy from IDE
    const code = processPasteCode(textHTML, textPlain);

    if (code) {
        return code;
    }

    await addScript(`${vditor.options.cdn}/dist/js/turndown/turndown.js`,
        "vditorTurndownScript");

    // no escape
    TurndownService.prototype.escape = (name: string) => {
        return name;
    };

    const turndownService = new TurndownService({
        blankReplacement: (blank: string) => {
            return blank;
        },
        codeBlockStyle: "fenced",
        emDelimiter: "*",
        headingStyle: "atx",
        hr: "---",
    });

    turndownService.addRule("vditorImage", {
        filter: "img",
        replacement: (content: string, target: HTMLElement) => {
            const src = target.getAttribute("src");
            if (!src || src.indexOf("file://") === 0) {
                return "";
            }
            // 直接使用 API 或 setOriginal 时不需要对图片进行服务器上传，直接转换。
            // 目前使用 textPlain 判断是否来自 API 或 setOriginal
            if (vditor.options.upload.linkToImgUrl && textPlain) {
                const xhr = new XMLHttpRequest();
                xhr.open("POST", vditor.options.upload.linkToImgUrl);
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        const responseJSON = JSON.parse(xhr.responseText);
                        if (xhr.status === 200) {
                            if (responseJSON.code !== 0) {
                                alert(responseJSON.msg);
                                return;
                            }
                            const original = responseJSON.data.originalURL;
                            // TODO wysiwyg
                            setSelectionByInlineText(original, vditor.editor.element.childNodes);
                            insertText(vditor, responseJSON.data.url, "", true);
                        } else {
                            vditor.tip.show(responseJSON.msg);
                        }
                    }
                };
                xhr.send(JSON.stringify({url: src}));
            }

            return `![${target.getAttribute("alt")}](${src})`;
        },
    });

    turndownService.use(gfm);

    // TODO return vditor.lute.HTML2Md(textHTML);
    return turndownService.turndown(textHTML);
};
