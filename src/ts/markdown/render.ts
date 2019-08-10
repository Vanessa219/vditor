import {CDN_PATH} from "../constants";
import {getText} from "../editor/getText";
import {addStyle} from "../util/addStyle";
import {task} from "./markdown-it-task";

export const markdownItRender = async (mdText: string, hljsStyle: string) => {
    addStyle(`${CDN_PATH}/vditor/dist/js/highlight.js/styles/${hljsStyle}.css`,
        "vditorHljsStyle");

    const {default: MarkdownIt} = await import(/* webpackChunkName: "markdown-it" */ "markdown-it");

    const options: markdownit.Options = {
        breaks: true,
        html: true,
        linkify: true,
    };

    const {default: hljs} = await import(/* webpackChunkName: "highlight.js" */ "highlight.js");
    options.highlight = (str: string, lang: string) => {
        if (lang === "mermaid" || lang === "echarts") {
            return str;
        }
        if (lang && hljs.getLanguage(lang)) {
            return `<pre><code class="language-${lang} hljs">${hljs.highlight(lang, str, true).value}</code></pre>`;
        }
        return `<pre><code class="hljs">${hljs.highlightAuto(str).value}</code></pre>`;
    };
    const markdownIt = new MarkdownIt(options).use(task);
    return markdownIt.render(mdText);
};

const initMarkdownIt = async (vditor: IVditor, includeHljs: boolean) => {
    if (vditor.options.preview.hljs.style) {
        addStyle(`${CDN_PATH}/vditor/dist/js/highlight.js/styles/${vditor.options.preview.hljs.style}.css`,
            "vditorHljsStyle");
    }

    const {default: MarkdownIt} = await import(/* webpackChunkName: "markdown-it" */ "markdown-it");

    const options: markdownit.Options = {
        breaks: true,
        html: true,
        linkify: true,
    };

    if (includeHljs) {
        const {default: hljs} = await import(/* webpackChunkName: "highlight.js" */ "highlight.js");
        options.highlight = (str: string, lang: string) => {
            if (lang === "mermaid" || lang === "echarts") {
                return str;
            }
            if (lang && hljs.getLanguage(lang)) {
                return `<pre><code class="language-${lang} hljs">${hljs.highlight(lang, str, true).value}</code></pre>`;
            }
            return `<pre><code class="hljs">${hljs.highlightAuto(str).value}</code></pre>`;
        };
    }
    return new MarkdownIt(options).use(task);
};

export const md2html = async (vditor: IVditor, includeHljs: boolean) => {
    if (typeof vditor.markdownIt !== "undefined") {
        return vditor.markdownIt.render(getText(vditor.editor.element));
    } else {
        vditor.markdownIt = await initMarkdownIt(vditor, includeHljs);
        return vditor.markdownIt.render(getText(vditor.editor.element));
    }
};
