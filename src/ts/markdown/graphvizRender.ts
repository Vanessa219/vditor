import {VDITOR_VERSION} from "../constants";
import {addScript} from "../util/addScript";

declare class Viz {
    public renderSVGElement: (code: string) => Promise<any>;

    constructor({}: { worker: Worker });
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

        try {
            const blob = new Blob([`importScripts('${cdn}/dist/js/graphviz/full.render.js');`],
                {type: "application/javascript"});
            const url = window.URL || window.webkitURL;
            const blobUrl = url.createObjectURL(blob);
            const worker = new Worker(blobUrl);
            new Viz({worker})
                .renderSVGElement(e.textContent).then((result: HTMLElement) => {
                e.innerHTML = result.outerHTML;
            }).catch((error) => {
                e.innerHTML = `graphviz render error: <br>${error}`;
                e.className = "vditor-math vditor-reset--error";
            });
        } catch (e) {
            console.error("graphviz error", e);
        }

        e.setAttribute("data-processed", "true");
    });
};
