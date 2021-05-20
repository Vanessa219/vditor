import {Constants} from "../constants";
import {addScript} from "../util/addScript";
import {mermaidRenderAdapter} from "./adapterRender";

declare const mermaid: {
    initialize(options: any): void,
    init(options: any, element: Element): void,
};

export const mermaidRender = (element: HTMLElement, cdn = Constants.CDN, theme: string) => {
    const mermaidElements = mermaidRenderAdapter.getElements(element);
    if (mermaidElements.length === 0) {
        return;
    }
    addScript(`${cdn}/dist/js/mermaid/mermaid.min.js`, "vditorMermaidScript").then(() => {
        const config: any = {
            altFontFamily: "sans-serif",
            flowchart: {
                htmlLabels: true,
                useMaxWidth: true,
            },
            fontFamily: "sans-serif",
            gantt: {
                leftPadding: 75,
                rightPadding: 20,
            },
            securityLevel: "loose",
            sequence: {
                boxMargin: 8,
                diagramMarginX: 8,
                diagramMarginY: 8,
                useMaxWidth: true,
            },
            startOnLoad: false,
        };
        if (theme === "dark") {
            config.theme = "dark";
            config.themeVariables = {
                activationBkgColor: "hsl(180, 1.5873015873%, 28.3529411765%)",
                activationBorderColor: "#81B1DB",
                activeTaskBkgColor: "#81B1DB",
                activeTaskBorderColor: "#ffffff",
                actorBkg: "#1f2020",
                actorBorder: "#81B1DB",
                actorLineColor: "lightgrey",
                actorTextColor: "lightgrey",
                altBackground: "hsl(0, 0%, 40%)",
                altSectionBkgColor: "#333",
                arrowheadColor: "lightgrey",
                background: "#333",
                border1: "#81B1DB",
                border2: "rgba(255, 255, 255, 0.25)",
                classText: "#e0dfdf",
                clusterBkg: "hsl(180, 1.5873015873%, 28.3529411765%)",
                clusterBorder: "rgba(255, 255, 255, 0.25)",
                critBkgColor: "#E83737",
                critBorderColor: "#E83737",
                darkTextColor: "hsl(28.5714285714, 17.3553719008%, 86.2745098039%)",
                defaultLinkColor: "lightgrey",
                doneTaskBkgColor: "lightgrey",
                doneTaskBorderColor: "grey",
                edgeLabelBackground: "hsl(0, 0%, 34.4117647059%)",
                errorBkgColor: "#a44141",
                errorTextColor: "#ddd",
                fillType0: "#1f2020",
                fillType1: "hsl(180, 1.5873015873%, 28.3529411765%)",
                fillType2: "hsl(244, 1.5873015873%, 12.3529411765%)",
                fillType3: "hsl(244, 1.5873015873%, 28.3529411765%)",
                fillType4: "hsl(116, 1.5873015873%, 12.3529411765%)",
                fillType5: "hsl(116, 1.5873015873%, 28.3529411765%)",
                fillType6: "hsl(308, 1.5873015873%, 12.3529411765%)",
                fillType7: "hsl(308, 1.5873015873%, 28.3529411765%)",
                fontFamily: "\"trebuchet ms\", verdana, arial",
                fontSize: "16px",
                gridColor: "lightgrey",
                labelBackground: "#181818",
                labelBoxBkgColor: "#1f2020",
                labelBoxBorderColor: "#81B1DB",
                labelColor: "#ccc",
                labelTextColor: "lightgrey",
                lineColor: "lightgrey",
                loopTextColor: "lightgrey",
                mainBkg: "#1f2020",
                mainContrastColor: "lightgrey",
                nodeBkg: "#1f2020",
                nodeBorder: "#81B1DB",
                noteBkgColor: "#fff5ad",
                noteBorderColor: "rgba(255, 255, 255, 0.25)",
                noteTextColor: "#1f2020",
                primaryBorderColor: "hsl(180, 0%, 2.3529411765%)",
                primaryColor: "#1f2020",
                primaryTextColor: "#e0dfdf",
                secondBkg: "hsl(180, 1.5873015873%, 28.3529411765%)",
                secondaryBorderColor: "hsl(180, 0%, 18.3529411765%)",
                secondaryColor: "hsl(180, 1.5873015873%, 28.3529411765%)",
                secondaryTextColor: "rgb(183.8476190475, 181.5523809523, 181.5523809523)",
                sectionBkgColor: "hsl(52.9411764706, 28.813559322%, 58.431372549%)",
                sectionBkgColor2: "#EAE8D9",
                sequenceNumberColor: "black",
                signalColor: "lightgrey",
                signalTextColor: "lightgrey",
                taskBkgColor: "hsl(180, 1.5873015873%, 35.3529411765%)",
                taskBorderColor: "#ffffff",
                taskTextClickableColor: "#003163",
                taskTextColor: "hsl(28.5714285714, 17.3553719008%, 86.2745098039%)",
                taskTextDarkColor: "hsl(28.5714285714, 17.3553719008%, 86.2745098039%)",
                taskTextLightColor: "lightgrey",
                taskTextOutsideColor: "lightgrey",
                tertiaryBorderColor: "hsl(20, 0%, 2.3529411765%)",
                tertiaryColor: "hsl(20, 1.5873015873%, 12.3529411765%)",
                tertiaryTextColor: "rgb(222.9999999999, 223.6666666666, 223.9999999999)",
                textColor: "#ccc",
                titleColor: "#F9FFFE",
                todayLineColor: "#DB5757",
            };
        }
        mermaid.initialize(config);
        mermaidElements.forEach((item) => {
            const code = mermaidRenderAdapter.getCode(item);
            if (item.getAttribute("data-processed") === "true" || code.trim() === "") {
                return;
            }
            mermaid.init(undefined, item);
            item.setAttribute("data-processed", "true");
        });
    });
};
