import {abcRender} from "../markdown/abcRender";
import {chartRender} from "../markdown/chartRender";
import {codeRender} from "../markdown/codeRender";
import {flowchartRender} from "../markdown/flowchartRender";
import {graphvizRender} from "../markdown/graphvizRender";
import {highlightRender} from "../markdown/highlightRender";
import {mathRender} from "../markdown/mathRender";
import {mermaidRender} from "../markdown/mermaidRender";
import {markmapRender} from "../markdown/markmapRender";
import {mindmapRender} from "../markdown/mindmapRender";
import {plantumlRender} from "../markdown/plantumlRender";
import {SMILESRender} from "../markdown/SMILESRender";
import {wavedromRender} from "../markdown/wavedromRender";

const looksLikeCodeContent = (content: string) => {
    const text = content.trim();
    if (!text) {
        return false;
    }
    const lines = text.split("\n");
    if (lines.length < 2) {
        return false;
    }

    let score = 0;
    if (/[{};]/.test(text)) {
        score++;
    }
    if (/\b(const|let|var|function|class|interface|if|else|for|while|return)\b/.test(text)) {
        score++;
    }
    if (/<\/?[a-z][^>]*>/.test(text)) {
        score++;
    }
    if (/^\s{2,}|\t/m.test(text)) {
        score++;
    }

    return score >= 2;
};

export const processPasteCode = (html: string, text: string, type = "sv") => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    let isCode = false;
    const pres = tempElement.querySelectorAll("pre");
    if (tempElement.childElementCount === 1 && pres.length === 1
        && pres[0].className !== "vditor-wysiwyg"
        && pres[0].className !== "vditor-sv") {
        const preElement = pres[0] as HTMLElement;
        const hasCodeChild = !!preElement.querySelector("code");
        const preText = text || preElement.textContent || "";
        isCode = hasCodeChild || looksLikeCodeContent(preText);
    }

    if (isCode) {
        const code = text || html;
        if (/\n/.test(code) || pres.length === 1) {
            if (type === "wysiwyg") {
                return `<div class="vditor-wysiwyg__block" data-block="0" data-type="code-block"><pre><code>${
                    code.replace(/&/g, "&amp;").replace(/</g, "&lt;")}<wbr></code></pre></div>`;
            }
            return "\n```\n" + code.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "\n```";
        } else {
            if (type === "wysiwyg") {
                return `<code>${code.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</code><wbr>`;
            }
            return `\`${code}\``;
        }
    }
    return false;
};

export const processCodeRender = (previewPanel: HTMLElement, vditor: IVditor) => {
    if (!previewPanel) {
        return;
    }
    if (previewPanel.parentElement.getAttribute("data-type") === "html-block") {
        previewPanel.setAttribute("data-render", "1");
        return;
    }
    const language = previewPanel.firstElementChild.className.replace("language-", "");
    if (language === "abc") {
        abcRender(previewPanel, vditor.options.cdn);
    } else if (language === "mermaid") {
        mermaidRender(previewPanel, vditor.options.cdn, vditor.options.theme);
    } else if (language === "smiles") {
        SMILESRender(previewPanel, vditor.options.cdn, vditor.options.theme);
    } else if (language === "markmap") {
        markmapRender(previewPanel, vditor.options.cdn);
    } else if (language === "flowchart") {
        flowchartRender(previewPanel, vditor.options.cdn);
    } else if (language === "echarts") {
        chartRender(previewPanel, vditor.options.cdn, vditor.options.theme);
    } else if (language === "mindmap") {
        mindmapRender(previewPanel, vditor.options.cdn, vditor.options.theme);
    } else if (language === "plantuml") {
        plantumlRender(previewPanel, vditor.options.cdn);
    } else if (language === "graphviz") {
        graphvizRender(previewPanel, vditor.options.cdn);
    } else if (language === "wavedrom") {
        wavedromRender(previewPanel, vditor.options.cdn);
    } else if (language === "math") {
        mathRender(previewPanel, {cdn: vditor.options.cdn, math: vditor.options.preview.math});
    } else {
        const cRender = vditor.options.customRenders.find((item) => {
            if (item.language === language) {
                item.render(previewPanel, vditor);
                return true
            }
        })
        if (!cRender) {
            highlightRender(Object.assign({}, vditor.options.preview.hljs), previewPanel, vditor.options.cdn);
            codeRender(previewPanel, vditor.options.preview.hljs);
        }
    }

    previewPanel.setAttribute("data-render", "1");
};
