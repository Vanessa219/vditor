class WYSISYG {
    public element: HTMLElement;
    public range: Range;

    constructor(vditor: IVditor) {
        this.element = document.createElement("div");
        this.element.className = "vditor-reset vditor-wysiwyg";
        this.element.setAttribute("contenteditable", "true");
    }
}


export {WYSISYG};
