import {VDITOR_VERSION} from "../constants";
import {addScript} from "../util/addScript";

declare class Viz {
  public renderSVGElement: (code: string) => Promise<any>;
  constructor({}: {workerURL: string});
}

export const graphvizRender = (element: HTMLElement, code: string, cdn = `https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}`) => {
  // addScript("https://cdn.bootcss.com/viz.js/2.1.2/full.render.js", "vditorGraphVizFullScript");
  // TODO: 这里的cdn地址暂时写死
  addScript("https://cdn.bootcss.com/viz.js/2.1.2/viz.js", "vditorGraphVizScript");

  const workerURL = "../../js/graphviz/full.render.js";
  const viz1 = new Viz({ workerURL });

  // tslint:disable-next-line:no-console
  console.log(viz1, code);
  viz1.renderSVGElement(code).then((result: HTMLElement) => {
    // tslint:disable-next-line:no-console
    console.log(result);
    element.appendChild(result as HTMLElement);
  });
};
