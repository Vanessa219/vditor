import {getCursorPosition} from "../hint/getCursorPosition";
import {i18n} from "../i18n";

export const highlightToolbar = (vditor: IVditor) => {
    // TODO 多层嵌套
    const range = getSelection().getRangeAt(0);
    let typeElement = range.startContainer as HTMLElement;
    if (range.startContainer.nodeType === 3) {
        typeElement = range.startContainer.parentElement;
    }

    let toolbarName = typeElement.nodeName;
    if (toolbarName === 'CODE' && typeElement.parentElement.nodeName === 'PRE') {
        toolbarName = ''
    }
    if (/^H[1-6]$/.test(toolbarName)) {
        toolbarName = 'H'
    }

    const tagToolbar: { [key: string]: string } = {
        'A': "link",
        'CODE': "inline-code",
        'S': "strike",
        'EM': "italic",
        'H': "headings",
        'STRONG': "bold",
    };

    // 工具栏高亮
    Object.keys(tagToolbar).forEach((key) => {
        const value = tagToolbar[key]
        if (toolbarName === key) {
            vditor.toolbar.elements[value] &&
            vditor.toolbar.elements[value].children[0].classList.add("vditor-menu--current");
        } else {
            vditor.toolbar.elements[value] &&
            vditor.toolbar.elements[value].children[0].classList.remove("vditor-menu--current");
        }
    });

    // a 标签链接处理
    if (toolbarName === 'A') {
        const position = getCursorPosition(vditor.wysiwyg.element)
        const btn = document.createElement('button')
        btn.textContent = i18n[vditor.options.lang].update
        btn.onclick = () => {
            typeElement.setAttribute('href', (btn.previousElementSibling as HTMLInputElement).value)
            vditor.popover.style.display = 'none'
        }
        vditor.popover.innerHTML = `<input value="${typeElement.getAttribute('href')}">`
        vditor.popover.insertAdjacentElement('beforeend', btn)

        vditor.popover.style.top = position.top + 'px'
        vditor.popover.style.left = position.left + 'px'
        vditor.popover.style.display = 'block'
    } else {
        vditor.popover.style.display = 'none'
    }
};
