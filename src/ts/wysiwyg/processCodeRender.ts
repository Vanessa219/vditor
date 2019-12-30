import {abcRender} from "../markdown/abcRender";
import {mermaidRender} from "../markdown/mermaidRender";
import {chartRender} from "../markdown/chartRender";
import {highlightRender} from "../markdown/highlightRender";
import {codeRender} from "../markdown/codeRender";
import {mathRenderByLute} from "../markdown/mathRenderByLute";
import {setSelectionFocus} from "../editor/setSelection";

// code block, math, abc, html, chart, mermaid
export const precessCodeRender = (blockElement: HTMLElement, vditor: IVditor) => {
    const blockType = blockElement.getAttribute("data-type");
    const tagName = blockType.indexOf("block") > -1 ? "div" : "span"
    let previewPanel: HTMLElement = blockElement.querySelector(".vditor-wysiwyg__preview");
    if (!previewPanel) {
        blockElement.insertAdjacentHTML("beforeend", `<${tagName} class="vditor-wysiwyg__preview"></${tagName}>`);
        previewPanel = blockElement.querySelector(".vditor-wysiwyg__preview");
        previewPanel.setAttribute("contenteditable", "false");
        previewPanel.setAttribute("data-render", "false");
        previewPanel.addEventListener("click", (event) => {
            preElement.style.display = "block"
            const range = preElement.ownerDocument.createRange()
            range.selectNodeContents(preElement.querySelector('code'))
            range.collapse(true)
            setSelectionFocus(range)
        });
    }

    const preElement = previewPanel.previousElementSibling as HTMLElement
    const language = preElement.querySelector('code').className.replace('language-', '')

    if (blockType === "code-block") {
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
}
