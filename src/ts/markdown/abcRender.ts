import {Constants} from "../constants";
import {addScript} from "../util/addScript";
import {abcRenderAdapter} from "./adapterRender";

declare const ABCJS: {
    renderAbc(element: HTMLElement, text: string): void;
};

export const abcRender = (
    element: (HTMLElement | Document) = document,
    abcPath: string = Constants.STATIC_PATH.abc,
) => {
    const abcElements = abcRenderAdapter.getElements(element);
    if (abcElements.length > 0) {
        addScript(abcPath, "vditorAbcjsScript").then(() => {
            abcElements.forEach((item: HTMLDivElement) => {
                if (item.parentElement.classList.contains("vditor-wysiwyg__pre") ||
                    item.parentElement.classList.contains("vditor-ir__marker--pre")) {
                    return;
                }
                if (item.getAttribute("data-processed") === "true") {
                    return;
                }
                ABCJS.renderAbc(item, abcRenderAdapter.getCode(item).trim());
                item.style.overflowX = "auto";
                item.setAttribute("data-processed", "true");
            });
        });
    }
};
