import copySVG from "../../assets/icons/copy.svg";
import {CDN_PATH} from "../constants";
import {i18n} from "../i18n";
import {addStyle} from "../util/addStyle";
import {code160to32} from "../util/code160to32";

export const mathRender = (element: HTMLElement, lang: (keyof II18nLang) = "zh_CN") => {
    const text = code160to32(element.innerText);
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

                    element.querySelectorAll(".katex-html").forEach((e: HTMLElement, index: number) => {
                        if (e.querySelector(".vditor-copy")) {
                            return;
                        }
                        const copyHTML = `<div class="vditor-copy" style="position: absolute">
<textarea>${e.previousElementSibling.querySelector("annotation").textContent}</textarea>
<span aria-label="${i18n[lang].copy}" style="top: 2px;right: -20px"
onmouseover="this.setAttribute('aria-label', '${i18n[lang].copy}')" class="vditor-tooltipped vditor-tooltipped__w"
onclick="this.previousElementSibling.select();document.execCommand('copy');` +
                            `this.setAttribute('aria-label', '${i18n[lang].copied}')">${copySVG}</span></div>`;
                        e.insertAdjacentHTML("beforeend", copyHTML);
                    });
                });
        });
    }
};
