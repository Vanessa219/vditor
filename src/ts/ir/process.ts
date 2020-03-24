import {Constants} from "../constants";
import {abcRender} from "../markdown/abcRender";
import {chartRender} from "../markdown/chartRender";
import {codeRender} from "../markdown/codeRender";
import {graphvizRender} from "../markdown/graphvizRender";
import {highlightRender} from "../markdown/highlightRender";
import {mathRender} from "../markdown/mathRender";
import {mermaidRender} from "../markdown/mermaidRender";
import {isSafari} from "../util/compatibility";
import {getMarkdown} from "../util/getMarkdown";
import {hasClosestBlock, hasClosestByAttribute} from "../util/hasClosest";
import {getEditorRange, setRangeByWbr} from "../util/selection";
import {highlightToolbar} from "./highlightToolbar";

export const processAfterRender = (vditor: IVditor, options = {
    enableAddUndoStack: true,
    enableHint: false,
    enableInput: true,
}) => {
    const startContainer = getEditorRange(vditor.ir.element).startContainer;
    // 代码块语言提示
    const preBeforeElement = hasClosestByAttribute(startContainer, "data-type", "code-block-info");
    if (options.enableHint && preBeforeElement) {
        const matchLangData: IHintData[] = [];
        const key = preBeforeElement.textContent.replace(Constants.ZWSP, "").trim();
        Constants.CODE_LANGUAGES.forEach((keyName) => {
            if (keyName.indexOf(key.toLowerCase()) > -1) {
                matchLangData.push({
                    html: keyName,
                    value: keyName,
                });
            }
        });
        vditor.hint.genHTML(matchLangData, key, vditor);
    } else if (options.enableHint && vditor.hint) {
        vditor.hint.render(vditor);
    }

    clearTimeout(vditor.ir.processTimeoutId);
    vditor.ir.processTimeoutId = window.setTimeout(() => {
        if (vditor.ir.composingLock && isSafari()) {
            // safari 中文输入遇到 addToUndoStack 会影响下一次的中文输入
            return;
        }
        const text = getMarkdown(vditor);
        if (typeof vditor.options.input === "function" && options.enableInput) {
            vditor.options.input(text);
        }

        if (vditor.options.counter > 0) {
            vditor.counter.render(text.length, vditor.options.counter);
        }

        if (vditor.options.cache) {
            localStorage.setItem(`vditor${vditor.id}`, text);
        }

        if (vditor.devtools) {
            vditor.devtools.renderEchart(vditor);
        }

        if (options.enableAddUndoStack) {
            vditor.irUndo.addToUndoStack(vditor);
        }
    }, 800);
};

export const processCodeRender = (previewPanel: HTMLElement, vditor: IVditor) => {
    const language = previewPanel.querySelector("code").className.replace("language-", "");
    if (language === "abc") {
        abcRender(previewPanel, vditor.options.cdn);
    } else if (language === "mermaid") {
        mermaidRender(previewPanel, ".vditor-ir__preview .language-mermaid", vditor.options.cdn);
    } else if (language === "echarts") {
        chartRender(previewPanel, vditor.options.cdn);
    } else if (language === "graphviz") {
        graphvizRender(previewPanel, vditor.options.cdn);
    } else if (language === "math") {
        previewPanel.innerHTML = `<code class="language-math"><div class="vditor-math">${
            previewPanel.innerHTML}</div></code>`;
        mathRender(previewPanel.parentElement, {cdn: vditor.options.cdn, math: vditor.options.preview.math});
    } else {
        highlightRender(Object.assign({}, vditor.options.preview.hljs, {enable: true}),
            previewPanel, vditor.options.cdn);
        codeRender(previewPanel, vditor.options.lang);
    }
};

export const processHeading = (vditor: IVditor, value: string) => {
    const range = getSelection().getRangeAt(0);
    const headingElement = hasClosestBlock(range.startContainer);
    if (headingElement) {
        if (value === "") {
            const headingMarkerElement = headingElement.querySelector(".vditor-ir__marker--heading");
            range.selectNodeContents(headingMarkerElement)
            document.execCommand("delete");
        } else {
            range.selectNodeContents(headingElement)
            range.collapse(true)
            document.execCommand("insertHTML", false, value);
        }
        highlightToolbar(vditor);
    }
};

export const processToolbar = (vditor: IVditor, actionBtn: Element) => {
    const range = getEditorRange(vditor.ir.element);
    const commandName = actionBtn.getAttribute("data-type");
    // 移除
    if (actionBtn.classList.contains("vditor-menu--current")) {

    } else {
        // 添加
        if (commandName === "line") {
            let element = range.startContainer as HTMLElement;
            if (element.nodeType === 3) {
                element = range.startContainer.parentElement;
            }
            element.insertAdjacentHTML("afterend", '<hr data-block="0"><p data-block="0">\n<wbr></p>');
            setRangeByWbr(vditor.ir.element, range);
            processAfterRender(vditor);
        }
    }
}
