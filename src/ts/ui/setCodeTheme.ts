import {highlightRender} from "../markdown/highlightRender";

export const setCodeTheme = (vditor: IVditor, codeTheme: string) => {
    if (!codeTheme) {
        return;
    }
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
};
