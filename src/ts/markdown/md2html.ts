import {VDITOR_VERSION} from "../constants";
import {addScript} from "../util/addScript";

declare const Lute: ILute;

export const loadLuteJs = async (vditor: IVditor | string) => {
    let cdn = `https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}`;
    if (typeof vditor === "string" && vditor) {
        cdn = vditor;
    } else if (typeof vditor === "object" && vditor.options.cdn) {
        cdn = vditor.options.cdn;
    }
    // addScript(`${cdn}/dist/js/lute/lute.min.js`, "vditorLuteScript");
    addScript(`http://192.168.0.107:9090/lute.min.js?${new Date().getTime()}`, "vditorLuteScript");

    if (vditor && typeof vditor === "object" && !vditor.lute) {
        vditor.lute = Lute.New();
        vditor.lute.PutEmojis(vditor.options.hint.emoji);
        vditor.lute.SetEmojiSite(vditor.options.hint.emojiPath);
        vditor.lute.SetParallelParsing(false);
        vditor.lute.SetInlineMathAllowDigitAfterOpenMarker(vditor.options.preview.inlineMathDigit);
    }
};

export const md2htmlByPreview = async (mdText: string, options?: IPreviewOptions) => {
    if (typeof Lute === "undefined") {
        await loadLuteJs(options && options.cdn);
    }
    options = Object.assign({
        emojiSite: `${(options && options.cdn) ||
        `https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}`}/dist/images/emoji`,
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
