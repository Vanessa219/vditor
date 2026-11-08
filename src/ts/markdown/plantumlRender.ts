import {Constants} from "../constants";
import {addScript} from "../util/addScript";
import {plantumlRenderAdapter} from "./adapterRender";

declare const plantumlEncoder: {
    encode(options: string): string,
};

export const plantumlRender = (element: (HTMLElement | Document) = document, cdn = Constants.CDN,
                               plantuml?: IPlantumlOptions) => {
    const plantumlElements = plantumlRenderAdapter.getElements(element);
    if (plantumlElements.length === 0) {
        return;
    }
    const renderer = plantuml?.renderer;
    const server = plantuml?.server || Constants.PLANTUML_OPTIONS.server;
    const renderElements = () => {
        plantumlElements.forEach((e: HTMLDivElement) => {
            if (e.parentElement.classList.contains("vditor-wysiwyg__pre") ||
                e.parentElement.classList.contains("vditor-ir__marker--pre")) {
                return;
            }
            const text = plantumlRenderAdapter.getCode(e).trim();
            if (!text) {
                return;
            }
            if (renderer) {
                Promise.resolve().then(() => renderer(text, e)).catch((error) => {
                    e.className = "vditor-reset--error";
                    e.textContent = `plantuml render error: ${error}`;
                });
                return;
            }
            try {
                const image = document.createElement("object");
                image.type = "image/svg+xml";
                image.data = `${server}~1${plantumlEncoder.encode(text)}`;
                e.replaceChildren(image);
            } catch (error) {
                e.className = "vditor-reset--error";
                e.textContent = `plantuml render error: ${error}`;
            }
        });
    };
    if (renderer) {
        // 自定义渲染无需加载 plantuml-encoder
        renderElements();
        return;
    }
    addScript(`${cdn}/dist/js/plantuml/plantuml-encoder.min.js`, "vditorPlantumlScript").then(renderElements);
};
