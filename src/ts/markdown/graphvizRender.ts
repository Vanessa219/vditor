import {Constants} from "../constants";
import {graphvizRenderAdapter} from "./adapterRender";

export const graphvizRender = (element: HTMLElement, cdn = Constants.CDN) => {
    const graphvizElements = graphvizRenderAdapter.getElements(element);
    graphvizElements.forEach((e: HTMLDivElement) => {
        if (e.parentElement.classList.contains("vditor-wysiwyg__pre") ||
            e.parentElement.classList.contains("vditor-ir__marker--pre")) {
            return;
        }
        const code = graphvizRenderAdapter.getCode(e);
        if (e.getAttribute("data-processed") === "true" || code.trim() === "") {
            return;
        }

        let worker: Worker;
        let blobUrl: string;
        const cleanup = () => {
            worker?.terminate();
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        };
        const fail = (error: string) => {
            e.textContent = `graphviz render error: ${error}`;
            e.className = "vditor-reset--error";
            cleanup();
        };
        try {
            const scriptUrl = new URL(`${cdn}/dist/js/graphviz/viz.js`, document.baseURI).href;
            const blob = new Blob([`
                importScripts(${JSON.stringify(scriptUrl)});
                const renderer = Viz.instance();
                self.onmessage = event => {
                    renderer.then(viz => viz.renderString(event.data, {format: "svg"})).then(
                        svg => self.postMessage({svg}),
                        error => self.postMessage({error: String(error)})
                    );
                };
            `], {type: "application/javascript"});
            blobUrl = URL.createObjectURL(blob);
            worker = new Worker(blobUrl);
            worker.onmessage = (event: MessageEvent<{svg?: string, error?: string}>) => {
                if (event.data.error) {
                    fail(event.data.error);
                    return;
                }
                e.innerHTML = event.data.svg;
                cleanup();
            };
            worker.onerror = event => {
                event.preventDefault();
                fail(event.message);
            };
            e.setAttribute("data-processed", "true");
            worker.postMessage(code);
        } catch (error) {
            fail(String(error));
        }
    });
};
