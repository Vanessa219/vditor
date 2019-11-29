import {getText} from "../util/getText";

export class DevTools {
    public element: HTMLDivElement;
    public ASTChart: echarts.ECharts;

    constructor() {
        this.element = document.createElement("div");
        this.element.className = "vditor-devtools";
        this.element.innerHTML = '<div class="vditor--error"></div><div style="height: 100%;"></div>';
    }

    public async renderEchart(vditor: IVditor) {
        if (vditor.devtools.element.style.display !== "block") {
            return;
        }

        if (!this.ASTChart) {
            const {default: echarts} = await import(/* webpackChunkName: "echarts" */ "echarts");
            this.ASTChart = echarts.init(vditor.devtools.element.lastElementChild as HTMLDivElement);
        }

        try {
            (this.element.lastElementChild as HTMLElement).style.display = "block";
            this.element.firstElementChild.innerHTML = "";
            this.ASTChart.setOption({
                series: [
                    {
                        data: JSON.parse(vditor.lute.RenderEChartsJSON(getText(vditor))),
                        initialTreeDepth: -1,
                        label: {
                            align: "left",
                            fontSize: 12,
                            offset: [9, 12],
                            position: "top",
                            verticalAlign: "middle",
                        },
                        lineStyle: {
                            color: "#4285f4",
                            type: "curve",
                        },
                        orient: "vertical",
                        roam: true,
                        type: "tree",
                    },
                ],
                toolbox: {
                    bottom: 25,
                    emphasis: {
                        iconStyle: {
                            color: "#4285f4",
                        },
                    },
                    feature: {
                        restore: {
                            show: true,
                        },
                        saveAsImage: {
                            show: true,
                        },
                    },
                    right: 15,
                    show: true,
                },
            });
        } catch (e) {
            (this.element.lastElementChild as HTMLElement).style.display = "none";
            this.element.firstElementChild.innerHTML = e;
        }
    }
}
