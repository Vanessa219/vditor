import {getText} from "../editor/getText";

export class DevTools {
    public element: HTMLDivElement;
    public ASTChart: echarts.ECharts

    constructor() {
        this.element = document.createElement("div");
        this.element.className = "vditor-devtools";
    }

    public renderEchart(vditor: IVditor) {
        if (vditor.devtools.element.style.display !== 'block') {
            return
        }

        const data = vditor.lute.RenderEChartsJSON(vditor.currentMode === 'wysiwyg' ? vditor.wysiwyg.element.textContent : getText(vditor.editor.element));
        try {
            this.ASTChart.setOption({
                series: [
                    {
                        data: JSON.parse(data[0]) || data[1],
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
                    bottom: 20,
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
                    right: 20,
                    show: true,
                },
            });
            this.element.className = 'vditor-devtools'
        } catch (e) {
            this.element.innerHTML = e
            this.element.className = 'vditor-devtools vditor--error'
        }
    }
}
