export const setLute = (options: ILuteOptions) => {
    const lute: ILute = Lute.New();
    lute.PutEmojis(options.emojis);
    lute.SetEmojiSite(options.emojiSite);
    lute.SetHeadingAnchor(options.headingAnchor);
    lute.SetInlineMathAllowDigitAfterOpenMarker(options.inlineMathDigit);
    lute.SetAutoSpace(options.autoSpace);
    lute.SetToC(options.toc);
    lute.SetFootnotes(options.footnotes);
    lute.SetChinesePunct(options.chinesePunct);
    lute.SetFixTermTypo(options.fixTermTypo);
    return lute;
};
