export const setTheme = (vditor: IVditor) => {
    const vditorElement = document.getElementById(vditor.id);
    if (vditor.options.theme === "dark") {
        vditorElement.classList.add("vditor--dark");
        if (vditor.preview) {
            vditor.preview.element.firstElementChild.classList.add("vditor-reset--dark");
        }
        if (vditor.wysiwyg) {
            vditor.wysiwyg.element.classList.add("vditor-reset--dark");
        }
    } else {
        vditorElement.classList.remove("vditor--dark");
        if (vditor.preview) {
            vditor.preview.element.firstElementChild.classList.remove("vditor-reset--dark");
        }
        if (vditor.wysiwyg) {
            vditor.wysiwyg.element.classList.remove("vditor-reset--dark");
        }
    }
}
