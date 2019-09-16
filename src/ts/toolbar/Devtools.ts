import bugSVG from "../../assets/icons/bug.svg";
import {MenuItem} from "./MenuItem";

export class Devtools extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || bugSVG;

        this.element.addEventListener('click', () => {
            if (this.element.children[0].className.indexOf('vditor-menu--current') > -1) {
                this.element.children[0].className =
                    this.element.children[0].className.replace(' vditor-menu--current', '')
                vditor.devtools.style.display = 'none'
            } else {
                this.element.children[0].className += ' vditor-menu--current';
                vditor.devtools.style.display = 'block'
            }
        })
    }
}
