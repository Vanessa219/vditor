import resizeSVG from '../../assets/icons/resize.svg'

export class Resize {
    element: HTMLElement

    constructor(vditor: Vditor) {
        this.element = document.createElement('div')
        this.element.className = 'vditor-resize'
        this.element.innerHTML = resizeSVG

        this.bindEvent(vditor)
    }

    private bindEvent(vditor: Vditor) {
        this.element.addEventListener('mousedown', function (event: any) {

            const _document: any = document;
            const vditorElement = document.getElementById(vditor.id)
            if (!event) {
                event = window.event;
            }
            const y = event.clientY;
            const height = vditorElement.offsetHeight
            _document.ondragstart = "return false;";
            _document.onselectstart = "return false;";
            _document.onselect = "document.selection.empty();";

            // @ts-ignore
            if (this.setCapture) {
                // @ts-ignore
                this.setCapture()
            } else if (window.captureEvents) {
                // @ts-ignore
                window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            }

            _document.onmousemove = function (event: any) {
                if (!event) {
                    event = window.event
                }
                if (vditor.options.resize.position === 'top') {
                    vditorElement.style.height = Math.max(100, height + (y - event.clientY)) + 'px'
                } else {
                    vditorElement.style.height = Math.max(100, height + (event.clientY - y)) + 'px'
                }
            };

            _document.onmouseup = function () {
                if (this.releaseCapture) {
                    this.releaseCapture();
                } else if (window.captureEvents) {
                    // @ts-ignore
                    window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                }
                _document.onmousemove = null;
                _document.onmouseup = null;
                _document.ondragstart = null;
                _document.onselectstart = null;
                _document.onselect = null;
            }
        })
    }
}