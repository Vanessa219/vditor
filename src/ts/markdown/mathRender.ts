import {Constants} from "../constants";
import {addScript, addScriptSync} from "../util/addScript";
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
    const mathElements = element.querySelectorAll(".language-math");

    if (mathElements.length === 0) {
        return;
    }

    const defaultOptions = {
        cdn: Constants.CDN,
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
        addStyle(`${options.cdn}/dist/js/katex/katex.min.css`, "vditorKatexStyle");
        addScript(`${options.cdn}/dist/js/katex/katex.min.js`, "vditorKatexScript").then(() => {
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
                    mathElement.className = "vditor-reset--error";
                }

                mathElement.addEventListener("copy", (event: ClipboardEvent) => {
                    event.stopPropagation();
                    event.preventDefault();
                    const vditorMathElement = (event.currentTarget as HTMLElement).closest(".language-math");
                    event.clipboardData.setData("text/html", vditorMathElement.innerHTML);
                    event.clipboardData.setData("text/plain",
                        vditorMathElement.getAttribute("data-math"));
                });
            });
        });
    } else if (options.math.engine === "MathJax") {
        if (!window.MathJax) {
            window.MathJax = {
                loader: {
                    paths: {mathjax: `${options.cdn}/dist/js/mathjax`},
                },
                tex: {
                    macros: options.math.macros,
                },
            };
        }
        // 循环加载会抛异常
        addScriptSync(`${options.cdn}/dist/js/mathjax/tex-svg.js`, "vditorMathJaxScript");
        const renderMath = () => {
            mathElements.forEach((mathElement) => {
                if (mathElement.getAttribute("data-math")) {
                    return;
                }
                const math = code160to32(mathElement.textContent);
                mathElement.setAttribute("data-math", math);
                if (!math) {
                    return;
                }
                window.MathJax.texReset();
                const mathOptions = window.MathJax.getMetricsFor(mathElement);
                mathOptions.display = mathElement.tagName === "DIV";
                window.MathJax.tex2svgPromise(math, mathOptions).then((node: HTMLElement) => {
                    mathElement.innerHTML = "";
                    mathElement.append(node);
                    window.MathJax.startup.document.clear();
                    window.MathJax.startup.document.updateDocument();

                    const errorTextElement = mathElement.querySelector('[data-mml-node="merror"]');
                    if (errorTextElement && errorTextElement.textContent.trim() !== "") {
                        mathElement.innerHTML = errorTextElement.textContent.trim();
                        mathElement.className = "vditor-reset--error";
                    }
                });
            });
        };
        // 初次加载需等到 js 文件执行完成
        if (!window.MathJax.texReset) {
            setTimeout(() => {
                renderMath();
            });
        } else {
            renderMath();
        }
    }
};
