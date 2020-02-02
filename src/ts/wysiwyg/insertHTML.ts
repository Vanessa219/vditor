export const insertHTML = (html: string, vditor: IVditor) => {
    // 使用 lute 方法会添加 p 元素，只有一个 p 元素的时候进行删除
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    const pElements = tempElement.querySelectorAll("p");
    if (pElements.length === 1 && !pElements[0].previousSibling && !pElements[0].nextSibling) {
        html = pElements[0].innerHTML.trim();
    }

    const pasteElement = document.createElement("template");
    pasteElement.innerHTML = html;

    const range = getSelection().getRangeAt(0);
    if (range.toString() !== "") {
        vditor.wysiwyg.preventInput = true;
        document.execCommand("delete", false, "");
    }
    range.insertNode(pasteElement.content.cloneNode(true));
    range.collapse(false);
};
