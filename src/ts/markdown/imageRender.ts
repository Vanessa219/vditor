export const sizeReg = /#(\d+(?:\.\d+)?(?:px|%))\s*(\d+(?:\.\d+)?(?:px|%))?/
export const getSize = (el: HTMLImageElement) => {
    return el.alt.match(sizeReg)
}
export const setSize = (el: HTMLImageElement) => {
    const matchSize = getSize(el)
    if(matchSize) {
        const width = matchSize[1], height = matchSize[2];
        el.style.cssText += `;width:${width};height:${height};`;
    }
}
export const numToPx = (num: number): string => `${num}px`

export const imageRender = (elContainer: HTMLElement)=> {
    const imageEl: NodeListOf<HTMLImageElement> = elContainer.querySelectorAll('img');

    imageEl.forEach((el: HTMLImageElement) => {
        setSize(el)
    })
}

