export const processPreCode = (editor: HTMLElement) => {
    editor.querySelectorAll("pre").forEach((preElement: HTMLElement) => {
        preElement.querySelector("code").innerText = decodeURIComponent(preElement.getAttribute("data-code"));
    });
};
