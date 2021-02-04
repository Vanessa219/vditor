import {Constants} from "../constants";
import {addScript} from "../util/addScript";

declare const plantumlEncoder: {
    encode(options: string): string,
};

export const plantumlRender = (element: (HTMLElement | Document) = document, cdn = Constants.CDN) => {
    const plantumlElements = element.querySelectorAll(".language-plantuml");
    if (plantumlElements.length === 0) {
        return;
    }
    addScript(`${cdn}/dist/js/plantuml/plantuml-encoder.min.js`, "vditorPlantumlScript").then(() => {
        plantumlElements.forEach((e: HTMLDivElement) => {
            if (e.parentElement.classList.contains("vditor-wysiwyg__pre") ||
                e.parentElement.classList.contains("vditor-ir__marker--pre")) {
                return;
            }
            const text = e.innerText.trim();
            if (!text) {
                return;
            }
            try {
                const encoded = plantumlEncoder.encode(text);
                const imageElement = document.createElement("img");
                imageElement.setAttribute("loading", "lazy");
                imageElement.setAttribute("src", "http://www.plantuml.com/plantuml/svg/~1" + encoded);
                e.parentNode.insertBefore(imageElement, e);
                e.remove();
            } catch (error) {
                e.className = "vditor-reset--error";
                e.innerHTML = `plantuml render error: <br>${error}`;
            }
        });
    });
};
