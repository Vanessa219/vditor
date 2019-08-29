import {CDN_PATH} from "../constants";

export const emojiRender = (text: string, customEmoji: { [key: string]: string }) => {
    const imgEmoji = Object.assign(["c", "d", "doge", "e50a", "f", "g", "huaji", "i",
        "j", "k", "octocat", "r", "trollface", "u", "hacpai"], Object.keys(customEmoji));
    imgEmoji.map((emoji) => {
        if (emoji in customEmoji) {
            if (customEmoji[emoji].indexOf("//") > -1) {
                text = text.replace(new RegExp(`:${emoji}:`, "g"),
                    `<img alt="${emoji}" class="emoji" src="${customEmoji[emoji]}"
 title="${emoji}">`);
            }
        } else {
            const suffix = emoji === "huaji" ? "gif" : "png";
            text = text.replace(new RegExp(`:${emoji}:`, "g"),
                `<img alt="${emoji}" class="emoji" src="${CDN_PATH}/vditor/dist/images/emoji/${emoji}.${suffix}"
 title="${emoji}">`);
        }

    });
    return text;
};
