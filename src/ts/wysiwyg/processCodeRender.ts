import {setSelectionFocus} from "../editor/setSelection";
import {abcRender} from "../markdown/abcRender";
import {chartRender} from "../markdown/chartRender";
import {codeRender} from "../markdown/codeRender";
import {highlightRender} from "../markdown/highlightRender";
import {mathRenderByLute} from "../markdown/mathRenderByLute";
import {mermaidRender} from "../markdown/mermaidRender";

// html, math, math-inline, code block, abc, chart, mermaid
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
        const showCode = () => {
            const range = codeElement.ownerDocument.createRange();
            if (codeElement.parentElement.tagName !== "PRE") {
                codeElement.style.display = "inline";
                range.selectNodeContents(codeElement);
            } else {
                codeElement.parentElement.style.display = "block";
                if (!codeElement.firstChild) {
                    codeElement.appendChild(document.createTextNode(""));
                }
                range.setStart(codeElement.firstChild, 0);
            }
            range.collapse(true);
            setSelectionFocus(range);
        };
        previewPanel.addEventListener("click", () => {
            showCode();
        });
    }

    let codeElement = previewPanel.previousElementSibling as HTMLElement;
    if (codeElement.tagName === "PRE") {
        codeElement = codeElement.firstElementChild as HTMLElement;
    }
    const innerHTML = codeElement.innerHTML || "";
    if (blockType === "code-block") {
        const language = codeElement.className.replace("language-", "");
        previewPanel.innerHTML = `<pre><code class="${codeElement.className}">${innerHTML}</code></pre>`;
        if (language === "abc") {
            previewPanel.style.marginTop = "1em";
            abcRender(previewPanel, vditor.options.cdn);
        } else if (language === "mermaid") {
            mermaidRender(previewPanel, ".vditor-wysiwyg__preview .language-mermaid",
                vditor.options.cdn);
        } else if (language === "echarts") {
            chartRender(previewPanel, vditor.options.cdn);
        } else {
            highlightRender(Object.assign({}, vditor.options.preview.hljs, {enable: true}),
                previewPanel, vditor.options.cdn);
            codeRender(previewPanel, vditor.options.lang);
        }
    } else if (blockType.indexOf("html") > -1) {
        previewPanel.innerHTML = innerHTML.replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<") .replace(/&gt;/g, ">");
    } else if (blockType.indexOf("math") > -1) {
        previewPanel.innerHTML = `<${tagName} class="vditor-math">${innerHTML}</${tagName}>`;
        mathRenderByLute(previewPanel, vditor.options.cdn);
    }
};
