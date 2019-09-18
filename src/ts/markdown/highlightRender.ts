import {CDN_PATH, VDITOR_VERSION} from "../constants";
import {addStyle} from "../util/addStyle";

export const highlightRender = async (hljsStyle: string, enableHighlight: boolean,
                                      element: HTMLElement | Document = document) => {

    const hljsThemes = ["abap", "algol", "algol_nu", "arduino", "autumn", "borland", "bw", "colorful", "dracula",
        "emacs", "friendly", "fruity", "github", "igor", "lovelace", "manni", "monokai", "monokailight", "murphy",
        "native", "paraiso-dark", "paraiso-light", "pastie", "perldoc", "pygments", "rainbow_dash", "rrt",
        "solarized-dark", "solarized-dark256", "solarized-light", "swapoff", "tango", "trac", "vim", "vs", "xcode"];

    if (!hljsThemes.includes(hljsStyle)) {
        hljsStyle = 'github'
    }
    addStyle(`${CDN_PATH}/vditor@${VDITOR_VERSION}/dist/js/highlight.js/styles/${hljsStyle}.css`,
        "vditorHljsStyle");

    if (!enableHighlight) {
        return;
    }

    const codes = element.querySelectorAll("pre > code");
    if (codes.length === 0) {
        return;
    }

    const {default: hljs} = await import(/* webpackChunkName: "highlight.js" */ "highlight.js");
    element.querySelectorAll("pre > code").forEach((block) => {
        if (block.className.indexOf("language-mermaid") > -1 ||
            block.className.indexOf("language-abc") > -1 ||
            block.className.indexOf("language-echarts") > -1) {
            return;
        }
        hljs.highlightBlock(block);
    });
};
