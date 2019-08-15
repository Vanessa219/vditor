export const abcRender = async (element: (HTMLElement | Document) = document) => {
    const abcElements = element.querySelectorAll(".language-abc");
    if (abcElements.length > 0) {
        const {default: abcjs} = await import(/* webpackChunkName: "abcjs" */ "abcjs/src/api/abc_tunebook_svg");
        abcElements.forEach((e: HTMLDivElement) => {
            const divElement = document.createElement("div");
            e.parentNode.parentNode.replaceChild(divElement, e.parentNode);
            abcjs(divElement, e.textContent.trim(), {});
            divElement.style.overflowX = "auto";
        });
    }
};
