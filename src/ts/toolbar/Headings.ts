import headingsSVG from "../../assets/icons/headings.svg";
import {MenuItemClass} from "./MenuItemClass";
import {insertText} from "../editor/index";

export class Headings extends MenuItemClass {
    element: HTMLElement

    constructor(vditor: Vditor, menuItem: MenuItem) {
        super(vditor, menuItem)
        this.element.children[0].innerHTML = menuItem.icon || headingsSVG

        const headingsPanelElement = document.createElement('div')
        headingsPanelElement.className = 'vditor-panel'
        headingsPanelElement.innerHTML = `<h1 data-value="# ">Heading 1</h1>
<h2 data-value="## ">Heading 2</h2>
<h3 data-value="### ">Heading 3</h3>
<h4 data-value="#### ">Heading 4</h4>
<h5 data-value="##### ">Heading 5</h5>
<h6 data-value="###### ">Heading 6</h6>`

        this.element.appendChild(headingsPanelElement)

        this._bindEvent(headingsPanelElement, vditor)
    }

    _bindEvent(headingsPanelElement: HTMLElement, vditor: Vditor) {
        this.element.children[0].addEventListener('click', () => {
            headingsPanelElement.style.display = headingsPanelElement.style.display === 'block' ? 'none' : 'block'
        })

        for (let i = 0; i < 6; i++) {
            headingsPanelElement.children.item(i).addEventListener('click', (event: any) => {
                insertText(vditor.editor.element, event.target.getAttribute('data-value'), '')
                headingsPanelElement.style.display = 'none'
            })
        }
    }
}