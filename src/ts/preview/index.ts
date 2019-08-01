import {code160to32} from "../editor/insertText";
import {i18n} from "../i18n/index";
import {chartRender} from "../markdown/chartRender";
import {codeRender} from "../markdown/codeRender";
import {mathRender} from "../markdown/mathRender";
import {mermaidRender} from "../markdown/mermaidRender";
import {md2html} from "../markdown/render";

export class Preview {
    public element: HTMLElement;

    constructor(vditor: IVditor) {
        this.element = document.createElement("div");
        this.element.className = "vditor-preview " +
            (vditor.options.classes.preview ? vditor.options.classes.preview : "vditor-reset");
        if (!vditor.options.preview.show) {
            this.element.style.display = "none";
        }
        if (this.element.style.display !== "none") {
            this.render(vditor);
        }
    }

    public render(vditor: IVditor, value?: string) {
        if (this.element.style.display === "none") {
            if (vditor.upload.element.getAttribute("data-type") === "renderPerformance") {
                vditor.upload.element.style.opacity = "0";
                vditor.upload.element.className = "vditor-upload";
                vditor.upload.element.removeAttribute("data-type");
            }
            return;
        }

        if (value) {
            this.element.innerHTML = value;
            return;
        }

        if (vditor.editor.element.innerText.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "") === "") {
            this.element.innerHTML = "";
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
                            this.element.innerHTML = responseJSON.data;
                            this.afterRender(vditor, renderStartTime);
                        }
                    }
                };

                xhr.send(JSON.stringify({
                    markdownText: code160to32(vditor.editor.element.innerText),
                }));
            } else {
                md2html(vditor, vditor.options.preview.hljs.enable).then((html) => {
                    this.element.innerHTML = html;
                    this.afterRender(vditor, renderStartTime);
                });
            }
        }, vditor.options.preview.delay);
    }

    private afterRender(vditor: IVditor, startTime: number) {
        if (vditor.options.preview.parse) {
            vditor.options.preview.parse(this.element);
        }
        mathRender(vditor.preview.element);
        mermaidRender(vditor.preview.element);
        codeRender(vditor.preview.element, vditor.options.lang);
        chartRender(vditor.preview.element);
        const time = (new Date().getTime() - startTime);
        if ((new Date().getTime() - startTime) > 1000) {
            // https://github.com/b3log/vditor/issues/67
            vditor.upload.element.style.opacity = "1";
            vditor.upload.element.setAttribute("data-type", "renderPerformance");
            vditor.upload.element.className = "vditor-upload vditor-upload--tip";
            vditor.upload.element.children[0].innerHTML = i18n[vditor.options.lang].performanceTip.replace("${x}",
                time.toString());
        } else if (vditor.upload.element.getAttribute("data-type") === "renderPerformance") {
            vditor.upload.element.style.opacity = "0";
            vditor.upload.element.className = "vditor-upload";
            vditor.upload.element.removeAttribute("data-type");
        }
    }
}
