import {addScript} from "../util/addScript";
import {addStyle} from "../util/addStyle";
import {code160to32} from "../util/code160to32";

declare const renderMathInElement: (element: Element, option: {
    delimiters: Array<{ left: string, right: string, display: boolean }>;
}) => void;

export const mathRender = (element: HTMLElement, cdn: string = "..") => {
    const text = code160to32(element.innerText);
    if (text.split("$").length > 2 || (text.split("\\(").length > 1 && text.split("\\)").length > 1)) {

        addScript(`${cdn}/dist/js/katex/katex.min.js`, "vditorKatexScript");
        addScript(`${cdn}/dist/js/katex/auto-render.min.js`, "vditorKatexAutoRenderScript");

        addStyle(`${cdn}/dist/js/katex/katex.min.css`, "vditorKatexStyle");

        renderMathInElement(element, {
            delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "\\(", right: "\\)", display: false},
                {left: "$", right: "$", display: false},
            ],
        });

        element.querySelectorAll(".katex").forEach((mathElement: HTMLElement) => {
            mathElement.addEventListener("copy", function(event: ClipboardEvent) {
                event.stopPropagation();
                event.preventDefault();
                event.clipboardData.setData("text/plain",
                    this.querySelector("annotation").textContent);
                event.clipboardData.setData("text/html", this.innerHTML);
            });
        });

    }
};
