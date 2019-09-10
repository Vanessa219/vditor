import {CDN_PATH} from "../constants";
import {addStyle} from "../util/addStyle";

export const highlightRender = async (hljsStyle: string, enableHighlight: boolean,
                                      element: HTMLElement | Document = document) => {
    if (!enableHighlight) {
        return;
    }

    const hljsThemes = ["a11y-dark", "a11y-light", "agate", "an-old-hope", "androidstudio", "arduino-light", "arta",
        "ascetic", "atelier-cave-dark", "atelier-cave-light", "atelier-dune-dark", "atelier-dune-light", "school-book",
        "atelier-estuary-dark", "atelier-estuary-light", "atelier-forest-dark", "atelier-forest-light", "pojoaque",
        "atelier-heath-dark", "atelier-heath-light", "atelier-lakeside-dark", "atelier-lakeside-light", "zenburn",
        "atelier-plateau-dark", "atelier-plateau-light", "atelier-savanna-dark", "atelier-savanna-light",
        "atelier-seaside-dark", "atelier-seaside-light", "atelier-sulphurpool-dark", "atelier-sulphurpool-light",
        "atom-one-dark", "atom-one-dark-reasonable", "atom-one-light", "brown-paper", "brown-papersq", "codepen-embed",
        "color-brewer", "darcula", "dark", "darkula", "default", "docco", "dracula", "far", "foundation", "github",
        "github-gist", "gml", "googlecode", "grayscale", "gruvbox-dark", "gruvbox-light", "hopscotch", "hybrid", "idea",
        "ir-black", "isbl-editor-dark", "isbl-editor-light", "kimbie.dark", "kimbie.light", "lightfair", "magula",
        "mono-blue", "monokai", "monokai-sublime", "nord", "obsidian", "ocean", "paraiso-dark", "paraiso-light",
        "pojoaque", "purebasic", "qtcreator_dark", "qtcreator_light", "railscasts", "rainbow", "routeros", "tomorrow",
        "school-book", "shades-of-purple", "solarized-dark", "solarized-light", "sunburst", "tomorrow-night",
        "tomorrow-night-blue", "tomorrow-night-bright", "tomorrow-night-eighties", "vs", "vs2015", "xcode", "xt256"];

    const codes = element.querySelectorAll("pre > code");
    if (codes.length === 0) {
        return;
    }

    if (hljsThemes.includes(hljsStyle)) {
        addStyle(`${CDN_PATH}/vditor/dist/js/highlight.js/styles/${hljsStyle}.css`,
            "vditorHljsStyle");
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
