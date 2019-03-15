import {addStyle} from "../util/addStyle";
import {task} from "./markdown-it-task";

const initMarkdownIt = async (vditor: IVditor, includeHljs: boolean) => {
    if (vditor.options.preview.hljs.style) {
        addStyle(`https://cdn.jsdelivr.net/npm/highlight.js@9.15.6/styles/${vditor.options.preview.hljs.style}.min.css`,
            "vditorHljsStyle");
    }

    const {default: MarkdownIt} = await import(/* webpackChunkName: "markdown-it" */ "markdown-it");

    const hljsOpt: IHljsOptions = {
        html: true,
        linkify: true,
        typographer: true,
    };

    if (includeHljs) {
        const {default: hljs} = await import(/* webpackChunkName: "highlight.js" */ "highlight.js");
        hljsOpt.highlight = (str: string, lang: string) => {
            if (lang === "mermaid") {
                return str;
            }
            if (lang && hljs.getLanguage(lang)) {
                return hljs.highlight(lang, str, true).value;
            }
            return hljs.highlightAuto(str).value;
        };
    }
    return new MarkdownIt(hljsOpt).use(task);
};

export const md2html = async (vditor: IVditor, includeHljs: boolean) => {
    if (typeof vditor.markdownIt !== "undefined") {
        return vditor.markdownIt.render(vditor.editor.element.value);
    } else {
        vditor.markdownIt = await initMarkdownIt(vditor, includeHljs);
        return vditor.markdownIt.render(vditor.editor.element.value);
    }
};
