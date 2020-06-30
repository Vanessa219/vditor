import {setCurrentToolbar} from "../toolbar/setToolbar";
import {hasClosestByAttribute} from "../util/hasClosest";
import {highlightToolbarIRSV} from "../util/highlightToolbarIRSV";

export const highlightToolbar = (vditor: IVditor) => {
    highlightToolbarIRSV(vditor, (typeElement: HTMLElement) => {
        const ulElement = hasClosestByAttribute(typeElement, "data-type", "ul");
        if (ulElement) {
            setCurrentToolbar(vditor.toolbar.elements, ["list"]);
        }
        const olElement = hasClosestByAttribute(typeElement, "data-type", "ol");
        if (olElement) {
            setCurrentToolbar(vditor.toolbar.elements, ["ordered-list"]);
        }
        const taskElement = hasClosestByAttribute(typeElement, "data-type", "task");
        if (taskElement) {
            setCurrentToolbar(vditor.toolbar.elements, ["check"]);
        }
    });
};
