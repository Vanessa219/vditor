export const processPreCode = (editor: HTMLElement) => {
    editor.querySelectorAll("code").forEach((codeElement: HTMLElement) => {
        codeElement.innerText = decodeURIComponent(codeElement.getAttribute("data-code")
            || "\n");
    });
};
