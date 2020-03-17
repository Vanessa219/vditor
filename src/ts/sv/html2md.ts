import {setHeaders} from "../upload/setHeaders";
import {processPasteCode} from "../util/processPasteCode";
import {insertText} from "./insertText";
import {setSelectionByInlineText} from "./setSelection";

// 直接使用 API 或 setOriginal 时不需要对图片进行服务器上传，直接转换。
// 目前使用 textPlain 判断是否来自 API 或 setOriginal
export const html2md = (vditor: IVditor, textHTML: string, textPlain?: string) => {
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

    vditor.lute.SetJSRenderers({
        renderers: {
            HTML2Md: {
                renderLinkDest: (node) => {
                    const src = node.TokensStr();
                    if (node.__internal_object__.Parent.Type === 34 && src && src.indexOf("file://") === -1
                        && vditor.options.upload.linkToImgUrl && typeof textPlain !== "undefined") {
                        const xhr = new XMLHttpRequest();
                        xhr.open("POST", vditor.options.upload.linkToImgUrl);
                        setHeaders(vditor, xhr);
                        xhr.onreadystatechange = () => {
                            if (xhr.readyState === XMLHttpRequest.DONE) {
                                const responseJSON = JSON.parse(xhr.responseText);
                                if (xhr.status === 200) {
                                    if (responseJSON.code !== 0) {
                                        vditor.tip.show(responseJSON.msg);
                                        return;
                                    }
                                    const original = responseJSON.data.originalURL;
                                    setSelectionByInlineText(original, vditor.sv.element.childNodes);
                                    insertText(vditor, responseJSON.data.url, "", true);
                                } else {
                                    vditor.tip.show(responseJSON.msg);
                                }
                            }
                        };
                        xhr.send(JSON.stringify({url: src}));
                    }
                    return [node.TokensStr(), Lute.WalkStop];
                },
            },
        },
    });
    return vditor.lute.HTML2Md(textHTML);
};
