import {CDN_PATH, VDITOR_VERSION} from "../constants";
import {addStyle} from "../util/addStyle";

export const highlightRender = async (hljsOption?: IHljs, element: HTMLElement | Document = document, cdn?: string) => {

    const hljsThemes = ["abap", "algol", "algol_nu", "arduino", "autumn", "borland", "bw", "colorful", "dracula",
        "emacs", "friendly", "fruity", "github", "igor", "lovelace", "manni", "monokai", "monokailight", "murphy",
        "native", "paraiso-dark", "paraiso-light", "pastie", "perldoc", "pygments", "rainbow_dash", "rrt",
        "solarized-dark", "solarized-dark256", "solarized-light", "swapoff", "tango", "trac", "vim", "vs", "xcode"];

    if (!hljsThemes.includes(hljsOption.style)) {
        hljsOption.style = "github";
    }
    addStyle(`${cdn || CDN_PATH}/vditor@${VDITOR_VERSION}/dist/js/highlight.js/styles/${hljsOption.style}.css`,
        "vditorHljsStyle");

    if (!hljsOption.enable) {
        return;
    }

    const codes = element.querySelectorAll("pre > code");
    if (codes.length === 0) {
        return;
    }

    const {default: hljs} = await import(/* webpackChunkName: "highlight.js" */ "highlight.js");
    element.querySelectorAll("pre > code").forEach((block) => {
        if (block.classList.contains("language-mermaid") || block.classList.contains("language-echarts")
            || block.classList.contains("language-abc")) {
            return;
        }
        hljs.highlightBlock(block);

        if (!hljsOption.lineNumber) {
            return;
        }

        block.classList.add("vditor-linenumber");
        let linenNumberTemp: HTMLDivElement = block.querySelector(".vditor-linenumber__temp");
        if (!linenNumberTemp) {
            linenNumberTemp = document.createElement("div");
            linenNumberTemp.className = "vditor-linenumber__temp";
            block.insertAdjacentElement("beforeend", linenNumberTemp);
        }
        const whiteSpace = getComputedStyle(block).whiteSpace;
        let isSoftWrap = false;
        if (whiteSpace === "pre-wrap" || whiteSpace === "pre-line") {
            isSoftWrap = true;
        }
        let lineNumberHTML = "";
        const lineList = block.textContent.split(/\r\n|\r|\n/g);
        lineList.pop();
        lineList.map((line) => {
            let lineHeight = "";
            if (isSoftWrap) {
                linenNumberTemp.textContent = line || "\n";
                lineHeight = ` style="height:${linenNumberTemp.getBoundingClientRect().height}px"`;
            }
            lineNumberHTML += `<span${lineHeight}></span>`;
        });

        linenNumberTemp.style.display = "none";
        lineNumberHTML = `<span class="vditor-linenumber__rows">${lineNumberHTML}</span>`;
        block.insertAdjacentHTML("beforeend", lineNumberHTML);
    });
};
