import copySVG from "../../assets/icons/copy.svg";
import {i18n} from "../i18n/index";

export const codeRender = (element: HTMLElement, lang: (keyof II18nLang)) => {
    element.querySelectorAll("pre > code").forEach((e: HTMLElement) => {
        if (e.className.indexOf("language-mermaid") > -1) {
            return;
        }

        if (e.style.maxHeight.indexOf("px") > -1) {
            return;
        }

        const divElement = document.createElement("div");
        divElement.className = "vditor-copy";
        divElement.innerHTML = `<textarea>${e.innerText}</textarea><span aria-label="${i18n[lang].copy}"
onmouseover="this.setAttribute('aria-label', '${i18n[lang].copy}')"
class="vditor-tooltipped vditor-tooltipped__w"
onclick="this.previousElementSibling.select();document.execCommand('copy');` +
            `this.setAttribute('aria-label', '${i18n[lang].copied}')">${copySVG}</span>`;

        e.before(divElement);
        e.style.maxHeight = (window.outerHeight - 40) + "px";
    });
};
