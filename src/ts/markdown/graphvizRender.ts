import {VDITOR_VERSION} from "../constants";
import {addScript} from "../util/addScript";

declare class Viz {
  public renderSVGElement: (code: string) => Promise<any>;
  constructor({}: {workerURL: string});
}

export const graphvizRender = (element: HTMLElement, code: string, cdn = `https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}`) => {
    // TODO: 这里的cdn地址暂时写死
    addScript(`https://cdn.bootcss.com/viz.js/2.1.2/viz.js`, "vditorGraphVizScript");

    element.querySelectorAll("pre > code").forEach((e: HTMLDivElement) => {
        try {
            if (e.getAttribute("data-processed") === "true") {
                return;
            }
            const workerURL = "../../js/graphviz/full.render.js";
            const viz = new Viz({ workerURL });
            viz.renderSVGElement(code).then((result: HTMLElement) => {
                e.replaceChild(result, e?.childNodes[0]);
            });
            e.setAttribute("data-processed", "true");
        } catch (error) {
            e.className = "hljs";
            e.innerHTML = `echarts render error: <br>${error}`;
        }
    });
};
