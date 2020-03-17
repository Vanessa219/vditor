import {removeCurrentToolbar} from "../toolbar/setToolbar";
import {setCurrentToolbar} from "../toolbar/setToolbar";

export const setPreviewMode = (mode: keyof IPreviewMode, vditor: IVditor) => {
    if (vditor.currentPreviewMode === mode) {
        return;
    }
    vditor.currentPreviewMode = mode;

    switch (mode) {
        case "both":
            vditor.sv.element.style.display = "block";
            vditor.preview.element.style.display = "block";
            vditor.preview.render(vditor);

            setCurrentToolbar(vditor.toolbar.elements, ["both"]);
            removeCurrentToolbar(vditor.toolbar.elements, ["preview"]);

            break;
        case "editor":
            vditor.sv.element.style.display = "block";
            vditor.preview.element.style.display = "none";

            removeCurrentToolbar(vditor.toolbar.elements, ["preview"]);
            removeCurrentToolbar(vditor.toolbar.elements, ["both"]);

            break;
        case "preview":
            vditor.sv.element.style.display = "none";
            vditor.preview.element.style.display = "block";
            vditor.preview.render(vditor);
            vditor.sv.element.blur();

            setCurrentToolbar(vditor.toolbar.elements, ["preview"]);
            removeCurrentToolbar(vditor.toolbar.elements, ["both"]);

            break;
        default:
            break;
    }

    if (vditor.devtools) {
        vditor.devtools.renderEchart(vditor);
    }
};
