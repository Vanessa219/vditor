import codeSVG from "../../assets/icons/code.svg";
import {Constants} from "../constants";
import {abcRender} from "../markdown/abcRender";
import {chartRender} from "../markdown/chartRender";
import {codeRender} from "../markdown/codeRender";
import { graphvizRender } from "../markdown/graphvizRender";
import {highlightRender} from "../markdown/highlightRender";
import {mathRender} from "../markdown/mathRender";
import {mermaidRender} from "../markdown/mermaidRender";
import {hasClosestByTag} from "../util/hasClosest";
import {setSelectionFocus} from "../util/selection";

export const showCode = (previewElement: HTMLElement, first = true) => {
    const previousElement = previewElement.previousElementSibling as HTMLElement;
    const range = previousElement.ownerDocument.createRange();
    if (previousElement.tagName === "CODE") {
        previousElement.style.display = "inline-block";
        if (first) {
            range.setStart(previousElement.firstChild, 1);
        } else {
            range.selectNodeContents(previousElement);
        }
    } else {
        previousElement.style.display = "block";

        if (!previousElement.firstChild.firstChild) {
            previousElement.firstChild.appendChild(document.createTextNode(""));
        }
        range.selectNodeContents(previousElement.firstChild);
    }
    if (first) {
        range.collapse(true);
    } else {
        range.collapse(false);
    }
    setSelectionFocus(range);
};

// html, math, math-inline, code block, abc, chart, mermaid, graphviz
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
    }

    let codeElement = previewPanel.previousElementSibling as HTMLElement;
    if (codeElement.tagName === "PRE") {
        codeElement = codeElement.firstElementChild as HTMLElement;
    }
    const innerHTML = codeElement.innerHTML || "\n";
    if (blockType === "code-block") {
        const language = codeElement.className.replace("language-", "");
        // 代码块下方输入中文会消失，因此要 trim
        previewPanel.innerHTML = `<pre><code class="${codeElement.className}">${innerHTML.trimRight()}</code></pre>`;
        if (language === "abc") {
            previewPanel.style.marginTop = "1em";
            abcRender(previewPanel, vditor.options.cdn);
        } else if (language === "mermaid") {
            mermaidRender(previewPanel, ".vditor-wysiwyg__preview .language-mermaid",
                vditor.options.cdn);
        } else if (language === "echarts") {
            chartRender(previewPanel, vditor.options.cdn);
        } else if (language === "graphviz") {
            graphvizRender(previewPanel, vditor.options.cdn);
        } else {
            highlightRender(Object.assign({}, vditor.options.preview.hljs, {enable: true}),
                previewPanel, vditor.options.cdn);
            codeRender(previewPanel, vditor.options.lang);
        }
    } else if (blockType.indexOf("html") > -1) {
        const tempHTML = innerHTML.replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<").replace(/&gt;/g, ">");
        if (blockType === "html-inline") {
            previewPanel.innerHTML = codeSVG + tempHTML.replace(Constants.ZWSP, "");
            previewPanel.setAttribute("data-html", innerHTML.replace(Constants.ZWSP, ""));
            return;
        }
        previewPanel.innerHTML = tempHTML;
    } else if (blockType.indexOf("math") > -1) {
        previewPanel.innerHTML = `<${tagName} class="vditor-math">${
            innerHTML.replace(Constants.ZWSP, "")}</${tagName}>`;
        mathRender(previewPanel, {cdn: vditor.options.cdn, math: vditor.options.preview.math});
    }

    if (getSelection().rangeCount > 0) {
        const range = getSelection().getRangeAt(0);
        if (blockElement.contains(range.startContainer) && hasClosestByTag(range.startContainer, "CODE")) {
            let display = "inline-block";
            if (blockElement.firstElementChild.tagName === "PRE") {
                display = "block";
            }
            (blockElement.firstElementChild as HTMLElement).style.display = display;
        }
    }
};
