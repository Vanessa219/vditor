import {getText} from "../editor/getText";
import {i18n} from "../i18n/index";
import {abcRender} from "../markdown/abcRender";
import {chartRender} from "../markdown/chartRender";
import {codeRender} from "../markdown/codeRender";
import {mathRender} from "../markdown/mathRender";
import {mermaidRender} from "../markdown/mermaidRender";
import {md2html} from "../markdown/render";

export class Preview {
    public element: HTMLElement;

    constructor(vditor: IVditor) {
        this.element = document.createElement("div");
        this.element.className = `vditor-preview vditor-preview--${vditor.options.preview.mode}`;
        const previewElement = document.createElement("div");
        previewElement.className = vditor.options.classes.preview ? vditor.options.classes.preview : "vditor-reset";
        previewElement.style.maxWidth = vditor.options.preview.maxWidth + "px";
        this.element.appendChild(previewElement);
        this.render(vditor);
    }

    public render(vditor: IVditor, value?: string) {
        if (this.element.className === "vditor-preview vditor-preview--editor") {
            if (vditor.upload && vditor.upload.element.getAttribute("data-type") === "renderPerformance") {
                vditor.tip.hide();
            }
            return;
        }

        if (value) {
            this.element.children[0].innerHTML = value;
            return;
        }

        if (getText(vditor.editor.element).replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "") === "") {
            this.element.children[0].innerHTML = "";
            return;
        }

        clearTimeout(vditor.mdTimeoutId);

        vditor.mdTimeoutId = window.setTimeout(() => {
            const renderStartTime = new Date().getTime();
            if (vditor.options.preview.url) {
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
                            this.element.children[0].innerHTML = responseJSON.data;
                            this.afterRender(vditor, renderStartTime);
                        }
                    }
                };

                xhr.send(JSON.stringify({
                    markdownText: getText(vditor.editor.element),
                }));
            } else {
                md2html(vditor, vditor.options.preview.hljs.enable).then((html) => {
                    this.element.children[0].innerHTML = html;
                    this.afterRender(vditor, renderStartTime);
                });
            }
        }, vditor.options.preview.delay);
    }

    private afterRender(vditor: IVditor, startTime: number) {
        if (vditor.options.preview.parse) {
            vditor.options.preview.parse(this.element);
        }
        mathRender(vditor.preview.element.children[0] as HTMLElement, vditor.options.lang);
        mermaidRender(vditor.preview.element.children[0] as HTMLElement);
        codeRender(vditor.preview.element.children[0] as HTMLElement, vditor.options.lang);
        chartRender(vditor.preview.element.children[0] as HTMLElement);
        abcRender(vditor.preview.element.children[0] as HTMLElement);
        const time = (new Date().getTime() - startTime);
        if ((new Date().getTime() - startTime) > 2000) {
            // https://github.com/b3log/vditor/issues/67
            vditor.tip.show(i18n[vditor.options.lang].performanceTip.replace("${x}",
                time.toString()));
            vditor.upload.element.setAttribute("data-type", "renderPerformance");
        } else if (vditor.upload.element.getAttribute("data-type") === "renderPerformance") {
            vditor.tip.hide();
            vditor.upload.element.removeAttribute("data-type");
        }
    }
}
