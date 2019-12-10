import {addScript} from "../util/addScript";

declare const echarts: {
    init(element: HTMLElement): IEChart;
};

export const chartRender = (element: (HTMLElement | Document) = document, cdn: string = "..") => {
    const echartsElements = element.querySelectorAll(".language-echarts");
    if (echartsElements.length > 0) {
        addScript(`${cdn}/dist/js/echarts/echarts.min.js`, "vditorEchartsScript");
        echartsElements.forEach((e: HTMLDivElement) => {
            try {
                if (e.getAttribute("data-processed") === "true") {
                    return;
                }
                const option = JSON.parse(e.innerHTML.trim());
                echarts.init(e).setOption(option);
                e.setAttribute("data-processed", "true");
            } catch (error) {
                e.className = "hljs";
                e.innerHTML = `echarts render error: <br>${error}`;
            }
        });
    }
};
