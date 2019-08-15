import {insertText} from "./insertText";
import {setSelectionByInlineText} from "./setSelection";
import {gfm} from "./turndown-plugin-gfm";

export const html2md = async (vditor: IVditor, textHTML: string, textPlain?: string) => {
    const {default: TurndownService} = await import(/* webpackChunkName: "turndown" */ "turndown");

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
            if (!target.getAttribute("src")) {
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
                            setSelectionByInlineText(original, vditor.editor.element.childNodes);
                            insertText(vditor, responseJSON.data.url, "", true);
                        } else {
                            vditor.tip.show(responseJSON.msg);
                        }
                    }
                };
                xhr.send(JSON.stringify({url: target.getAttribute("src")}));
            }

            return `![${target.getAttribute("alt")}](${target.getAttribute("src")})`;
        },
    });

    turndownService.use(gfm);

    const markdownStr = turndownService.turndown(textHTML);

    // process copy from IDE
    const tempElement = document.createElement("div");
    tempElement.innerHTML = textHTML;
    const pres = tempElement.querySelectorAll("pre");
    if (pres.length === 1 && pres[0].className !== "vditor-textarea" && !pres[0].nextElementSibling
        && ((pres[0].previousElementSibling && pres[0].previousElementSibling.tagName === "META")
            || !pres[0].previousElementSibling)) {
        return "```\n" + (textPlain || textHTML) + "\n```";
    } else {
        return markdownStr;
    }
};
