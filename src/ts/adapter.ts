export const mathRenderAdapter = {
    getCode: (mathElement: Element) => mathElement.textContent,
    getMathElements: (element: HTMLElement) => element.querySelectorAll(".language-math"),
};
export const mermaidRenderAdapter = {
    /** 不仅要返回code，并且需要将 code 设置为 el 的 innerHTML */
    getCode: (el: Element) => el.textContent,
    getMathElements: (element: HTMLElement) => element.querySelectorAll(".language-mermaid"),
};
export const mindmapRenderAdapter = {
    getCode: (el: Element) => el.getAttribute("data-code"),
    getMathElements: (el: HTMLElement | Document) => el.querySelectorAll(".language-mindmap"),
};
export const chartRenderAdapter = {
    getCode: (el: Element) => el.innerHTML,
    getMathElements: (el: HTMLElement | Document) => el.querySelectorAll(".language-echarts"),
};
export const abcRenderAdapter = {
    getCode: (el: Element) => el.textContent,
    getMathElements: (el: HTMLElement | Document) => el.querySelectorAll(".language-abc"),
};
export const graphvizRenderAdapter = {
    getCode: (el: Element) => el.textContent,
    getMathElements: (el: HTMLElement | Document) => el.querySelectorAll(".language-graphviz"),
};
export const flowchartRenderAdapter = {
    getCode: (el: Element) => el.textContent,
    getMathElements: (el: HTMLElement | Document) => el.querySelectorAll(".language-flowchart"),
};
export const plantumlRenderAdapter = {
    getCode: (el: Element) => el.textContent,
    getMathElements: (el: HTMLElement | Document) => el.querySelectorAll(".language-plantuml"),
};
