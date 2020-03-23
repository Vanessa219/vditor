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

export const hidePanel = (vditor: IVditor, panels: string[]) => {
    if (vditor.toolbar.emojiPanelElement && panels.includes("emoji")) {
        vditor.toolbar.emojiPanelElement.style.display = "none";
    }
    if (vditor.toolbar.headingPanelElement && panels.includes("headings")) {
        vditor.toolbar.headingPanelElement.style.display = "none";
    }
    if (vditor.toolbar.editModePanelElement && panels.includes("edit-mode")) {
        vditor.toolbar.editModePanelElement.style.display = "none";
    }
    if (vditor.hint && panels.includes("hint")) {
        vditor.hint.element.style.display = "none";
    }
};
