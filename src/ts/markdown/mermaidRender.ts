import {addScript} from "../util/addScript";
import {Constants} from "../constants";

declare const mermaid: {
    init(option: { noteMargin: number; }, c: Element): void;
};

export const mermaidRender = (element: HTMLElement, cdn = Constants.CDN) => {
    const mermaidElements = element.querySelectorAll(".language-mermaid");
    if (mermaidElements.length === 0) {
        return;
    }
    addScript(`${cdn}/dist/js/mermaid/mermaid.min.js`, "vditorMermaidScript").then(() => {
        mermaidElements.forEach((item) => {
            mermaid.init({noteMargin: 10}, item);
        });
    });
};
