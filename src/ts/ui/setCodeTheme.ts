import {Constants} from "../constants";
import {addStyle} from "../util/addStyle";

export const setCodeTheme = (codeTheme: string, highlightPath: string = Constants.STATIC_PATH.highlight) => {
    if (!Constants.CODE_THEME.includes(codeTheme)) {
        codeTheme = "github";
    }
    const vditorHljsStyle = document.getElementById("vditorHljsStyle") as HTMLLinkElement;
    const href = `${highlightPath}/styles/${codeTheme}.css`;
    if (!vditorHljsStyle) {
        addStyle(href, "vditorHljsStyle");
    } else if (vditorHljsStyle.href !== href) {
        vditorHljsStyle.remove();
        addStyle(href, "vditorHljsStyle");
    }
};
