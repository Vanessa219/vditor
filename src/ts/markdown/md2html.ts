import {CDN_PATH, VDITOR_VERSION} from "../constants";

declare const Lute: ILute;

export const loadLuteJs = () => {
    const scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    scriptElement.src = `http://localhost:9000/src/js/lute/lute.min.js`;
    // TODO scriptElement.src = `${CDN_PATH}/vditor@${VDITOR_VERSION}/dist/js/lute/lute.min.js`;
    document.getElementsByTagName("head")[0].appendChild(scriptElement);

    return new Promise((resolve) => {
        scriptElement.onload = () => {
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

    const lute: ILute = Lute.New({
            emojiSite: options.emojiPath,
            emojis: options.customEmoji,
        });

    const md = await lute.MarkdownStr("", mdText);

    return md[1] || md[0];
};

export const md2htmlByVditor = async (mdText: string, vditor: IVditor) => {
    if (typeof Lute === "undefined") {
        await loadLuteJs();
    }
    if (!vditor.lute) {
        vditor.lute = Lute.New({
            emojiSite: vditor.options.hint.emojiPath,
            emojis: vditor.options.hint.emoji,
        });
    }

    const md = await vditor.lute.MarkdownStr("", mdText);

    return md[1] || md[0];
};
