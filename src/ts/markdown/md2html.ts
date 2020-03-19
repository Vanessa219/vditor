import {VDITOR_VERSION} from "../constants";
import {addScript} from "../util/addScript";

export const loadLuteJs = (vditor: IVditor | string) => {
    let cdn = `https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}`;
    if (typeof vditor === "string" && vditor) {
        cdn = vditor;
    } else if (typeof vditor === "object" && vditor.options.cdn) {
        cdn = vditor.options.cdn;
    }
    addScript(`${cdn}/dist/js/lute/lute.min.js`, "vditorLuteScript");
    // addScript(`/src/js/lute/lute.min.js`, "vditorLuteScript");
    // addScript(`http://192.168.2.248:9090/lute.min.js?${new Date().getTime()}`, "vditorLuteScript");

    if (vditor && typeof vditor === "object" && !vditor.lute) {
        vditor.lute = Lute.New();
        vditor.lute.PutEmojis(vditor.options.hint.emoji);
        vditor.lute.SetEmojiSite(vditor.options.hint.emojiPath);
        vditor.lute.SetInlineMathAllowDigitAfterOpenMarker(vditor.options.preview.math.inlineDigit);
        vditor.lute.SetAutoSpace(vditor.options.preview.markdown.autoSpace);
        vditor.lute.SetToC(vditor.options.preview.markdown.toc);
        vditor.lute.SetFootnotes(vditor.options.preview.markdown.footnotes);
        vditor.lute.SetChinesePunct(vditor.options.preview.markdown.chinesePunct);
        vditor.lute.SetFixTermTypo(vditor.options.preview.markdown.fixTermTypo);
    }
};

export const md2htmlByPreview = (mdText: string, options?: IPreviewOptions) => {
    if (typeof Lute === "undefined") {
        loadLuteJs(options && options.cdn);
    }
    options = Object.assign({
        emojiSite: `${(options && options.cdn) ||
        `https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}`}/dist/images/emoji`,
        emojis: {},
    }, options);
    options.math = Object.assign({}, {
        engine: "KaTeX",
        inlineDigit: false,
        macros: {},
    }, options.math);
    options.markdown = Object.assign({}, {
        autoSpace: false,
        chinesePunct: false,
        fixTermTypo: false,
        footnotes: true,
        toc: false,
    }, options.markdown);

    const lute: ILute = Lute.New();
    lute.PutEmojis(options.customEmoji);
    lute.SetEmojiSite(options.emojiPath);
    lute.SetHeadingAnchor(options.anchor);
    lute.SetInlineMathAllowDigitAfterOpenMarker(options.math.inlineDigit);
    lute.SetAutoSpace(options.markdown.autoSpace);
    lute.SetToC(options.markdown.toc);
    lute.SetFootnotes(options.markdown.footnotes);
    lute.SetChinesePunct(options.markdown.chinesePunct);
    lute.SetFixTermTypo(options.markdown.fixTermTypo);
    return lute.Md2HTML(mdText);
};

export const md2htmlByVditor = (mdText: string, vditor: IVditor) => {
    if (typeof vditor.lute === "undefined") {
        loadLuteJs(vditor.options.cdn);
    }
    return vditor.lute.Md2HTML(mdText);
};
