import {CDN_PATH, VDITOR_VERSION} from "../constants";

declare const Lute: ILute;

export const loadLuteJs = (vditor: IVditor | string) => {
    const scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    let cdn = CDN_PATH
    if (typeof vditor === "string" && vditor) {
        cdn = vditor;
    } else if (typeof vditor === "object" && vditor.options.cdn) {
        cdn = vditor.options.cdn;
    }
    scriptElement.src = `${cdn}/vditor@${VDITOR_VERSION}/dist/js/lute/lute.min.js`;

    // scriptElement.src = `http://192.168.0.107:9090/lute.min.js?${new Date().getTime()}`;
    document.getElementsByTagName("head")[0].appendChild(scriptElement);

    return new Promise((resolve) => {
        scriptElement.onload = () => {
            if (vditor && typeof vditor === "object" && !vditor.lute) {
                vditor.lute = Lute.New();
                vditor.lute.PutEmojis(vditor.options.hint.emoji);
                vditor.lute.SetEmojiSite(vditor.options.hint.emojiPath);
                vditor.lute.SetParallelParsing(false);
                vditor.lute.SetInlineMathAllowDigitAfterOpenMarker(vditor.options.preview.inlineMathDigit);
            }
            resolve();
        };
    });
};

export const md2htmlByPreview = async (mdText: string, options?: IPreviewOptions) => {
    if (typeof Lute === "undefined") {
        await loadLuteJs(options && options.cdn);
    }
    options = Object.assign({
        emojiSite: `${(options && options.cdn) || CDN_PATH}/vditor@${VDITOR_VERSION}/dist/images/emoji`,
        emojis: {},
    }, options);

    const lute: ILute = Lute.New();
    lute.PutEmojis(options.customEmoji);
    lute.SetEmojiSite(options.emojiPath);
    lute.SetHeadingAnchor(options.anchor);
    lute.SetParallelParsing(false);
    lute.SetInlineMathAllowDigitAfterOpenMarker(options.inlineMathDigit);
    return lute.Md2HTML(mdText);
};

export const md2htmlByVditor = async (mdText: string, vditor: IVditor) => {
    if (typeof vditor.lute === "undefined") {
        await loadLuteJs(vditor.options.cdn);
    }
    return vditor.lute.Md2HTML(mdText);
};
