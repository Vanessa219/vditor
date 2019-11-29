import {CDN_PATH, VDITOR_VERSION} from "../constants";

declare const Lute: ILute;

export const loadLuteJs = (vditor?: IVditor) => {
    const scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    // scriptElement.src = `${CDN_PATH}/vditor@${VDITOR_VERSION}/dist/js/lute/lute.min.js`;
    scriptElement.src = `http://192.168.0.107:9090/lute.min.js?${new Date().getTime()}`;
    document.getElementsByTagName("head")[0].appendChild(scriptElement);

    return new Promise((resolve) => {
        scriptElement.onload = () => {
            if (vditor && !vditor.lute) {
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
        await loadLuteJs();
    }
    options = Object.assign({
        emojiSite: `${CDN_PATH}/vditor/dist/images/emoji`,
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
        await loadLuteJs();
    }
    return vditor.lute.Md2HTML(mdText);
};
