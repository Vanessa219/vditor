import {Constants} from "../constants";
import {addScript} from "../util/addScript";

declare class Viz {
    public renderSVGElement: (code: string) => Promise<any>;

    constructor({}: { worker: Worker });
}

export const graphvizRender = (element: HTMLElement, cdn = Constants.CDN) => {
    const graphvizElements = element.querySelectorAll(".language-graphviz");

    if (graphvizElements.length === 0) {
        return;
    }
    addScript(`${cdn}/dist/js/graphviz/viz.js`, "vditorGraphVizScript").then(() => {
        graphvizElements.forEach((e: HTMLDivElement) => {
            if (e.parentElement.classList.contains("vditor-wysiwyg__pre") ||
                e.parentElement.classList.contains("vditor-ir__marker--pre")) {
                return;
            }

            if (e.getAttribute("data-processed") === "true" || e.textContent.trim() === "") {
                return;
            }

            try {
                const blob = new Blob([`importScripts('${(document.getElementById("vditorGraphVizScript") as HTMLScriptElement).src.replace("viz.js", "full.render.js")}');`],
                    {type: "application/javascript"});
                const url = window.URL || window.webkitURL;
                const blobUrl = url.createObjectURL(blob);
                const worker = new Worker(blobUrl);
                new Viz({worker})
                    .renderSVGElement(e.textContent).then((result: HTMLElement) => {
                    e.innerHTML = result.outerHTML;
                }).catch((error) => {
                    e.innerHTML = `graphviz render error: <br>${error}`;
                    e.className = "vditor-reset--error";
                });
            } catch (e) {
                console.error("graphviz error", e);
            }

            e.setAttribute("data-processed", "true");
        });
    });
};
