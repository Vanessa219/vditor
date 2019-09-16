import {CDN_PATH} from "../constants";
import {abcRender} from "./abcRender";
import {chartRender} from "./chartRender";
import {codeRender} from "./codeRender";
import {highlightRender} from "./highlightRender";
import {md2htmlByPreview} from "./md2html";
import {mediaRender} from "./mediaRender";
import {mermaidRender} from "./mermaidRender";
import {mathRenderByLute} from "./mathRenderByLute";

export const previewRender = async (element: HTMLTextAreaElement, options?: IPreviewOptions) => {
    const defaultOption = {
        customEmoji: {},
        emojiPath: `${CDN_PATH}/vditor/dist/images/emoji`,
        enableHighlight: true,
        hljsStyle: "atom-one-light",
        lang: "zh_CN",
    };
    options = Object.assign(defaultOption, options);
    const html =
        await md2htmlByPreview(element.textContent, options);
    const divElement = document.createElement("div");
    divElement.innerHTML = html;
    divElement.className = element.className;
    divElement.id = element.id;
    divElement.setAttribute("style", element.getAttribute("style"));
    divElement.style.display = "block";
    element.after(divElement);
    element.remove();
    codeRender(divElement, options.lang);
    highlightRender(options.hljsStyle, options.enableHighlight, divElement);
    mathRenderByLute(divElement);
    mermaidRender(divElement);
    chartRender(divElement);
    abcRender(divElement);
    mediaRender(divElement);
};
