export const emojiRender = (text: string, customEmoji: { [key: string]: string }) => {
    const imgEmoji = Object.keys(customEmoji);
    imgEmoji.map((emoji) => {
        if (customEmoji[emoji].indexOf("//") > -1) {
            text = text.replace(new RegExp(`:${emoji}:`, "g"),
                `<img alt="${emoji}" class="emoji" src="${customEmoji[emoji]}"
 title="${emoji}">`);
        } else {
            text = text.replace(new RegExp(`:${emoji}:`, "g"), customEmoji[emoji]);
        }
    });
    return text;
};
