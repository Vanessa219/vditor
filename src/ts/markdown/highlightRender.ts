import {CDN_PATH} from "../constants";
import {addStyle} from "../util/addStyle";

export const highlightRender = (hljsStyle: string, enableHighlight: boolean) => {
    if (enableHighlight) {
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

    if (hljsThemes.includes(hljsStyle) && enableHighlight) {
        addStyle(`${CDN_PATH}/vditor/dist/js/highlight.js/styles/${hljsStyle}.css`,
            "vditorHljsStyle");
    }

    //     const {default: hljs} = await import(/* webpackChunkName: "highlight.js" */ "highlight.js");
    //     options.highlight = (str: string, lang: string) => {
    //         if (lang === "mermaid" || lang === "echarts" || lang === "abc") {
    //             return str;
    //         }
    //         if (lang && hljs.getLanguage(lang)) {
    //   return `<pre><code class="language-${lang} hljs">${hljs.highlight(lang, str, true).value}</code></pre>`;
    //         }
    //         return `<pre><code class="hljs">${hljs.highlightAuto(str).value}</code></pre>`;
    //     };
    // }
};
