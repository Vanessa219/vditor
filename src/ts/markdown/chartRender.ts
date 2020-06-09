import {VDITOR_VERSION} from "../constants";
import {addScript} from "../util/addScript";

declare const echarts: {
    init(element: HTMLElement): IEChart;
};

export const chartRender = (element: (HTMLElement | Document) = document,
                            cdn = `https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}`) => {
    const echartsElements = element.querySelectorAll(".language-echarts");
    if (echartsElements.length > 0) {
        addScript(`${cdn}/dist/js/echarts/echarts.min.js`, "vditorEchartsScript").then(() => {
            echartsElements.forEach((e: HTMLDivElement) => {
                const text = e.innerText.trim();
                if (!text) {
                    return;
                }
                try {
                    if (e.getAttribute("data-processed") === "true") {
                        return;
                    }
                    const option = JSON.parse(text);
                    echarts.init(e).setOption(option);
                    e.setAttribute("data-processed", "true");
                } catch (error) {
                    e.className = "vditor-reset--error";
                    e.innerHTML = `echarts render error: <br>${error}`;
                }
            });
        });
    }
};
