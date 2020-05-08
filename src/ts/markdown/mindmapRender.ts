import {VDITOR_VERSION} from "../constants";
import {addScript} from "../util/addScript";

declare const echarts: {
    init(element: HTMLElement): IEChart;
};

export const mindmapRender = (element: (HTMLElement | Document) = document,
                              cdn = `https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}`) => {
    const mindmapElements = element.querySelectorAll(".language-mindmap");
    if (mindmapElements.length > 0) {
        addScript(`${cdn}/dist/js/echarts/echarts.min.js`, "vditorEchartsScript").then(() => {
            mindmapElements.forEach((e: HTMLDivElement) => {
                try {
                    if (e.getAttribute("data-processed") === "true") {
                        return;
                    }
                    const option = {
                        series: [
                            {
                                data: [JSON.parse(Lute.RenderMindmap(e.innerText))],
                                initialTreeDepth: -1,
                                itemStyle: {
                                    borderWidth: 0,
                                    color: "#4285f4",
                                },
                                label: {
                                    backgroundColor: "#f6f8fa",
                                    borderColor: "#d1d5da",
                                    borderRadius: 5,
                                    borderWidth: 0.5,
                                    color: "#586069",
                                    lineHeight: 20,
                                    offset: [-5, 0],
                                    padding: [0, 5],
                                    position: "insideRight",
                                },
                                lineStyle: {
                                    color: "#d1d5da",
                                    width: 1,
                                },
                                roam: true,
                                symbol: (value: number, params: { data?: { children?: object } }) => {
                                    if (params?.data?.children) {
                                        return "circle";
                                    } else {
                                        return "path://";
                                    }
                                },
                                type: "tree",
                            },
                        ],
                        tooltip: {
                            trigger: "item",
                            triggerOn: "mousemove",
                        },
                    };
                    echarts.init(e).setOption(option);
                    e.setAttribute("data-processed", "true");
                } catch (error) {
                    e.className = "vditor-reset--error";
                    e.innerHTML = `mindmap render error: <br>${error}`;
                }
            });
        });
    }
};
