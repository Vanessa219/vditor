import {abcRender} from "./abcRender";
import {chartRender} from "./chartRender";
import {codeRender} from "./codeRender";
import {mathRender} from "./mathRender";
import {md2htmlByText} from "./md2html";
import {mermaidRender} from "./mermaidRender";
import {highlightRender} from "./highlightRender";
import {emojiRender} from "./emojiRender";

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
    divElement.innerHTML = emojiRender(html, options.customEmoji);
    divElement.className = element.className;
    divElement.id = element.id;
    divElement.setAttribute("style", element.getAttribute("style"));
    divElement.style.display = "block";
    element.after(divElement);
    element.remove();
    codeRender(divElement, options.lang);
    highlightRender(options.hljsStyle, options.enableHighlight)
    mathRender(divElement, options.lang);
    mermaidRender(divElement);
    chartRender(divElement);
    abcRender(divElement);
};
