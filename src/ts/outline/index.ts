import {Constants} from "../constants";
import {outlineRender} from "../markdown/outlineRender";
import {setPadding} from "../ui/initUI";
import {setSelectionFocus} from "../util/selection";
import {notifyConfigChange} from "../util/notifyConfigChange";

export class Outline {
    public element: HTMLElement;
    public resizeElement: HTMLElement;

    constructor(outlineLabel: string) {
        this.element = document.createElement("div");
        this.element.className = "vditor-outline";
        this.element.innerHTML = `<div class="vditor-outline__title">${outlineLabel}</div>
<div class="vditor-outline__content"></div>`;
        this.resizeElement = document.createElement("div");
        this.resizeElement.className = "vditor-outline__resize";
        this.resizeElement.setAttribute("role", "separator");
        this.resizeElement.setAttribute("aria-orientation", "vertical");
        this.resizeElement.setAttribute("aria-label", outlineLabel);
        this.resizeElement.tabIndex = 0;
    }

    public bindResize(vditor: IVditor) {
        let pointerId: number;
        let startX: number;
        let startWidth: number;
        const direction = vditor.options.outline.position === "left" ? 1 : -1;
        const bounds = () => {
            const max = Math.max(0, vditor.element.clientWidth - 140);
            return {min: Math.min(120, max), max};
        };
        const resize = (width: number) => {
            const {min, max} = bounds();
            width = Math.round(Math.max(min, Math.min(max, width)));
            this.element.style.width = `${width}px`;
            vditor.options.outline.width = width;
            this.resizeElement.setAttribute("aria-valuemin", String(min));
            this.resizeElement.setAttribute("aria-valuemax", String(max));
            this.resizeElement.setAttribute("aria-valuenow", String(width));
            setPadding(vditor);
        };
        this.resizeElement.addEventListener("pointerdown", (event: PointerEvent) => {
            if (event.button !== 0) {
                return;
            }
            event.preventDefault();
            pointerId = event.pointerId;
            startX = event.clientX;
            startWidth = this.element.clientWidth;
            this.resizeElement.setPointerCapture(pointerId);
        });
        this.resizeElement.addEventListener("pointermove", (event: PointerEvent) => {
            if (event.pointerId === pointerId) {
                resize(startWidth + direction * (event.clientX - startX));
            }
        });
        const finish = (event: PointerEvent) => {
            if (event.pointerId !== pointerId) {
                return;
            }
            pointerId = undefined;
            if (this.element.isConnected && this.element.clientWidth !== startWidth) {
                notifyConfigChange(vditor);
            }
        };
        this.resizeElement.addEventListener("pointerup", finish);
        this.resizeElement.addEventListener("pointercancel", finish);
        this.resizeElement.addEventListener("lostpointercapture", finish);
        this.resizeElement.addEventListener("keydown", (event: KeyboardEvent) => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
                return;
            }
            event.preventDefault();
            const {min, max} = bounds();
            const step = (event.shiftKey ? 50 : 10) * direction * (event.key === "ArrowLeft" ? -1 : 1);
            resize(event.key === "Home" ? min : event.key === "End" ? max : this.element.clientWidth + step);
            notifyConfigChange(vditor);
        });
        if (Number.isFinite(vditor.options.outline.width)) {
            resize(vditor.options.outline.width);
        }
    }

    public render(vditor: IVditor) {
        let html = "";
        if (vditor.preview.element.style.display === "block") {
            html = outlineRender(vditor.preview.previewElement,
                this.element.lastElementChild, vditor);
        } else {
            html = outlineRender(vditor[vditor.currentMode].element, this.element.lastElementChild, vditor);
        }
        return html;
    }

    public toggle(vditor: IVditor, show = true, focus = true) {
        const btnElement = vditor.toolbar.elements.outline?.firstElementChild;
        if (show && window.innerWidth >= Constants.MOBILE_WIDTH) {
            this.element.style.display = "block";
            this.resizeElement.style.display = "block";
            this.resizeElement.setAttribute("aria-valuenow", String(this.element.clientWidth));
            this.render(vditor);
            btnElement?.classList.add("vditor-menu--current");
        } else {
            this.element.style.display = "none";
            this.resizeElement.style.display = "none";
            btnElement?.classList.remove("vditor-menu--current");
        }
        if (focus && getSelection().rangeCount > 0) {
            const range = getSelection().getRangeAt(0);
            if (vditor[vditor.currentMode].element.contains(range.startContainer)) {
                setSelectionFocus(range);
            }
        }
        setPadding(vditor);
    }
}
