import {disableToolbar, enableToolbar, setCurrentToolbar} from "../toolbar/setToolbar";
import {hasClosestByMatchTag} from "../util/hasClosest";
import {highlightToolbarIRSV} from "../util/highlightToolbarIRSV";

export const highlightToolbar = (vditor: IVditor) => {
    highlightToolbarIRSV(vditor, (typeElement: HTMLElement) => {
        const liElement = hasClosestByMatchTag(typeElement, "LI");
        if (liElement) {
            if (liElement.classList.contains("vditor-task")) {
                setCurrentToolbar(vditor.toolbar.elements, ["check"]);
            } else if (liElement.parentElement.tagName === "OL") {
                setCurrentToolbar(vditor.toolbar.elements, ["ordered-list"]);
            } else if (liElement.parentElement.tagName === "UL") {
                setCurrentToolbar(vditor.toolbar.elements, ["list"]);
            }
            enableToolbar(vditor.toolbar.elements, ["outdent", "indent"]);
        } else {
            disableToolbar(vditor.toolbar.elements, ["outdent", "indent"]);
        }
    })
};
