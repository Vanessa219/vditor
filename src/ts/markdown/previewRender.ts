import {VDITOR_VERSION} from "../constants";
import {setContentTheme} from "../ui/setContentTheme";
import {addScript} from "../util/addScript";
import {abcRender} from "./abcRender";
import {anchorRender} from "./anchorRender";
import {chartRender} from "./chartRender";
import {codeRender} from "./codeRender";
import {graphvizRender} from "./graphvizRender";
import {highlightRender} from "./highlightRender";
import {lazyLoadImageRender} from "./lazyLoadImageRender";
import {mathRender} from "./mathRender";
import {mediaRender} from "./mediaRender";
import {mermaidRender} from "./mermaidRender";
import {setLute} from "./setLute";
import {speechRender} from "./speechRender";

const mergeOptions = (options?: IPreviewOptions) => {
    const defaultOption = {
        anchor: false,
        cdn: `https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}`,
        customEmoji: {},
        emojiPath: `${(options && options.emojiPath) ||
        `https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}`}/dist/images/emoji`,
        hljs: {
            enable: true,
            lineNumber: false,
            style: "github",
        },
        lang: "zh_CN",
        markdown: {
            autoSpace: false,
            chinesePunct: false,
            codeBlockPreview: true,
            fixTermTypo: false,
            footnotes: true,
            paragraphBeginningSpace: false,
            setext: true,
            theme: "light",
            toc: false,
        },
        math: {
            engine: "KaTeX",
            inlineDigit: false,
            macros: {},
        },
        speech: {
            enable: false,
        },
    };
    if (options?.hljs) {
        options.hljs = Object.assign({}, defaultOption.hljs, options.hljs);
    }
    if (options?.speech) {
        options.speech = Object.assign({}, defaultOption.speech, options.speech);
    }
    if (options?.math) {
        options.math = Object.assign({}, defaultOption.math, options.math);
    }
    if (options?.markdown) {
        options.markdown = Object.assign({}, defaultOption.markdown, options.markdown);
    }
    return Object.assign(defaultOption, options);
};

export const md2html = (mdText: string, options?: IPreviewOptions) => {
    const mergedOptions = mergeOptions(options);
    return addScript(`${mergedOptions.cdn}/dist/js/lute/lute.min.js`, "vditorLuteScript").then(() => {
        const lute = setLute({
            autoSpace: mergedOptions.markdown.autoSpace,
            chinesePunct: mergedOptions.markdown.chinesePunct,
            codeBlockPreview: mergedOptions.markdown.codeBlockPreview,
            emojiSite: mergedOptions.emojiPath,
            emojis: mergedOptions.customEmoji,
            fixTermTypo: mergedOptions.markdown.fixTermTypo,
            footnotes: mergedOptions.markdown.footnotes,
            headingAnchor: mergedOptions.anchor,
            inlineMathDigit: mergedOptions.math.inlineDigit,
            lazyLoadImage: mergedOptions.lazyLoadImage,
            paragraphBeginningSpace: mergedOptions.markdown.paragraphBeginningSpace,
            setext: mergedOptions.markdown.setext,
            toc: mergedOptions.markdown.toc,
        });
        if (options.renderers) {
            lute.SetJSRenderers({
                renderers: {
                    Md2HTML: options.renderers,
                },
            });
        }
        return lute.Md2HTML(mdText);
    });
};

export const previewRender = async (previewElement: HTMLDivElement, markdown: string, options?: IPreviewOptions) => {
    const mergedOptions = mergeOptions(options);
    let html = await md2html(markdown, mergedOptions);
    if (mergedOptions.transform) {
        html = mergedOptions.transform(html);
    }
    previewElement.innerHTML = html;
    previewElement.classList.add("vditor-reset");
    setContentTheme(mergedOptions.markdown.theme, mergedOptions.cdn);
    if (mergedOptions.anchor) {
        previewElement.classList.add("vditor-reset--anchor");
    }
    codeRender(previewElement, mergedOptions.lang);
    highlightRender(mergedOptions.hljs, previewElement, mergedOptions.cdn);
    mathRender(previewElement, {
        cdn: mergedOptions.cdn,
        math: mergedOptions.math,
    });
    mermaidRender(previewElement, ".language-mermaid", mergedOptions.cdn);
    graphvizRender(previewElement, mergedOptions.cdn);
    chartRender(previewElement, mergedOptions.cdn);
    abcRender(previewElement, mergedOptions.cdn);
    mediaRender(previewElement);
    if (mergedOptions.speech.enable) {
        speechRender(previewElement, mergedOptions.lang);
    }
    if (mergedOptions.anchor) {
        anchorRender();
    }
    if (mergedOptions.after) {
        mergedOptions.after();
    }
    if (mergedOptions.lazyLoadImage) {
        lazyLoadImageRender(previewElement);
    }
};
