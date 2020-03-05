import copySVG from "../../assets/icons/copy.svg";
import {i18n} from "../i18n/index";
import {code160to32} from "../util/code160to32";

export const codeRender = (element: HTMLElement, lang: (keyof II18nLang) = "zh_CN") => {
    element.querySelectorAll("pre > code").forEach((e: HTMLElement, index: number) => {
        if (e.classList.contains("language-mermaid") || e.classList.contains("language-echarts")
            || e.classList.contains("language-abc") || e.classList.contains("language-graphviz")) {
            return;
        }

        if (e.style.maxHeight.indexOf("px") > -1) {
            return;
        }

        // 避免预览区在渲染后由于代码块过多产生性能问题 https://github.com/b3log/vditor/issues/67
        if (element.classList.contains("vditor-preview") && index > 5) {
            return;
        }

        const divElement = document.createElement("div");
        divElement.className = "vditor-copy";
        divElement.innerHTML = `<span aria-label="${i18n[lang].copy}"
onmouseover="this.setAttribute('aria-label', '${i18n[lang].copy}')"
class="vditor-tooltipped vditor-tooltipped__w"
onclick="this.previousElementSibling.select();document.execCommand('copy');` +
            `this.setAttribute('aria-label', '${i18n[lang].copied}')">${copySVG}</span>`;
        const textarea = document.createElement("textarea");
        textarea.value = code160to32(e.innerText);
        divElement.insertAdjacentElement("afterbegin", textarea);

        e.before(divElement);
        e.style.maxHeight = (window.outerHeight - 40) + "px";
    });
};
