import {Constants} from "../constants";
import {addStyle} from "../util/addStyle";

export const setContentTheme = (contentTheme: string, cdn: string) => {
    if (!Constants.CONTENT_THEME.includes(contentTheme) || contentTheme === "light") {
        return;
    }
    const vditorContentTheme = document.getElementById("vditorContentTheme") as HTMLLinkElement;
    const href = `${cdn}/dist/js/highlight.js/styles/${contentTheme}.css`;
    if (vditorContentTheme && vditorContentTheme.href !== href) {
        vditorContentTheme.remove();
    }
    addStyle(`${cdn}/dist/js/highlight.js/styles/${contentTheme}.css`, "vditorContentTheme");
};
