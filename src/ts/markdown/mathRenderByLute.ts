import {VDITOR_VERSION} from "../constants";
import {addScript} from "../util/addScript";
import {addStyle} from "../util/addStyle";
import {code160to32} from "../util/code160to32";

declare const katex: {
    renderToString(math: string, option: {
        displayMode: boolean;
        output: string;
    }): string;
};

export const mathRenderByLute = (element: HTMLElement,
                                 cdn = `https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}`) => {
    const mathElements = element.querySelectorAll(".vditor-math");

    if (mathElements.length === 0) {
        return;
    }
    addScript(`${cdn}/dist/js/katex/katex.min.js`, "vditorKatexScript");
    addStyle(`${cdn}/dist/js/katex/katex.min.css`, "vditorKatexStyle");
    mathElements.forEach((mathElement) => {
        if (mathElement.getAttribute("data-math")) {
            return;
        }
        const math = code160to32(mathElement.textContent);
        mathElement.setAttribute("data-math", math);
        try {
            mathElement.innerHTML = katex.renderToString(math, {
                displayMode: mathElement.tagName === "DIV",
                output: "html",
            });
        } catch (e) {
            mathElement.innerHTML = e.message;
            mathElement.className = "vditor-math vditor--error";
        }

        mathElement.addEventListener("copy", (event: ClipboardEvent) => {
            event.stopPropagation();
            event.preventDefault();
            const vditorMathElement = (event.currentTarget as HTMLElement).closest(".vditor-math");
            event.clipboardData.setData("text/html", vditorMathElement.innerHTML);
            event.clipboardData.setData("text/plain",
                vditorMathElement.getAttribute("data-math"));
        });
    });
};
