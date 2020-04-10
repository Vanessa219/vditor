import {html2md} from "../sv/html2md";
import {setEditMode} from "../toolbar/EditMode";
import {scrollCenter} from "../util/editorCommonEvent";
import {setTheme} from "./setTheme";

export const initUI = (vditor: IVditor) => {
    vditor.element.innerHTML = "";
    vditor.element.classList.add("vditor");
    setTheme(vditor);
    if (typeof vditor.options.height === "number") {
        vditor.element.style.height = vditor.options.height + "px";
    }
    if (typeof vditor.options.minHeight === "number") {
        vditor.element.style.minHeight = vditor.options.minHeight + "px";
    }
    if (typeof vditor.options.width === "number") {
        vditor.element.style.width = vditor.options.width + "px";
    } else {
        vditor.element.style.width = vditor.options.width;
    }

    vditor.element.appendChild(vditor.toolbar.element);

    const contentElement = document.createElement("div");
    contentElement.className = "vditor-content";

    contentElement.appendChild(vditor.wysiwyg.element.parentElement);

    contentElement.appendChild(vditor.sv.element);

    contentElement.appendChild(vditor.ir.element.parentElement);

    if (vditor.preview) {
        contentElement.appendChild(vditor.preview.element);
    }

    if (vditor.toolbar.elements.devtools) {
        contentElement.appendChild(vditor.devtools.element);
    }

    if (vditor.options.counter !== false) {
        contentElement.appendChild(vditor.counter.element);
    }

    if (vditor.upload) {
        contentElement.appendChild(vditor.upload.element);
    }

    if (vditor.options.resize.enable) {
        contentElement.appendChild(vditor.resize.element);
    }

    contentElement.appendChild(vditor.hint.element);

    contentElement.appendChild(vditor.tip.element);

    vditor.element.appendChild(contentElement);

    setEditMode(vditor, vditor.options.mode, afterRender(vditor, contentElement));
};

export const setPadding = (vditor: IVditor) => {
    if (vditor.wysiwyg.element.parentElement.style.display !== "none") {
        const padding = (vditor.wysiwyg.element.parentElement.clientWidth
            - vditor.options.preview.maxWidth) / 2;
        vditor.wysiwyg.element.style.padding = `10px ${Math.max(35, padding)}px`;
    }

    if (vditor.ir.element.parentElement.style.display !== "none") {
        const padding = (vditor.ir.element.parentElement.clientWidth
            - vditor.options.preview.maxWidth) / 2;
        vditor.ir.element.style.padding = `10px ${Math.max(35, padding)}px`;
    }
};

const afterRender = (vditor: IVditor, contentElement: HTMLElement) => {
    const setTypewriterPosition = () => {
        let height: number;
        if (typeof vditor.options.height !== "number") {
            height = window.innerHeight;
        } else {
            height = vditor.options.height;
            if (typeof vditor.options.minHeight === "number") {
                height = Math.max(height, vditor.options.minHeight + vditor.toolbar.element.offsetHeight);
            }
            height = Math.min(window.innerHeight, height);
        }
        // 由于 Firefox padding-bottom bug，只能使用 :after
        contentElement.style.setProperty("--editor-bottom", (height / 2 - 18) + "px");
    };

    if (vditor.options.typewriterMode) {
        setTypewriterPosition();
    }

    window.addEventListener("resize", () => {
        setPadding(vditor);
        if (vditor.options.typewriterMode) {
            setTypewriterPosition();
            scrollCenter(vditor);
        }
    });

    // set default value
    let initValue = localStorage.getItem(vditor.options.cache.id);
    if (!vditor.options.cache.enable || !initValue) {
        if (vditor.options.value) {
            initValue = vditor.options.value;
        } else if (vditor.originalInnerHTML) {
            initValue = html2md(vditor, vditor.originalInnerHTML);
        } else if (!vditor.options.cache.enable) {
            initValue = "";
        }
    }
    return initValue || "";
};
