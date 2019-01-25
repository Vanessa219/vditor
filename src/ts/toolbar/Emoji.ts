import emojiSVG from "../../assets/icons/emoji.svg";
import {MenuItemClass} from "./MenuItemClass";

export class Emoji extends MenuItemClass {
    genElement(menuItem: MenuItem, i18n: string, editorElement:HTMLTextAreaElement): HTMLElement {
        menuItem.icon = menuItem.icon || emojiSVG
        return super.genElement(menuItem, i18n, editorElement)
    }
}