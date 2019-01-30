export const getTextareaPosition = (element:any) => {
    const styleProperties = [
        'direction',
        'boxSizing',
        'width',
        'height',
        'overflowX',
        'overflowY',
        'borderTopWidth',
        'borderRightWidth',
        'borderBottomWidth',
        'borderLeftWidth',
        'borderStyle',
        'paddingTop',
        'paddingRight',
        'paddingBottom',
        'paddingLeft',
        'fontStyle',
        'fontVariant',
        'fontWeight',
        'fontStretch',
        'fontSize',
        'fontSizeAdjust',
        'lineHeight',
        'fontFamily',
        'textAlign',
        'textTransform',
        'textIndent',
        'textDecoration',
        'letterSpacing',
        'wordSpacing',
        'tabSize',
        'MozTabSize',
    ]
    const computed = window.getComputedStyle
        ? window.getComputedStyle(element)
        : element.currentStyle
    let div:HTMLElement = document.querySelector('.vditor-position')
    if (!div) {
        div = document.createElement('div')
        div.className = 'vditor-position'
        document.body.appendChild(div)
    }
    let style:any = div.style
    style.whiteSpace = 'pre-wrap'
    style.wordWrap = 'break-word'
    style.position = 'absolute'
    style.overflow = 'hidden'
    style.left = '-100%'
    styleProperties.forEach(function (prop) {
        style[prop] = computed[prop]
    })
    div.textContent = element.value.substring(0, element.selectionEnd)
    const span = document.createElement('span')
    span.textContent = element.value.substring(element.selectionEnd) || '.'
    div.appendChild(span)

    return {
        top: span.offsetTop - element.scrollTop + parseInt(computed['lineHeight']),
        left: span.offsetLeft - element.scrollLeft,
    }
}