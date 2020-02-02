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

declare global {
    interface Window {
        MathJax: any;
    }
}

export const mathRender = (element: HTMLElement, options?: { cdn?: string, math?: IMath }) => {
    const mathElements = element.querySelectorAll(".vditor-math");

    if (mathElements.length === 0) {
        return;
    }

    const defaultOptions = {
        cdn: `https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}`,
        math: {
            engine: "KaTeX",
            inlineDigit: false,
            macros: {},
        },
    };

    if (options && options.math) {
        options.math =
            Object.assign({}, defaultOptions.math, options.math);
    }
    options = Object.assign({}, defaultOptions, options);

    if (options.math.engine === "KaTeX") {
        addScript(`${options.cdn}/dist/js/katex/katex.min.js`, "vditorKatexScript");
        addStyle(`${options.cdn}/dist/js/katex/katex.min.css`, "vditorKatexStyle");
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
                mathElement.className = "vditor-math vditor-reset--error";
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
    } else if (options.math.engine === "MathJax") {
        const renderMathJax = () => {
            mathElements.forEach((mathElement) => {
                if (mathElement.getAttribute("data-math")) {
                    return;
                }
                const math = code160to32(mathElement.textContent);
                mathElement.setAttribute("data-math", math);
                window.MathJax.texReset();
                const mathOptions = window.MathJax.getMetricsFor(mathElement);
                mathOptions.display = mathElement.tagName === "DIV";
                window.MathJax.tex2svgPromise(math, mathOptions).then((node: HTMLElement) => {
                    mathElement.innerHTML = "";
                    mathElement.append(node);
                    window.MathJax.startup.document.clear();
                    window.MathJax.startup.document.updateDocument();

                    const errorText = mathElement.querySelector("mjx-container").textContent.trim();
                    if (errorText !== "") {
                        mathElement.innerHTML = errorText;
                        mathElement.className = "vditor-math vditor-reset--error";
                    }
                });
            });
        };

        if (!window.MathJax) {
            window.MathJax = {
                tex: {
                    macros: options.math.macros,
                },
            };
            addScript(`${options.cdn}/dist/js/mathjax/tex-svg.js`, "vditorMathJaxScript");
        }

        // fix 并发调用下 ready 不支持 await
        setTimeout(() => {
            renderMathJax();
        }, 0);
    }
};
