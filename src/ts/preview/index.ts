import {mathRender} from "../markdown/math";
import {addStyle} from "../util/addStyle";

export class Preview {
    public element: HTMLElement;

    constructor(vditor: IVditor) {
        this.element = document.createElement("div");
        this.element.className = "vditor-preview" +
            (vditor.options.classes.preview ? " " + vditor.options.classes.preview : "");
        if (!vditor.options.preview.show) {
            this.element.style.display = "none";
        }
        if (this.element.style.display !== "none") {
            this.render(vditor);
        }
    }

    private afterRender(vditor:IVditor) {
        if (vditor.options.preview.parse) {
            vditor.options.preview.parse(this.element);
        }

        mathRender(vditor.preview.element)
    }

    public render(vditor: IVditor, value?: string) {
        if (this.element.style.display === "none") {
            return;
        }

        if (value) {
            this.element.innerHTML = value;
            return;
        }

        if (vditor.editor.element.value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "") === "") {
            this.element.innerHTML = "";
            return;
        }

        if (vditor.options.preview.url) {
            clearTimeout(vditor.mdTimeoutId);
            vditor.mdTimeoutId = window.setTimeout(() => {
                const xhr = new XMLHttpRequest();
                xhr.open("POST", vditor.options.preview.url);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            const responseJSON = JSON.parse(xhr.responseText);
                            if (responseJSON.code !== 0) {
                                alert(responseJSON.msg);
                                return;
                            }
                            this.element.innerHTML = responseJSON.data;
                            this.afterRender(vditor)
                        }
                    }
                };

                xhr.send(JSON.stringify({
                    markdownText: vditor.editor.element.value,
                }));
            }, vditor.options.preview.delay);
        } else {
            md2html(vditor, vditor.options.preview.hljs.enable).then((html) => {
                this.element.innerHTML = html;
                this.afterRender(vditor)
            });
        }
    }
}

export const md2html = async (vditor: IVditor, includeHljs: boolean) => {
    const {default: MarkdownIt} = await import(/* webpackChunkName: "markdown-it" */ "markdown-it");
    const hljsOpt: IHljsOptions = {
        html: true,
        linkify: true,
        typographer: true,
    };
    if (vditor.options.preview.hljs.style) {
        addStyle(`https://cdn.jsdelivr.net/npm/highlight.js@9.15.6/styles/${vditor.options.preview.hljs.style}.min.css`,
            'vditorHljsStyle')
    }
    if (includeHljs) {
        const {default: hljs} = await import(/* webpackChunkName: "highlight.js" */ "highlight.js");
        hljsOpt.highlight = (str: string, lang: string) => {
            if (lang && hljs.getLanguage(lang)) {
                return hljs.highlight(lang, str, true).value;
            }
            return hljs.highlightAuto(str).value;
        };
    }
    return new MarkdownIt(hljsOpt).render(vditor.editor.element.value);
};
