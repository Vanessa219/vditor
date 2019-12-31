import {setSelectionFocus} from "../editor/setSelection";
import {abcRender} from "../markdown/abcRender";
import {chartRender} from "../markdown/chartRender";
import {codeRender} from "../markdown/codeRender";
import {highlightRender} from "../markdown/highlightRender";
import {mathRenderByLute} from "../markdown/mathRenderByLute";
import {mermaidRender} from "../markdown/mermaidRender";

// code block, math, math-inline, abc, html, chart, mermaid
export const processCodeRender = (blockElement: HTMLElement, vditor: IVditor) => {
    const blockType = blockElement.getAttribute("data-type");
    if (!blockType) {
        return;
    }
    const tagName = blockType.indexOf("block") > -1 ? "div" : "span";
    let previewPanel: HTMLElement = blockElement.querySelector(".vditor-wysiwyg__preview");
    if (!previewPanel) {
        blockElement.insertAdjacentHTML("beforeend", `<${tagName} class="vditor-wysiwyg__preview"></${tagName}>`);
        previewPanel = blockElement.querySelector(".vditor-wysiwyg__preview");
        previewPanel.setAttribute("data-render", "false");
        previewPanel.addEventListener("click", (event) => {
            const range = preElement.ownerDocument.createRange();
            if (preElement.getAttribute("data-type") === "math-inline") {
                preElement.style.display = "inline";
                range.selectNodeContents(preElement);
            } else {
                preElement.style.display = "block";
                range.selectNodeContents(preElement.querySelector("code"));
            }
            range.collapse(true);
            setSelectionFocus(range);
        });
    }

    const preElement = previewPanel.previousElementSibling as HTMLElement;

    if (blockType === "code-block") {
        const language = preElement.querySelector("code").className.replace("language-", "");
        previewPanel.innerHTML =
            `<pre>${blockElement.firstElementChild.innerHTML}</pre>`;
        if (language === "abc") {
            abcRender(previewPanel, vditor.options.cdn);
        } else if (language === "mermaid") {
            mermaidRender(previewPanel, ".vditor-wysiwyg__preview .language-mermaid",
                vditor.options.cdn);
        } else if (language === "echarts") {
            chartRender(previewPanel, vditor.options.cdn);
        } else {
            highlightRender(vditor.options.preview.hljs, previewPanel, vditor.options.cdn);
            codeRender(previewPanel, vditor.options.lang);
        }
    } else if (blockType.indexOf("html") > -1) {
        previewPanel.innerHTML =
            decodeURIComponent(blockElement.querySelector("code").getAttribute("data-code"));
    } else if (blockType.indexOf("math") > -1) {
        previewPanel.innerHTML =
            `<${tagName} class="vditor-math">${blockElement.firstChild.textContent}</${tagName}>`;
        mathRenderByLute(previewPanel, vditor.options.cdn);
    }
};
