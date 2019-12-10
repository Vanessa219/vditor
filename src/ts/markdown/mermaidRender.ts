import {addScript} from "../util/addScript";

declare const mermaid: {
    init(option: { noteMargin: number; }, c: string): void;
};

export const mermaidRender = (element: HTMLElement, className = ".language-mermaid", cdn = "..") => {
    if (element.querySelectorAll(className).length === 0) {
        return;
    }
    addScript(`${cdn}/dist/js/mermaid/mermaid.min.js`, "vditorMermaidScript");
    mermaid.init({noteMargin: 10}, className);
};
