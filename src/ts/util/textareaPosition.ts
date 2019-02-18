export const getTextareaPosition = (element: HTMLTextAreaElement) => {
    const styleProperties = [
        "direction",
        "box-sizing",
        "width",
        "height",
        "overflow-x",
        "overflow-y",
        "border-top-width",
        "border-right-width",
        "border-bottom-width",
        "border-left-width",
        "border-style",
        "padding-top",
        "padding-right",
        "padding-bottom",
        "padding-left",
        "font-style",
        "font-variant",
        "font-weight",
        "font-stretch",
        "font-size",
        "text-size-adjust",
        "line-height",
        "font-family",
        "text-align",
        "text-transform",
        "text-indent",
        "text-decoration",
        "letter-spacing",
        "word-spacing",
        "tab-size",
        "tab-size",
    ];
    const computed = window.getComputedStyle(element);
    let div: HTMLElement = document.querySelector(".vditor-position");
    if (!div) {
        div = document.createElement("div");
        div.className = "vditor-position";
        document.body.appendChild(div);
    }
    const style = div.style;
    style.whiteSpace = "pre-wrap";
    style.wordWrap = "break-word";
    style.position = "absolute";
    style.overflow = "hidden";
    style.left = "-100%";
    styleProperties.forEach((prop) => {
        style.setProperty(prop, computed.getPropertyValue(prop));
    });
    div.textContent = element.value.substring(0, element.selectionEnd);
    const span = document.createElement("span");
    span.textContent = element.value.substring(element.selectionEnd) || ".";
    div.appendChild(span);

    return {
        left: span.offsetLeft - element.scrollLeft,
        top: span.offsetTop - element.scrollTop + parseInt(computed.lineHeight, 10),
    };
};
