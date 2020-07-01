import {VDITOR_VERSION} from "../constants";
import {addScript} from "../util/addScript";

declare const ABCJS: {
    renderAbc(element: HTMLElement, text: string): void;
};

export const abcRender = (element: (HTMLElement | Document) = document,
                          cdn = `https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}`) => {
    const abcElements = element.querySelectorAll(".language-abc");
    if (abcElements.length > 0) {
        addScript(`${cdn}/dist/js/abcjs/abcjs_basic.min.js`, "vditorAbcjsScript").then(() => {
            abcElements.forEach((e: HTMLDivElement) => {
                const divElement = document.createElement("div");
                divElement.className = "language-abc";
                e.parentNode.replaceChild(divElement, e);
                ABCJS.renderAbc(divElement, e.textContent.trim());
                divElement.style.overflowX = "auto";
            });
        });
    }
};
