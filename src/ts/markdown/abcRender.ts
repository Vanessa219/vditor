import {Constants} from "../constants";
import {addScript} from "../util/addScript";

declare const ABCJS: {
    renderAbc(element: HTMLElement, text: string): void;
};

export const abcRender = (element: (HTMLElement | Document) = document, cdn = Constants.CDN) => {
    const abcElements = element.querySelectorAll(".language-abc");
    if (abcElements.length > 0) {
        addScript(`${cdn}/dist/js/abcjs/abcjs_basic.min.js`, "vditorAbcjsScript").then(() => {
            abcElements.forEach((e: HTMLDivElement) => {
                if (e.parentElement.classList.contains("vditor-wysiwyg__pre") ||
                    e.parentElement.classList.contains("vditor-ir__marker--pre ")) {
                    return;
                }
                const divElement = document.createElement("div");
                divElement.className = "language-abc";
                e.parentNode.replaceChild(divElement, e);
                ABCJS.renderAbc(divElement, e.textContent.trim());
                divElement.style.overflowX = "auto";
            });
        });
    }
};
