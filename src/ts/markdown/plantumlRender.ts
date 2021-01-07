import {Constants} from "../constants";
import {addScript} from "../util/addScript";

declare const plantumlEncoder: {
    encode(options: string): string,
};

export const plantumlRender = (element: HTMLElement, cdn = Constants.CDN, theme: string) => {
    const plantumlElements = element.querySelectorAll(".language-plantuml");
    if (plantumlElements.length === 0) {
        return;
    }
    addScript(`https://cdn.jsdelivr.net/gh/jmnote/plantuml-encoder@1.2.4/dist/plantuml-encoder.min.js`, "vditorPlantumlEncoderScript").then(() => {
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
                    if (e.getAttribute("data-processed") === "true") {
                        return;
                    }
                    
                    const encoded = plantumlEncoder.encode(text)
                    const imageElement = document.createElement("IMG");
                    imageElement.setAttribute("loading", "lazy")
                    imageElement.setAttribute("src", 'http://www.plantuml.com/plantuml/svg/~1' + encoded)
                    e.parentNode.insertBefore(imageElement, e);
                    e.style.display = 'none';
                    
                    e.setAttribute("data-processed", "true");
                } catch (error) {
                    e.className = "vditor-reset--error";
                    e.innerHTML = `plantuml render error: <br>${error}`;
                }
            });
    });
};
