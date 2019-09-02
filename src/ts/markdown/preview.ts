import {abcRender} from "./abcRender";
import {chartRender} from "./chartRender";
import {codeRender} from "./codeRender";
import {mathRender} from "./mathRender";
import {mermaidRender} from "./mermaidRender";
import {md2htmlByText} from "./md2html";

export const preview = async (element: HTMLTextAreaElement, options?: IPreviewOptions) => {
    const defaultOption = {
        customEmoji: {},
        enableHighlight: true,
        hljsStyle: "atom-one-light",
        lang: "zh_CN",
    };
    options = Object.assign(defaultOption, options);
    const html =
        await md2htmlByText(element.textContent);
    const divElement = document.createElement("div");
    divElement.innerHTML = html;
    divElement.className = element.className;
    divElement.id = element.id;
    divElement.setAttribute("style", element.getAttribute("style"));
    divElement.style.display = "block";
    element.after(divElement);
    element.remove();
    mathRender(divElement, options.lang);
    mermaidRender(divElement);
    abcRender(divElement);
    codeRender(divElement, options.lang);
    chartRender(divElement);
    // TODO emoji and hljs render
};
