import copySVG from "../../assets/icons/copy.svg";
import {CDN_PATH} from "../constants";
import {i18n} from "../i18n";
import {addStyle} from "../util/addStyle";
import {code160to32} from "../util/code160to32";

export const mathRenderByLute = (element: HTMLElement, lang: (keyof II18nLang) = "zh_CN") => {
    const mathElements = element.querySelectorAll("vditor-math")

    if (!mathElements) {
        return
    }
    import(/* webpackChunkName: "katex" */ "katex").then((katex) => {
        addStyle(`${CDN_PATH}/vditor/dist/js/katex/katex.min.css`, "vditorKatexStyle");
        mathElements.forEach((mathElement) => {
            const a = katex.renderToString(mathElement.textContent, mathElement, {
                throwOnError: false
            });
            const b = katex.render(mathElement.textContent, mathElement, {
                displayMode: mathElement.tagName === 'DIV',
                output: 'html',
                errorColor: 'red'
            });

            `<div class="vditor-copy" style="position: absolute">
<textarea>${mathElement.textContent}</textarea>
<span aria-label="${i18n[lang].copy}" style="top: 2px;right: -20px"
onmouseover="this.setAttribute('aria-label', '${i18n[lang].copy}')" class="vditor-tooltipped vditor-tooltipped__w"
onclick="this.previousElementSibling.select();document.execCommand('copy');` +
            `this.setAttribute('aria-label', '${i18n[lang].copied}')">${copySVG}</span></div>`
        })
    });
};
