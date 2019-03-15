export const mermaidRender = (element: HTMLElement) => {
    if (element.querySelectorAll("code.language-mermaid").length === 0) {
        return;
    }
    import(/* webpackChunkName: "mermaid" */ "mermaid").then((mermaid) => {
        mermaid.init({noteMargin: 10}, ".language-mermaid");
    });

};
