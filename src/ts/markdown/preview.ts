import {abcRender} from "./abcRender";
import {chartRender} from "./chartRender";
import {codeRender} from "./codeRender";
import {mathRender} from "./mathRender";
import {mermaidRender} from "./mermaidRender";
import {markdownItRender} from "./render";

export const preview = (element: HTMLTextAreaElement, options?: IPreviewOptions) => {
    const defaultOption = {
        hljsStyle: "atom-one-light",
        enableHighlight: true,
        customEmoji: {},
        lang: "zh_CN",
    };
    options = Object.assign(defaultOption, options);
    markdownItRender(element.textContent, options.hljsStyle, options.enableHighlight, options.customEmoji).then((html) => {
        const divElement = document.createElement("div");
        divElement.innerHTML = html;
        divElement.className = element.className;
        divElement.id = element.id;
        divElement.setAttribute("style", element.getAttribute("style"));
        element.after(divElement);
        element.remove();
        mathRender(divElement, options.lang);
        mermaidRender(divElement);
        abcRender(divElement);
        codeRender(divElement, options.lang);
        chartRender(divElement);
    });
};
