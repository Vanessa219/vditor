import {addStyle} from "../util/addStyle";

export const setContentTheme = (contentTheme: string, themes: IObject) => {
    const vditorContentTheme = document.getElementById("vditorContentTheme") as HTMLLinkElement;
    if (contentTheme === "light") {
        if (vditorContentTheme) {
            vditorContentTheme.remove();
        }
        return;
    }
    let cssPath = themes[contentTheme];
    if (!cssPath) {
        cssPath = `${cssPath}/dist/css/content-theme/${contentTheme}.css`;
    }
    if (!vditorContentTheme) {
        addStyle(cssPath, "vditorContentTheme");
    } else if (vditorContentTheme.href !== cssPath) {
        vditorContentTheme.remove();
        addStyle(cssPath, "vditorContentTheme");
    }
};
