import {CDN_PATH} from "../constants";

export const emojiRender = (text: string) => {
    const imgEmoji = ["c", "d", "doge", "e50a", "f", "g", "huaji", "i",
        "j", "k", "octocat", "r", "trollface", "u", "hacpai"];
    imgEmoji.map((emoji) => {
        const suffix = emoji === "huaji" ? "gif" : "png";
        text = text.replace(new RegExp(`:${emoji}:`, "g"),
            `<img alt="${emoji}" class="emoji" src="${CDN_PATH}/vditor/dist/images/emoji/${emoji}.${suffix}"
 title="${emoji}">`);
    });
    return text;
};
