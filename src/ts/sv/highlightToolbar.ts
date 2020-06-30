import {highlightToolbarIRSV} from "../util/highlightToolbarIRSV";
import {hasClosestByAttribute} from "../util/hasClosest";
import {setCurrentToolbar} from "../toolbar/setToolbar";


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
    })
};
