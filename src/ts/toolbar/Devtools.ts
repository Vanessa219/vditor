import bugSVG from "../../assets/icons/bug.svg";
import {MenuItem} from "./MenuItem";

export class Devtools extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || bugSVG;

        this.element.addEventListener("click", () => {
            if (this.element.children[0].className.indexOf("vditor-menu--current") > -1) {
                this.element.children[0].className =
                    this.element.children[0].className.replace(" vditor-menu--current", "");
                vditor.devtools.style.display = "none";
            } else {
                this.element.children[0].className += " vditor-menu--current";
                vditor.devtools.style.display = "block";
                this.renderEchart(vditor.devtools);
            }
        });
    }

    private async renderEchart(element: HTMLElement) {
        const {default: echarts} = await import(/* webpackChunkName: "echarts" */ "echarts");
        echarts.init(element).setOption({
            series: [
                {
                    data: [
                        {
                            children: [
                                {
                                    children: [
                                        {
                                            name: "Text\n'简介'",
                                        },
                                    ],
                                    name: "Heading\nh2",
                                },
                                {
                                    children: [
                                        {
                                            name: "Text\n'一款'",
                                        },
                                        {
                                            children: [
                                                {
                                                    name: "Text\n'Markdown'",
                                                },
                                            ],
                                            name: "Emph\nem",
                                        },
                                        {
                                            name: "Text\n'引擎'",
                                        },
                                    ],
                                    name: "Paragraph\np",
                                },
                                {
                                    children: [
                                        {
                                            name: "Text\n'特性'",
                                        },
                                    ],
                                    name: "Heading\nh2",
                                },
                                {
                                    children: [
                                        {
                                            children: [{
                                                children: [{name: "Text\n'实现'"}],
                                                name: "Paragrap\np",
                                            }, {
                                                children: [{name: "Text\n'GFM'"}],
                                                name: "Emph\nem",
                                            }],
                                            name: "Item\nli",
                                        },
                                        {
                                            children: [{name: "Paragrap\np", children: [{name: "Text\n'非常快'"}]}],
                                            name: "Item\nli",
                                        },
                                    ],
                                    name: "List\nul",
                                },
                            ],
                            name: "Document",
                        },
                    ],
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
