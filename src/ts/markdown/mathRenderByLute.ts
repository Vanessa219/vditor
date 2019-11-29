import {CDN_PATH} from "../constants";
import {addStyle} from "../util/addStyle";
import {code160to32} from "../util/code160to32";

export const mathRenderByLute = (element: HTMLElement) => {
    const mathElements = element.querySelectorAll(".vditor-math");

    if (mathElements.length === 0) {
        return;
    }
    import(/* webpackChunkName: "katex" */ "katex").then((katex) => {
        addStyle(`${CDN_PATH}/vditor/dist/js/katex/katex.min.css`, "vditorKatexStyle");
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
    });
};
