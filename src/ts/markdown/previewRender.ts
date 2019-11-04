import {CDN_PATH} from "../constants";
import {abcRender} from "./abcRender";
import {chartRender} from "./chartRender";
import {codeRender} from "./codeRender";
import {highlightRender} from "./highlightRender";
import {mathRenderByLute} from "./mathRenderByLute";
import {md2htmlByPreview} from "./md2html";
import {mediaRender} from "./mediaRender";
import {mermaidRender} from "./mermaidRender";

export const previewRender = async (previewElement: HTMLDivElement, markdown: string, options?: IPreviewOptions) => {
    const defaultOption = {
        className: 'vditor-reset',
        customEmoji: {},
        emojiPath: `${CDN_PATH}/vditor/dist/images/emoji`,
        enableHighlight: true,
        hljsStyle: "github",
        lang: "zh_CN",
    };
    options = Object.assign(defaultOption, options);

    const html =
        await md2htmlByPreview(markdown, options);

    previewElement.innerHTML = html;
    previewElement.className = options.className;

    codeRender(previewElement, options.lang);
    highlightRender(options.hljsStyle, options.enableHighlight, previewElement);
    mathRenderByLute(previewElement);
    mermaidRender(previewElement);
    chartRender(previewElement);
    abcRender(previewElement);
    mediaRender(previewElement);
};
