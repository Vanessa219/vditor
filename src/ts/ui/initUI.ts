import {formatRender} from "../editor/formatRender";
import {html2md} from "../editor/html2md";
import {renderDomByMd} from "../wysiwyg/renderDomByMd";
import {setTheme} from "./setTheme";

export const initUI = (vditor: IVditor) => {
    const vditorElement = document.getElementById(vditor.id);
    vditorElement.innerHTML = "";
    vditorElement.classList.add("vditor");
    setTheme(vditor);
    if (typeof vditor.options.height === "number") {
        vditorElement.style.height = vditor.options.height + "px";
    }
    if (typeof vditor.options.width === "number") {
        vditorElement.style.width = vditor.options.width + "px";
    } else {
        vditorElement.style.width = vditor.options.width;
    }

    const toolbarElement = document.createElement("div");
    toolbarElement.className = "vditor-toolbar";
    Object.keys(vditor.toolbar.elements).forEach((key) => {
        toolbarElement.appendChild(vditor.toolbar.elements[key]);
    });

    vditorElement.appendChild(toolbarElement);

    const contentElement = document.createElement("div");
    contentElement.className = "vditor-content";

    if (vditor.wysiwyg) {
        contentElement.appendChild(vditor.wysiwyg.element.parentElement);
    }

    if (vditor.editor) {
        contentElement.appendChild(vditor.editor.element);
    }

    if (vditor.preview) {
        contentElement.appendChild(vditor.preview.element);
    }

    if (vditor.toolbar.elements.devtools) {
        contentElement.appendChild(vditor.devtools.element);
    }

    if (vditor.options.counter > 0) {
        contentElement.appendChild(vditor.counter.element);
    }

    if (vditor.upload) {
        contentElement.appendChild(vditor.upload.element);
    }

    if (vditor.options.resize.enable) {
        contentElement.appendChild(vditor.resize.element);
    }

    if (vditor.hint) {
        contentElement.appendChild(vditor.hint.element);
    }

    contentElement.appendChild(vditor.tip.element);

    vditorElement.appendChild(contentElement);

    afterRender(vditor, contentElement);
};

const afterRender = (vditor: IVditor, contentElement: HTMLElement) => {

    let height: number = Math.max(contentElement.offsetHeight, 20);
    if (height < 21 && typeof vditor.options.height === "number") {
        height = vditor.options.height - 37;
    }

    if (vditor.editor && vditor.options.typewriterMode) {
        vditor.editor.element.style.setProperty("--editor-bottom", height / 2 + "px");
    }

    if (vditor.wysiwyg) {
        const setPadding = () => {
            const padding = (vditor.wysiwyg.element.parentElement.parentElement.clientWidth
                - vditor.options.preview.maxWidth) / 2;
            vditor.wysiwyg.element.style.padding = `10px ${Math.max(35, padding)}px`;
            if (vditor.options.typewriterMode) {
                vditor.wysiwyg.element.style.setProperty("--editor-wysiwyg-bottom", height / 2 + "px");
            }
        };
        setPadding();
        window.addEventListener("resize", () => {
            setPadding();
        });
    }

    // set default value
    let initValue = localStorage.getItem("vditor" + vditor.id);
    if (!vditor.options.cache || !initValue) {
        if (vditor.options.value) {
            initValue = vditor.options.value;
        } else if (vditor.originalInnerHTML) {
            initValue = html2md(vditor, vditor.originalInnerHTML);
        } else if (!vditor.options.cache) {
            initValue = "";
        }
    }

    if (!initValue) {
        return;
    }

    if (vditor.options.mode.indexOf("wysiwyg") > -1) {
        renderDomByMd(vditor, initValue, false);
    }

    if (vditor.options.mode.indexOf("markdown") > -1) {
        formatRender(vditor, initValue, undefined, {
            enableAddUndoStack: true,
            enableHint: false,
            enableInput: false,
        });
    }
};
