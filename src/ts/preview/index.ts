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

        clearTimeout(vditor.mdTimeoutId);
        vditor.mdTimeoutId = window.setTimeout(() => {
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
                            this.afterRender(vditor);
                        }
                    }
                };

                xhr.send(JSON.stringify({
                    markdownText: vditor.editor.element.value,
                }));
            } else {
                md2html(vditor, vditor.options.preview.hljs.enable).then((html) => {
                    this.element.innerHTML = html;
                    this.afterRender(vditor);
                });
            }
        }, vditor.options.preview.delay);
    }

    private afterRender(vditor: IVditor) {
        if (vditor.options.preview.parse) {
            vditor.options.preview.parse(this.element);
        }
        mathRender(vditor.preview.element);
        mermaidRender(vditor.preview.element);
        codeRender(vditor.preview.element, vditor.options.lang);
    }
}
