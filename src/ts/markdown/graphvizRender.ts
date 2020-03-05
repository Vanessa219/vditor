import {VDITOR_VERSION} from "../constants";
import {addScript} from "../util/addScript";

declare class Viz {
    public renderSVGElement: (code: string) => Promise<any>;

    constructor({}: { workerURL: string });
}

export const graphvizRender = (element: HTMLElement, cdn = `https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}`) => {
    const graphvizElements = element.querySelectorAll(".language-graphviz");

    if (graphvizElements.length === 0) {
        return;
    }
    addScript(`${cdn}/dist/js/graphviz/viz.js`, "vditorGraphVizScript");

    graphvizElements.forEach((e: HTMLDivElement) => {
        if (e.getAttribute("data-processed") === "true") {
            return;
        }
        new Viz({workerURL: "../../js/graphviz/full.render.js"})
            .renderSVGElement(e.textContent).then((result: HTMLElement) => {
            e.innerHTML = result.outerHTML;
        }).catch((error) => {
            e.innerHTML = `graphviz render error: <br>${error}`;
            e.className = "vditor-math vditor-reset--error";
        });
        e.setAttribute("data-processed", "true");
    });
};
