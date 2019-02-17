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
        this.element.addEventListener('mousedown', function (event: MouseEvent) {

            const _document = <IEDocument>document;
            const vditorElement = document.getElementById(vditor.id)
            const y = event.clientY;
            const height = vditorElement.offsetHeight
            _document.ondragstart = () => false;
            _document.onselectstart = "return false;";
            _document.onselect = () => {
                (<IEDocument>document).selection.empty()
            };

            if (window.captureEvents) {
                window.captureEvents();
            }

            _document.onmousemove = function (event: MouseEvent) {
                if (vditor.options.resize.position === 'top') {
                    vditorElement.style.height = Math.max(100, height + (y - event.clientY)) + 'px'
                } else {
                    vditorElement.style.height = Math.max(100, height + (event.clientY - y)) + 'px'
                }
            };

            _document.onmouseup = function () {
                if (vditor.options.resize.after) {
                    vditor.options.resize.after(vditorElement.offsetHeight - height)
                }

                if (window.captureEvents) {
                    window.captureEvents();
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