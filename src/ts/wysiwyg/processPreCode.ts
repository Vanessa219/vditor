import {setSelectionFocus} from "../editor/setSelection";

export const processPreCode = (editor: HTMLElement) => {
    editor.querySelectorAll("code").forEach((codeElement: HTMLElement) => {
        let isFocus = false;
        if (codeElement.innerHTML === "<wbr>") {
            isFocus = true;
        }
        codeElement.textContent = decodeURIComponent(codeElement.getAttribute("data-code")
            || "\n");

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
