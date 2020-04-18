import {Constants} from "../constants";

export const removeCurrentToolbar = (toolbar: { [key: string]: HTMLElement }, names: string[]) => {
    names.forEach((name) => {
        if (!toolbar[name]) {
            return;
        }
        const itemElement = toolbar[name].children[0];
        if (itemElement && itemElement.classList.contains("vditor-menu--current")) {
            itemElement.classList.remove("vditor-menu--current");
        }
    });
};

export const setCurrentToolbar = (toolbar: { [key: string]: HTMLElement }, names: string[]) => {
    names.forEach((name) => {
        if (!toolbar[name]) {
            return;
        }
        const itemElement = toolbar[name].children[0];
        if (itemElement && !itemElement.classList.contains("vditor-menu--current")) {
            itemElement.classList.add("vditor-menu--current");
        }
    });
};

export const enableToolbar = (toolbar: { [key: string]: HTMLElement }, names: string[]) => {
    names.forEach((name) => {
        if (!toolbar[name]) {
            return;
        }
        const itemElement = toolbar[name].children[0];
        if (itemElement && itemElement.classList.contains(Constants.CLASS_MENU_DISABLED)) {
            itemElement.classList.remove(Constants.CLASS_MENU_DISABLED);
        }
    });
};

export const disableToolbar = (toolbar: { [key: string]: HTMLElement }, names: string[]) => {
    names.forEach((name) => {
        if (!toolbar[name]) {
            return;
        }
        const itemElement = toolbar[name].children[0];
        if (itemElement && !itemElement.classList.contains(Constants.CLASS_MENU_DISABLED)) {
            itemElement.classList.add(Constants.CLASS_MENU_DISABLED);
        }
    });
};

export const hideToolbar = (toolbar: { [key: string]: HTMLElement }, names: string[]) => {
    names.forEach((name) => {
        if (!toolbar[name]) {
            return;
        }
        if (toolbar[name]) {
            toolbar[name].style.display = "none";
        }
    });
};

export const showToolbar = (toolbar: { [key: string]: HTMLElement }, names: string[]) => {
    names.forEach((name) => {
        if (!toolbar[name]) {
            return;
        }
        if (toolbar[name]) {
            toolbar[name].style.display = "block";
        }
    });
};

// ["headings", "emoji", "submenu", "popover", "hint"]
export const hidePanel = (vditor: IVditor, panels: string[]) => {
    if (vditor.toolbar.elements.emoji && panels.includes("emoji")) {
        (vditor.toolbar.elements.emoji.lastElementChild as HTMLElement).style.display = "none";
    }
    if (vditor.toolbar.elements.headings && panels.includes("headings")) {
        (vditor.toolbar.elements.headings.lastElementChild as HTMLElement).style.display = "none";
    }
    if (panels.includes("hint")) {
        vditor.hint.element.style.display = "none";
    }
    if (vditor.wysiwyg.popover && panels.includes("popover")) {
        vditor.wysiwyg.popover.style.display = "none";
    }
    if (panels.includes("submenu")) {
        vditor.toolbar.element.querySelectorAll(".vditor-panel--left").forEach((item: HTMLElement) => {
            item.style.display = "none";
        });
    }
};
