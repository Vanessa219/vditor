import resizeSVG from "../../assets/icons/resize.svg";

export class Resize {
    public element: HTMLElement;

    constructor(vditor: IVditor) {
        this.element = document.createElement("div");
        this.element.className = "vditor-resize";
        this.element.innerHTML = resizeSVG;

        this.bindEvent(vditor);
    }

    private bindEvent(vditor: IVditor) {
        this.element.addEventListener("mousedown", (event: MouseEvent) => {

            const documentSelf = document as IDocument;
            const vditorElement = document.getElementById(vditor.id);
            const y = event.clientY;
            const height = vditorElement.offsetHeight;
            documentSelf.ondragstart = () => false;
            documentSelf.onselectstart = "return false;";
            documentSelf.onselect = () => {
                (document as IDocument).selection.empty();
            };

            if (window.captureEvents) {
                window.captureEvents();
            }

            documentSelf.onmousemove = (moveEvent: MouseEvent) => {
                if (vditor.options.resize.position === "top") {
                    vditorElement.style.height = Math.max(100, height + (y - moveEvent.clientY)) + "px";
                } else {
                    vditorElement.style.height = Math.max(100, height + (moveEvent.clientY - y)) + "px";
                }
            };

            documentSelf.onmouseup = () => {
                if (vditor.options.resize.after) {
                    vditor.options.resize.after(vditorElement.offsetHeight - height);
                }

                if (window.captureEvents) {
                    window.captureEvents();
                }
                documentSelf.onmousemove = null;
                documentSelf.onmouseup = null;
                documentSelf.ondragstart = null;
                documentSelf.onselectstart = null;
                documentSelf.onselect = null;
            };
        });
    }
}
