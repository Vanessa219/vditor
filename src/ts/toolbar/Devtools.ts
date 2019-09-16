import bugSVG from "../../assets/icons/bug.svg";
import {getText} from "../editor/getText";
import {MenuItem} from "./MenuItem";
import {getEventName} from "../util/getEventName";

export class Devtools extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || bugSVG;

        this.element.addEventListener(getEventName(), () => {
            if (this.element.children[0].className.indexOf("vditor-menu--current") > -1) {
                this.element.children[0].className =
                    this.element.children[0].className.replace(" vditor-menu--current", "");
                vditor.devtools.style.display = "none";
                vditor.devtools.innerHTML = '<div style="height: 100%;"></div>';
            } else {
                this.element.children[0].className += " vditor-menu--current";
                vditor.devtools.style.display = "block";
                this.renderEchart(vditor);
            }
        });
    }

    private async renderEchart(vditor: IVditor) {
        const {default: echarts} = await import(/* webpackChunkName: "echarts" */ "echarts");
        const data = vditor.lute.RenderEChartsJSON(getText(vditor.editor.element));
        echarts.init(vditor.devtools.firstElementChild).setOption({
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
    }
}
