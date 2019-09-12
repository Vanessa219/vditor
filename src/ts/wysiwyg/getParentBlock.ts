export const getParentBlock = (elment:HTMLElement) => {
    let block = elment
    while(block.nodeType === 3 || block.getAttribute('data-mtype') !== '0') {
        block = block.parentElement
    }
    return block
};
