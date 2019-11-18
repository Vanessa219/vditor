export const hasClosest = (element:HTMLElement, nodeName:string) => {
    let e = element
    let isClosest = false
    while (e && !isClosest && !e.classList.contains('vditor-wysiwyg')) {
        if (e.nodeName.indexOf(nodeName) === 0) {
            isClosest = true
        } else {
            e = e.parentElement
        }
    }
    return isClosest
}
