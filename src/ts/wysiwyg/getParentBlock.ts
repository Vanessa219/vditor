export const getParentBlock = (elment: HTMLElement) => {
    let block = elment;
    const mtype = block.nodeType === 3 ? null : block.getAttribute("data-mtype");
    while (block.nodeType === 3 || (mtype && mtype !== "0" && mtype !== "1")) {
        if (block.parentElement.className === "vditor-reset vditor-wysiwyg") {
            return block;
        }
        block = block.parentElement;
    }
    return block;
};
