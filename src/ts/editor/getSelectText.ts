import {selectIsEditor} from "./selectIsEditor";

export const getSelectText = (range: Range, editor: HTMLDivElement) => {
    if (selectIsEditor(range, editor)) {
        // window.getSelection().toString() 无法获取最后一个 br
        const element = document.createElement("div");
        element.appendChild(range.cloneContents());
        return element.innerHTML.replace(/<br>/g, "\n").replace(/&nbsp;/g, " ")
            .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
            .replace(/&amp;/g, "&");
    }

    return "";
};
