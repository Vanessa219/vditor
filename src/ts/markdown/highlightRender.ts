import {Constants} from "../constants";
import {addScript} from "../util/addScript";
import {addStyle} from "../util/addStyle";
import {setCodeHighlight} from "../util/codeSelection";

export const highlightRender = (hljsOption?: IHljs, element: HTMLElement | Document = document,
                                cdn = Constants.CDN, canRenderEditable?: () => boolean) => {
    let style = hljsOption.style;
    if (!Constants.CODE_THEME.includes(style)) {
        style = "github";
    }
    const vditorHljsStyle = document.getElementById("vditorHljsStyle") as HTMLLinkElement;
    const href = `${cdn}/dist/js/highlight.js/styles/${style}.min.css`;
    if (vditorHljsStyle && vditorHljsStyle.getAttribute('href') !== href) {
        vditorHljsStyle.remove();
    }
    addStyle(`${cdn}/dist/js/highlight.js/styles/${style}.min.css`, "vditorHljsStyle");

    if (hljsOption.enable === false) {
        return;
    }

    const codes = element.querySelectorAll("pre > code");
    if (codes.length === 0) {
        return;
    }

    addScript(`${cdn}/dist/js/highlight.js/highlight.min.js?v=11.7.0`, "vditorHljsScript").then(() => {
        addScript(`${cdn}/dist/js/highlight.js/third-languages.js?v=1.0.1`, "vditorHljsThirdScript").then(() => {
            element.querySelectorAll("pre > code").forEach((block) => {
                if (canRenderEditable && (!canRenderEditable() || block.querySelector("wbr"))) {
                    return;
                }
                if (!canRenderEditable && (block.parentElement.classList.contains("vditor-ir__marker--pre") ||
                    block.parentElement.classList.contains("vditor-wysiwyg__pre"))) {
                    return;
                }

                if (block.classList.contains("language-mermaid") || block.classList.contains("language-flowchart") ||
                    block.classList.contains("language-echarts") || block.classList.contains("language-mindmap") ||
                    block.classList.contains("language-plantuml")|| block.classList.contains("language-smiles") ||
                    block.classList.contains("language-abc") || block.classList.contains("language-graphviz") ||
                    block.classList.contains("language-math")) {
                    return;
                }

                if (!canRenderEditable && hljsOption.defaultLang !== "" && block.className.indexOf("language-") === -1) {
                    block.classList.add("language-" + hljsOption.defaultLang);
                }
                let language = Array.from(block.classList).find(name => name.startsWith("language-"))?.slice(9) ||
                    hljsOption.defaultLang;
                if (!window.hljs.getLanguage(language)) {
                    language = "plaintext";
                }
                const html = window.hljs.highlight(
                    block.textContent,
                    {
                        language,
                        ignoreIllegals: true
                    }).value;
                if (canRenderEditable) {
                    block.setAttribute("data-code-highlight", "true");
                    setCodeHighlight(block, html);
                } else {
                    block.innerHTML = html;
                }

                block.classList.add("hljs");
                if (canRenderEditable || !hljsOption.lineNumber) {
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
            })
        })
    });
};
