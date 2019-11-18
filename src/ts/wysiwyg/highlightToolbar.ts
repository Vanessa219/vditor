import {getCursorPosition} from "../hint/getCursorPosition";
import {i18n} from "../i18n";
import {hasClosest} from "../util/hasClosest";

export const highlightToolbar = (vditor: IVditor) => {
    // TODO 多层嵌套
    const range = getSelection().getRangeAt(0);
    let typeElement = range.startContainer as HTMLElement;
    if (range.startContainer.nodeType === 3) {
        typeElement = range.startContainer.parentElement;
    }

    let toolbarName = typeElement.nodeName;
    if (toolbarName === "CODE" && typeElement.parentElement.nodeName === "PRE") {
        toolbarName = "";
    }
    if (/^H[1-6]$/.test(toolbarName)) {
        toolbarName = "H";
    }
    if (toolbarName === 'B') {
        toolbarName = 'STRONG'
    }
    if (toolbarName === 'I') {
        toolbarName = 'EM'
    }
    if (toolbarName === 'S') {
        toolbarName = 'STRIKE'
    }

    const tagToolbar: { [key: string]: string } = {
        A: "link",
        CODE: "inline-code",
        STRIKE: "strike",
        EM: "italic",
        H: "headings",
        STRONG: "bold",
    };

    // 工具栏高亮
    Object.keys(tagToolbar).forEach((key) => {
        const value = tagToolbar[key];
        if (toolbarName === key) {
            vditor.toolbar.elements[value] &&
            vditor.toolbar.elements[value].children[0].classList.add("vditor-menu--current");
        } else {
            vditor.toolbar.elements[value] &&
            vditor.toolbar.elements[value].children[0].classList.remove("vditor-menu--current");
        }
    });

    if (hasClosest(typeElement, 'H')) {
        vditor.toolbar.elements.bold &&
        vditor.toolbar.elements.bold.children[0].classList.add("vditor-menu--disabled");
    } else {
        vditor.toolbar.elements.bold &&
        vditor.toolbar.elements.bold.children[0].classList.remove("vditor-menu--disabled");
    }

    if (hasClosest(typeElement, 'UL')) {
        vditor.toolbar.elements.list &&
        vditor.toolbar.elements.list.children[0].classList.add("vditor-menu--current");
    } else {
        vditor.toolbar.elements.list &&
        vditor.toolbar.elements.list.children[0].classList.remove("vditor-menu--current");
    }
    if (hasClosest(typeElement, 'OL')) {
        vditor.toolbar.elements['ordered-list'] &&
        vditor.toolbar.elements['ordered-list'].children[0].classList.add("vditor-menu--current");
    } else {
        vditor.toolbar.elements['ordered-list'] &&
        vditor.toolbar.elements['ordered-list'].children[0].classList.remove("vditor-menu--current");
    }

    showAPopover(typeElement, vditor)
};


export const showAPopover = (element: HTMLElement, vditor: IVditor) => {
    // a 标签链接处理
    if (element.nodeName === "A") {
        const position = getCursorPosition(vditor.wysiwyg.element);
        const btn = document.createElement("button");
        btn.textContent = i18n[vditor.options.lang].update;
        btn.onclick = () => {
            element.setAttribute("href", (btn.previousElementSibling as HTMLInputElement).value);
            vditor.popover.style.display = "none";
        };
        vditor.popover.innerHTML = `<input value="${element.getAttribute("href") || ''}">`;
        vditor.popover.insertAdjacentElement("beforeend", btn);

        vditor.popover.style.top = (position.top - 40) + "px";
        vditor.popover.style.left = position.left + "px";
        vditor.popover.style.display = "block";
    } else {
        vditor.popover.style.display = "none";
    }
}
