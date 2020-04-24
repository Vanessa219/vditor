import {Constants, VDITOR_VERSION} from "../constants";
import {addStyle} from "../util/addStyle";

export const setContentTheme = (contentTheme: string,
                                cdn = `https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}`) => {
    if (!Constants.CONTENT_THEME.includes(contentTheme)) {
        return;
    }
    const vditorContentTheme = document.getElementById("vditorContentTheme") as HTMLLinkElement;
    const href = `${cdn}/dist/css/content-theme/${contentTheme}.css`;
    if (contentTheme === "light") {
        if (vditorContentTheme) {
            vditorContentTheme.remove();
        }
        return;
    }
    if (!vditorContentTheme) {
        addStyle(href, "vditorContentTheme");
    } else if (vditorContentTheme.href !== href) {
        vditorContentTheme.remove();
        addStyle(href, "vditorContentTheme");
    }
};
