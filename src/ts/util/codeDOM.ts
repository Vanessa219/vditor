export const normalizeCodeDOM = (element: HTMLElement) => {
    element.querySelectorAll("code[data-code-highlight]").forEach(code => {
        code.removeAttribute("data-code-highlight");
        code.classList.remove("hljs");
        code.querySelectorAll("span").forEach(span => {
            if (!span.classList.contains("vditor-wbr")) {
                span.replaceWith(...Array.from(span.childNodes));
            }
        });
    });
};

export const normalizeCodeHTML = (html: string) => {
    if (!html.includes("data-code-highlight")) {
        return html;
    }
    const element = document.createElement("div");
    element.innerHTML = html;
    normalizeCodeDOM(element);
    return element.innerHTML;
};
