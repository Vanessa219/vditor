/**
 * 合并脚注
 * @param elements vditor.sv.element
 * @param afterCombine 每个脚注块合并完成后的回调, param: root为合并后的脚注块
 */
export const combineFootnote = (elements: HTMLElement, afterCombine?: (root: HTMLElement) => void ) => {
    elements.querySelectorAll("[data-type=footnotes-link]").forEach((el: Element) => {
        const root = el.parentElement
        let footnote = root.nextSibling
        // 寻找所有该脚注的块
        while (footnote) {
            if (footnote.textContent.startsWith("    ")) {
                // 解析到四个空格，加入到root并继续解析
                const thisNode = footnote
                thisNode.childNodes.forEach(node => {
                    root.append(node.cloneNode(true))
                })
                footnote = footnote.nextSibling
                thisNode.remove()
            } else {
                // 非空格停止解析
                break
            }
        }
        afterCombine && afterCombine(root)
    })
}
