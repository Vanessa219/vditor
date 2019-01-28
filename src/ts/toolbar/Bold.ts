import boldSVG from "../../assets/icons/bold.svg";
import {MenuItemClass} from "./MenuItemClass";

export class Bold extends MenuItemClass {
    genElement(menuItem: MenuItem, lang: string, editorElement: HTMLTextAreaElement): HTMLElement {
        return super.genElement(Object.assign({}, menuItem, {icon: menuItem.icon || boldSVG}), lang, editorElement)
    }
}