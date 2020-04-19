import {Constants} from "../constants";
import {setCodeTheme} from "../ui/setCodeTheme";
import {getEventName} from "../util/compatibility";
import {MenuItem} from "./MenuItem";

export class CodeTheme extends MenuItem {
    public element: HTMLElement;

    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);

        const panelElement = document.createElement("div");
        panelElement.className = "vditor-hint vditor-panel--side";
        panelElement.setAttribute("style", `overflow:auto;max-height:${window.innerHeight / 2}px`);
        let innerHTML = "";
        Constants.CODE_THEME.forEach((theme) => {
            innerHTML += `<button>${theme}</button>`;
        });
        panelElement.innerHTML = innerHTML;
        panelElement.addEventListener(getEventName(), (event: MouseEvent & { target: HTMLElement }) => {
            if (event.target.tagName === "BUTTON") {
                setCodeTheme(vditor, event.target.textContent);
            }
        });
        this.element.appendChild(panelElement);

        this.element.addEventListener("mouseover", (event) => {
            panelElement.style.display = "block";
            this.element.firstElementChild.classList.add("vditor-hint--current");
        });
        this.element.addEventListener("mouseout", (event) => {
            panelElement.style.display = "none";
            this.element.firstElementChild.classList.remove("vditor-hint--current");
        });
    }
}
