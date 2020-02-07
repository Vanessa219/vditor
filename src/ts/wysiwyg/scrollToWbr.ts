export const scrollToWbr = (vditor: IVditor) => {
    const wbrElement = vditor.wysiwyg.element.querySelector("wbr");
    if (!wbrElement) {
        return;
    }
    const offsetTop = wbrElement.parentElement.offsetTop;
    vditor.wysiwyg.element.scrollTop = offsetTop - (vditor.wysiwyg.element.clientHeight / 2);
};
