import {setCurrentToolbar} from "../toolbar/setToolbar";
import {hasClosestByAttribute} from "../util/hasClosest";
import {highlightToolbarIRSV} from "../util/highlightToolbar";

export const highlightToolbarSV = (vditor: IVditor) => {
    highlightToolbarIRSV(vditor, (typeElement: HTMLElement) => {
        if (hasClosestByAttribute(typeElement, "data-type", "ul")) {
            setCurrentToolbar(vditor.toolbar.elements, ["list"]);
        } else if (hasClosestByAttribute(typeElement, "data-type", "ol")) {
            setCurrentToolbar(vditor.toolbar.elements, ["ordered-list"]);
        } else if (hasClosestByAttribute(typeElement, "data-type", "task")) {
            setCurrentToolbar(vditor.toolbar.elements, ["check"]);
        }
    });
};
