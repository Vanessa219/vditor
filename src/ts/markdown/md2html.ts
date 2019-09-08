import {CDN_PATH, VDITOR_VERSION} from "../constants";

declare const Lute: ILute;

export const loadLuteJs = (vditor?: IVditor) => {
    const scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    // scriptElement.src = `http://localhost:9000/src/js/lute/lute.min.js`;
    scriptElement.src = `${CDN_PATH}/vditor@${VDITOR_VERSION}/dist/js/lute/lute.min.js`;
    document.getElementsByTagName("head")[0].appendChild(scriptElement);

    return new Promise((resolve) => {
        scriptElement.onload = () => {
            if (vditor && !vditor.lute) {
                vditor.lute = Lute.New();
                vditor.lute.PutEmojis(vditor.options.hint.emoji);
                vditor.lute.SetEmojiSite(vditor.options.hint.emojiPath);
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
    const md = await lute.MarkdownStr("", mdText);

    return md[1] || md[0];
};

export const md2htmlByVditor = async (mdText: string, vditor: IVditor) => {
    if (typeof Lute === "undefined") {
        await loadLuteJs();
    }
    if (!vditor.lute) {
        vditor.lute = Lute.New();
        vditor.lute.PutEmojis(vditor.options.hint.emoji);
        vditor.lute.SetEmojiSite(vditor.options.hint.emojiPath);
    }
    const md = await vditor.lute.MarkdownStr("", mdText);

    return md[1] || md[0];
};
