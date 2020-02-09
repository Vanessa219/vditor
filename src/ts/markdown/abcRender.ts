import {VDITOR_VERSION} from "../constants";
import {addScript} from "../util/addScript";

declare const ABCJS: {
    renderAbc(element: HTMLElement, text: string): void;
};

export const abcRender = (element: (HTMLElement | Document) = document,
                          cdn = `https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}`) => {
    const abcElements = element.querySelectorAll(".language-abc");
    if (abcElements.length > 0) {
        addScript(`${cdn}/dist/js/abcjs/abcjs_basic.min.js`, "vditorAbcjsScript");
        abcElements.forEach((e: HTMLDivElement) => {
            const divElement = document.createElement("div");
            divElement.style.backgroundColor = "var(--code-background-color)";
            e.parentNode.parentNode.replaceChild(divElement, e.parentNode);
            ABCJS.renderAbc(divElement, e.textContent.trim());
            divElement.style.overflowX = "auto";
        });
    }
};
