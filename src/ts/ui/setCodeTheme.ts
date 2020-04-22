import {Constants} from "../constants";
import {addStyle} from "../util/addStyle";

export const setCodeTheme = (codeTheme: string, cdn: string) => {
    if (!Constants.CODE_THEME.includes(codeTheme)) {
        codeTheme = "github";
    }
    const vditorHljsStyle = document.getElementById("vditorHljsStyle") as HTMLLinkElement;
    const href = `${cdn}/dist/js/highlight.js/styles/${codeTheme}.css`;
    if (vditorHljsStyle && vditorHljsStyle.href !== href) {
        vditorHljsStyle.remove();
    }
    addStyle(`${cdn}/dist/js/highlight.js/styles/${codeTheme}.css`, "vditorHljsStyle");
};
