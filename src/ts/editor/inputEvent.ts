export const inputEvent = (vditor: IVditor) => {
    if (vditor.options.counter > 0) {
        vditor.counter.render(vditor.editor.element.innerText.length, vditor.options.counter);
    }
    if (typeof vditor.options.input === "function") {
        vditor.options.input(vditor.editor.element.innerText, vditor.preview && vditor.preview.element);
    }
    if (vditor.hint) {
        vditor.hint.render();
    }
    if (vditor.options.cache) {
        localStorage.setItem(`vditor${vditor.id}`, vditor.editor.element.innerText);
    }
    if (vditor.preview) {
        vditor.preview.render(vditor);
    }
};
