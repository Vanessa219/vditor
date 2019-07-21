import {CDN_PATH, VDITOR_VERSION} from "../constants";
import {addStyle} from "../util/addStyle";

export const mathRender = (element: HTMLElement) => {
    const text = element.innerText;
    if (text.split("$").length > 2 || (text.split("\\(").length > 1 && text.split("\\)").length > 1)) {
        import(/* webpackChunkName: "katex" */ "katex").then(() => {
            import(/* webpackChunkName: "katex" */ "katex/contrib/auto-render/auto-render")
                .then((renderMathInElement) => {
                    addStyle(`${CDN_PATH}/vditor/dist/js/katex/katex.min.css`,
                        "vditorKatexStyle");
                    renderMathInElement.default(element, {
                        delimiters: [
                            {left: "$$", right: "$$", display: true},
                            {left: "\\(", right: "\\)", display: false},
                            {left: "$", right: "$", display: false},
                        ],
                    });
                });
        });
    }
};
