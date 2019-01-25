import boldSVG from "../../assets/icons/bold.svg";
import {MenuItemClass} from "./MenuItemClass";

export class Bold extends MenuItemClass {
    genElement(menuItem: MenuItem, i18n: string): HTMLElement {
        menuItem.icon = menuItem.icon || boldSVG
        return super.genElement(menuItem, i18n)
    }
}