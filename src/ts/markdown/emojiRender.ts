import {CDN_PATH} from "../constants";

export const emojiRender = (text: string, customEmoji: { [key: string]: string }) => {
    const imgEmoji = ["b3log", "chainbook", "doge", "hacpai", "huaji", "latke", "pipe", "solo",
        "sym", "vditor", "octocat", "wide", "trollface", ...Object.keys(customEmoji)];
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
