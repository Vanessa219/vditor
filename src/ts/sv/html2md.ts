import {setHeaders} from "../upload/setHeaders";
import {processPasteCode} from "../util/processCode";
import {setSelectionFocus} from "../util/selection";
import {insertText} from "./insertText";

const setSelectionByInlineText = (text: string, childNodes: NodeListOf<ChildNode>) => {
    let offset = 0;
    let startIndex = 0;
    Array.from(childNodes).some((node: HTMLElement, index: number) => {
        startIndex = node.textContent.indexOf(text);
        if (startIndex > -1 && childNodes[index].childNodes[0].nodeType === 3) {
            offset = index;
            return true;
        }
    });
    if (startIndex < 0) {
        return;
    }
    const range = document.createRange();
    range.setStart(childNodes[offset].childNodes[0], startIndex);
    range.setEnd(childNodes[offset].childNodes[0], startIndex + text.length);
    setSelectionFocus(range);
};

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
                                if (xhr.status === 200) {
                                    const responseJSON = JSON.parse(xhr.responseText);
                                    if (responseJSON.code !== 0) {
                                        vditor.tip.show(responseJSON.msg);
                                        return;
                                    }
                                    const original = responseJSON.data.originalURL;
                                    setSelectionByInlineText(original, vditor.sv.element.childNodes);
                                    insertText(vditor, responseJSON.data.url, "", true);
                                } else {
                                    vditor.tip.show(xhr.responseText);
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
