export const setPreviewMode = (mode: keyof IPreviewMode, vditor: IVditor) => {
    if (vditor.currentPreviewMode === mode) {
        return;
    }
    vditor.currentPreviewMode = mode;

    switch (mode) {
        case "both":
            vditor.editor.element.style.display = "block";
            vditor.preview.element.style.display = "block";
            vditor.preview.render(vditor);

            if (vditor.toolbar.elements.both) {
                vditor.toolbar.elements.both.children[0].className += " vditor-menu--current";
            }

            if (vditor.toolbar.elements.preview) {
                vditor.toolbar.elements.preview.children[0].className =
                    vditor.toolbar.elements.preview.children[0].className.replace(" vditor-menu--current", "");
            }

            break;
        case "editor":
            vditor.editor.element.style.display = "block";
            vditor.preview.element.style.display = "none";

            if (vditor.toolbar.elements.preview) {
                vditor.toolbar.elements.preview.children[0].className =
                    vditor.toolbar.elements.preview.children[0].className
                        .replace(" vditor-menu--current", "");
            }
            if (vditor.toolbar.elements.both) {
                vditor.toolbar.elements.both.children[0].className =
                    vditor.toolbar.elements.both.children[0].className
                        .replace(" vditor-menu--current", "");
            }

            break;
        case "preview":
            vditor.editor.element.style.display = "none";
            vditor.preview.element.style.display = "block";
            vditor.preview.render(vditor);
            vditor.editor.element.blur();

            if (vditor.toolbar.elements.preview) {
                vditor.toolbar.elements.preview.children[0].className += " vditor-menu--current";
            }
            if (vditor.toolbar.elements.both) {
                vditor.toolbar.elements.both.children[0].className =
                    vditor.toolbar.elements.both.children[0].className
                        .replace(" vditor-menu--current", "");
            }

            break;
        default:
            break;
    }

    if (vditor.devtools && vditor.devtools.ASTChart && vditor.devtools.element.style.display === "block") {
        vditor.devtools.ASTChart.resize();
    }
};
