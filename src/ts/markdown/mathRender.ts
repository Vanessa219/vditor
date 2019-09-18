import {CDN_PATH} from "../constants";
import {addStyle} from "../util/addStyle";
import {code160to32} from "../util/code160to32";

export const mathRender = (element: HTMLElement) => {
    const text = code160to32(element.innerText);
    if (text.split("$").length > 2 || (text.split("\\(").length > 1 && text.split("\\)").length > 1)) {
        import(/* webpackChunkName: "katex" */ "katex").then(() => {
            import(/* webpackChunkName: "katex" */ "katex/contrib/auto-render/auto-render")
                .then((renderMathInElement) => {
                    addStyle(`${CDN_PATH}/vditor/dist/js/katex/katex.min.css`,
                        "vditorKatexStyle");
                    renderMathInElement.default(element, {
                        delimiters: [
                            {left: "$$", right: "$$", display: true},
                            {left: "\\(", right: "\\)", display: false},
                            {left: "$", right: "$", display: false},
                        ],
                    });

                    element.querySelectorAll(".katex").forEach((mathElement: HTMLElement) => {
                        mathElement.addEventListener("copy", (event: ClipboardEvent) => {
                            event.stopPropagation();
                            event.preventDefault();
                            const mathElement = (event.currentTarget as HTMLElement).closest(".katex");
                            event.clipboardData.setData("text/plain", mathElement.querySelector("annotation").textContent);
                            event.clipboardData.setData("text/html", mathElement.querySelector(".katex").innerHTML);
                        });
                    });
                });
        });
    }
};
