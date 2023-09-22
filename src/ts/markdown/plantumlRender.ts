import {Constants} from "../constants";
import {addScript} from "../util/addScript";
import {plantumlRenderAdapter} from "./adapterRender";

declare const plantumlEncoder: {
    encode(options: string): string,
};

export const plantumlRender = (
    element: (HTMLElement | Document) = document,
    plantumlPath: string = Constants.STATIC_PATH.plantuml,
) => {
    const plantumlElements = plantumlRenderAdapter.getElements(element);
    if (plantumlElements.length === 0) {
        return;
    }
    addScript(plantumlPath, "vditorPlantumlScript").then(() => {
        plantumlElements.forEach((e: HTMLDivElement) => {
            if (e.parentElement.classList.contains("vditor-wysiwyg__pre") ||
                e.parentElement.classList.contains("vditor-ir__marker--pre")) {
                return;
            }
            const text = plantumlRenderAdapter.getCode(e).trim();
            if (!text) {
                return;
            }
            try {
                e.innerHTML = `<img src="http://www.plantuml.com/plantuml/svg/~1${plantumlEncoder.encode(text)}">`;
            } catch (error) {
                e.className = "vditor-reset--error";
                e.innerHTML = `plantuml render error: <br>${error}`;
            }
        });
    });
};
