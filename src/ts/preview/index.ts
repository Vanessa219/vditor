import {i18n} from "../i18n/index";
import {abcRender} from "../markdown/abcRender";
import {chartRender} from "../markdown/chartRender";
import {codeRender} from "../markdown/codeRender";
import {graphvizRender} from "../markdown/graphvizRender";
import {highlightRender} from "../markdown/highlightRender";
import {mathRender} from "../markdown/mathRender";
import {md2htmlByVditor} from "../markdown/md2html";
import {mediaRender} from "../markdown/mediaRender";
import {mermaidRender} from "../markdown/mermaidRender";
import {getMarkdown} from "../util/getMarkdown";

export class Preview {
    public element: HTMLElement;
    private mdTimeoutId: number;

    constructor(vditor: IVditor) {
        this.element = document.createElement("div");
        this.element.className = `vditor-preview`;
        const previewElement = document.createElement("div");
        previewElement.className = vditor.options.classes.preview ? vditor.options.classes.preview : "vditor-reset";
        previewElement.style.maxWidth = vditor.options.preview.maxWidth + "px";
        this.element.appendChild(previewElement);
        this.render(vditor);
    }

    public render(vditor: IVditor, value?: string) {
        clearTimeout(this.mdTimeoutId);

        if (this.element.style.display === "none") {
            if (this.element.getAttribute("data-type") === "renderPerformance") {
                vditor.tip.hide();
            }
            return;
        }

        if (value) {
            this.element.children[0].innerHTML = value;
            return;
        }

        if (getMarkdown(vditor)
            .replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "") === "") {
            this.element.children[0].innerHTML = "";
            return;
        }

        const renderStartTime = new Date().getTime();
        const markdownText = getMarkdown(vditor);
        this.mdTimeoutId = window.setTimeout( () => {
            if (vditor.options.preview.url) {
                const xhr = new XMLHttpRequest();
                xhr.open("POST", vditor.options.preview.url);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            const responseJSON = JSON.parse(xhr.responseText);
                            if (responseJSON.code !== 0) {
                                vditor.tip.show(responseJSON.msg);
                                return;
                            }
                            if (vditor.options.preview.transform) {
                                responseJSON.data = vditor.options.preview.transform(responseJSON.data);
                            }
                            this.element.children[0].innerHTML = responseJSON.data;
                            this.afterRender(vditor, renderStartTime);
                        } else {
                            let html = md2htmlByVditor(markdownText, vditor);
                            if (vditor.options.preview.transform) {
                                html = vditor.options.preview.transform(html);
                            }
                            this.element.children[0].innerHTML = html;
                            this.afterRender(vditor, renderStartTime);
                        }
                    }
                };

                xhr.send(JSON.stringify({markdownText}));
            } else {
                let html = md2htmlByVditor(markdownText, vditor);
                if (vditor.options.preview.transform) {
                    html = vditor.options.preview.transform(html);
                }
                this.element.children[0].innerHTML = html;
                this.afterRender(vditor, renderStartTime);
            }
        }, vditor.options.preview.delay);
    }

    private afterRender(vditor: IVditor, startTime: number) {
        if (vditor.options.preview.parse) {
            vditor.options.preview.parse(this.element);
        }
        const time = (new Date().getTime() - startTime);
        if ((new Date().getTime() - startTime) > 2600) {
            // https://github.com/b3log/vditor/issues/67
            vditor.tip.show(i18n[vditor.options.lang].performanceTip.replace("${x}",
                time.toString()));
            vditor.preview.element.setAttribute("data-type", "renderPerformance");
        } else if (vditor.preview.element.getAttribute("data-type") === "renderPerformance") {
            vditor.tip.hide();
            vditor.preview.element.removeAttribute("data-type");
        }
        codeRender(vditor.preview.element.children[0] as HTMLElement, vditor.options.lang);
        highlightRender(vditor.options.preview.hljs, vditor.preview.element.children[0] as HTMLElement,
            vditor.options.cdn);
        mathRender(vditor.preview.element.children[0] as HTMLElement, {
            cdn: vditor.options.cdn,
            math: vditor.options.preview.math,
        });
        mermaidRender(vditor.preview.element.children[0] as HTMLElement, ".language-mermaid", vditor.options.cdn);
        graphvizRender(vditor.preview.element.children[0] as HTMLElement, vditor.options.cdn);
        chartRender(vditor.preview.element.children[0] as HTMLElement, vditor.options.cdn);
        abcRender(vditor.preview.element.children[0] as HTMLElement, vditor.options.cdn);
        mediaRender(vditor.preview.element.children[0] as HTMLElement);
    }
}
