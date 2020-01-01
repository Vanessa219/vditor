import {setSelectionFocus} from "../editor/setSelection";

export const processCodeData = (editor: HTMLElement) => {
    // code block, inline code, math, abc, html, chart, mermaid
    editor.querySelectorAll("code").forEach((codeElement: HTMLElement) => {
        let isFocus = false;
        if (codeElement.innerHTML === "<wbr>") {
            isFocus = true;
        }
        codeElement.textContent = decodeURIComponent(codeElement.getAttribute("data-code")
            || "");

        if (isFocus) {
            const range = editor.ownerDocument.createRange();
            if (codeElement.childNodes[0].nodeType === 3) {
                // 解决在 `` 中输入字符后光标错误
                range.setStart(codeElement.childNodes[0], codeElement.innerText.length);
            } else {
                // 输入 ```
                range.setStartAfter(codeElement.childNodes[0]);
            }
            range.collapse(true);
            setSelectionFocus(range);
        }
    });
};
