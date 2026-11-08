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

export const isPlainTextPaste = (html: string, editorData: string) => {
    if (editorData) {
        try {
            if (JSON.parse(editorData).mode === "markdown") {
                return true;
            }
        } catch {
            // 剪贴板中的第三方元数据可能损坏，仍按 HTML 结构处理。
        }
    }
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    const pre = tempElement.firstElementChild as HTMLElement;
    // 浏览器为纯文本生成的 pre-wrap 包装不表示代码语义。
    return tempElement.childNodes.length === 1 && pre?.tagName === "PRE" &&
        pre.style.whiteSpace === "pre-wrap" && pre.childElementCount === 0;
};

export const processPasteCode = (html: string, text: string, type = "sv") => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    const preElement = tempElement.querySelector("pre");
    if (preElement) {
        let element: Element = preElement;
        while (element !== tempElement) {
            const parent = element.parentElement;
            // 混合内容需要交给 HTML 转换，以保留段落、表格和独立代码块。
            if (Array.from(parent.childNodes).some(node => node !== element &&
                (node.nodeType === Node.ELEMENT_NODE ||
                    node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== ""))) {
                return false;
            }
            element = parent;
        }
    }
    let isCode = false;
    if (tempElement.childElementCount === 1 &&
        (tempElement.lastElementChild as HTMLElement).style.fontFamily.indexOf("monospace") > -1) {
        isCode = true;
    }
    const pres = tempElement.querySelectorAll("pre");
    if (tempElement.childElementCount === 1 && pres.length === 1
        && pres[0].className !== "vditor-wysiwyg"
        && pres[0].className !== "vditor-sv") {
        isCode = true;
    }
    if (tempElement.childElementCount === 1 && tempElement.firstElementChild.tagName === "TABLE" &&
        tempElement.querySelector(".line-number") && tempElement.querySelector(".line-content")) {
        isCode = true;
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

export const highlightEditableCode = (previewPanel: HTMLElement, vditor: IVditor) => {
    const source = previewPanel.previousElementSibling as HTMLElement;
    const mode = vditor.currentMode;
    if (source?.tagName === "PRE" && mode !== "sv") {
        highlightRender(vditor.options.preview.hljs, source, vditor.options.cdn, () =>
            vditor.currentMode === mode && !vditor[mode].composingLock &&
            vditor[mode].element.contains(source));
    }
};

export const processCodeRender = (previewPanel: HTMLElement, vditor: IVditor) => {
    if (!previewPanel) {
        return;
    }
    previewPanel.classList.remove("vditor-code__preview");
    if (previewPanel.parentElement.getAttribute("data-type") === "html-block") {
        previewPanel.setAttribute("data-render", "1");
        return;
    }
    const language = previewPanel.firstElementChild.className.split(/\s+/)
        .find(name => name.startsWith("language-"))?.slice(9) || "";
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
        plantumlRender(previewPanel, vditor.options.cdn, vditor.options.plantuml);
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
            previewPanel.classList.add("vditor-code__preview");
            highlightEditableCode(previewPanel, vditor);
            highlightRender(Object.assign({}, vditor.options.preview.hljs), previewPanel, vditor.options.cdn);
            codeRender(previewPanel, vditor.options.preview.hljs);
        }
    }

    previewPanel.setAttribute("data-render", "1");
};
