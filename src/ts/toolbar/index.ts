import {Bold} from "./Bold";
import {Br} from "./Br";
import {Check} from "./Check";
import {Code} from "./Code";
import {Divider} from "./Divider";
import {Emoji} from "./Emoji";
import {Fullscreen} from "./Fullscreen";
import {Headings} from "./Headings";
import {Help} from "./Help";
import {Info} from "./Info";
import {InlineCode} from "./InlineCode";
import {Italic} from "./Italic";
import {Line} from "./Line";
import {Link} from "./Link";
import {List} from "./List";
import {OrderedList} from "./OrderedList";
import {Preview} from "./Preview";
import {Quote} from "./Quote";
import {Record} from "./Record";
import {Redo} from "./Redo";
import {Strike} from "./Strike";
import {Table} from "./Table";
import {Undo} from "./Undo";
import {Upload} from "./Upload";

export class Toolbar {
    public elements: { [key: string]: HTMLElement };

    constructor(vditor: IVditor) {
        const options = vditor.options;
        this.elements = {};

        options.toolbar.forEach((menuItem: IMenuItem, i: number) => {
            let menuItemObj;
            switch (menuItem.name) {
                case "emoji":
                    menuItemObj = new Emoji(vditor, menuItem);
                    break;
                case "bold":
                    menuItemObj = new Bold(vditor, menuItem);
                    break;
                case "headings":
                    menuItemObj = new Headings(vditor, menuItem);
                    break;
                case "|":
                    menuItemObj = new Divider();
                    break;
                case "br":
                    menuItemObj = new Br();
                    break;
                case "italic":
                    menuItemObj = new Italic(vditor, menuItem);
                    break;
                case "strike":
                    menuItemObj = new Strike(vditor, menuItem);
                    break;
                case "line":
                    menuItemObj = new Line(vditor, menuItem);
                    break;
                case "quote":
                    menuItemObj = new Quote(vditor, menuItem);
                    break;
                case "list":
                    menuItemObj = new List(vditor, menuItem);
                    break;
                case "ordered-list":
                    menuItemObj = new OrderedList(vditor, menuItem);
                    break;
                case "check":
                    menuItemObj = new Check(vditor, menuItem);
                    break;
                case "undo":
                    menuItemObj = new Undo(vditor, menuItem);
                    break;
                case "redo":
                    menuItemObj = new Redo(vditor, menuItem);
                    break;
                case "code":
                    menuItemObj = new Code(vditor, menuItem);
                    break;
                case "inline-code":
                    menuItemObj = new InlineCode(vditor, menuItem);
                    break;
                case "link":
                    menuItemObj = new Link(vditor, menuItem);
                    break;
                case "help":
                    menuItemObj = new Help(vditor, menuItem);
                    break;
                case "table":
                    menuItemObj = new Table(vditor, menuItem);
                    break;
                case "preview":
                    menuItemObj = new Preview(vditor, menuItem);
                    break;
                case "fullscreen":
                    menuItemObj = new Fullscreen(vditor, menuItem);
                    break;
                case "upload":
                    menuItemObj = new Upload(vditor, menuItem);
                    break;
                case "record":
                    menuItemObj = new Record(vditor, menuItem);
                    break;
                case "info":
                    menuItemObj = new Info(vditor, menuItem);
                    break;
                default:
                    console.error("menu item no matched");
                    break;
            }

            let key = menuItem.name;
            if (key === "br" || key === "|") {
                key = key + i;
            }

            this.elements[key] = menuItemObj.element;
        });
    }
}
