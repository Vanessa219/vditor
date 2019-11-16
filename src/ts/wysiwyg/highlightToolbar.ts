export const highlightToolbar = (vditor: IVditor) => {
    const range = getSelection().getRangeAt(0);
    let typeElement = range.startContainer;
    if (range.startContainer.nodeType === 3) {
        typeElement = range.startContainer.parentElement;
    }

    switch (typeElement.nodeName) {
        case "EM":
            vditor.toolbar.elements.italic &&
            vditor.toolbar.elements.italic.children[0].classList.add("vditor-menu--current");
            break;
        default:
            Object.keys(vditor.toolbar.elements).forEach((key) => {
                vditor.toolbar.elements[key].children[0].classList.remove("vditor-menu--current");
            });
            break;
    }
};
