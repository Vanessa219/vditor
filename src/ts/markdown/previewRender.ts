import {CDN_PATH} from "../constants";
import {abcRender} from "./abcRender";
import {anchorRender} from "./anchorRender";
import {chartRender} from "./chartRender";
import {codeRender} from "./codeRender";
import {highlightRender} from "./highlightRender";
import {mathRenderByLute} from "./mathRenderByLute";
import {md2htmlByPreview} from "./md2html";
import {mediaRender} from "./mediaRender";
import {mermaidRender} from "./mermaidRender";
import {speechRender} from "./speechRender";

export const previewRender = async (previewElement: HTMLDivElement, markdown: string, options?: IPreviewOptions) => {
    const defaultOption = {
        anchor: false,
        className: (options && options.anchor) ? "vditor-reset vditor-reset--anchor" : "vditor-reset",
        customEmoji: {},
        emojiPath: `${CDN_PATH}/vditor/dist/images/emoji`,
        hljs: {
            enable: true,
            lineNumber: false,
            style: "github",
        },
        lang: "zh_CN",
        speech: {
            enable: false,
        },
    };
    options = Object.assign(defaultOption, options);
    if (options.hljs) {
        options.hljs = Object.assign({}, defaultOption.hljs, options.hljs);
    }
    if (options.speech) {
        options.speech = Object.assign({}, defaultOption.speech, options.speech);
    }

    const html =
        await md2htmlByPreview(markdown, options);

    previewElement.innerHTML = html;
    previewElement.className = options.className;

    codeRender(previewElement, options.lang);
    highlightRender(options.hljs, previewElement);
    mathRenderByLute(previewElement);
    mermaidRender(previewElement);
    chartRender(previewElement);
    abcRender(previewElement);
    mediaRender(previewElement);
    if (options.speech.enable) {
        speechRender(previewElement,  options.lang);
    }
    if (options.anchor) {
        anchorRender();
    }
};
