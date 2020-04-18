import {highlightRender} from "../markdown/highlightRender";

export const setTheme = (vditor: IVditor, codeTheme?: string) => {
    if (vditor.options.theme === "dark") {
        vditor.element.classList.add("vditor--dark");
        if (vditor.preview) {
            vditor.preview.element.firstElementChild.classList.add("vditor-reset--dark");
        }
        vditor.wysiwyg.element.classList.add("vditor-reset--dark");
        vditor.ir.element.classList.add("vditor-reset--dark");
    } else {
        vditor.element.classList.remove("vditor--dark");
        if (vditor.preview) {
            vditor.preview.element.firstElementChild.classList.remove("vditor-reset--dark");
        }
        vditor.wysiwyg.element.classList.remove("vditor-reset--dark");
        vditor.ir.element.classList.remove("vditor-reset--dark");
    }

    if (codeTheme) {
        vditor.options.preview.hljs.style = codeTheme;
        if (vditor.currentMode === "sv") {
            if (vditor.preview.element.style.display !== "none") {
                highlightRender({
                        enable: vditor.options.preview.hljs.enable,
                        lineNumber: vditor.options.preview.hljs.lineNumber,
                        style: vditor.options.preview.hljs.style,
                    },
                    vditor.preview.element, vditor.options.cdn);
            }
        } else {
            highlightRender({
                    enable: true,
                    lineNumber: vditor.options.preview.hljs.lineNumber,
                    style: vditor.options.preview.hljs.style,
                },
                vditor[vditor.currentMode].element, vditor.options.cdn);
        }
    }
};
