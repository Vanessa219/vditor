export const mermaidRender = (element: HTMLElement, className = ".language-mermaid") => {
    if (element.querySelectorAll(className).length === 0) {
        return;
    }
    import(/* webpackChunkName: "mermaid" */ "mermaid").then((mermaid) => {
        mermaid.init({noteMargin: 10}, className);
    });

};
