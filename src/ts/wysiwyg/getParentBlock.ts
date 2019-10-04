export const getParentBlock = (elment: HTMLElement) => {
    let block = elment;
    while (block.nodeType === 3 ||
    (block.getAttribute("data-mtype") !== "0" && block.getAttribute("data-mtype") !== "1")) {
        if (block.parentElement.className === "vditor-reset vditor-wysiwyg") {
            return block;
        }
        block = block.parentElement;
    }
    return block;
};
