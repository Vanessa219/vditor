export const setTheme = (vditor: IVditor) => {
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
};
