import {setSelectionFocus} from "../editor/setSelection";

export const processPreCode = (editor: HTMLElement) => {
    editor.querySelectorAll("code").forEach((codeElement: HTMLElement) => {
        let isFocus = false;
        if (codeElement.innerHTML === "<wbr>") {
            isFocus = true;
        }
        codeElement.innerText = decodeURIComponent(codeElement.getAttribute("data-code")
            || "\n");

        if (isFocus) {
            // 解决在 `` 中输入字符后光标错误
            const range = editor.ownerDocument.createRange();
            range.setStart(codeElement.childNodes[0], codeElement.innerText.length);
            range.collapse(true);
            setSelectionFocus(range);
        }
    });
};
