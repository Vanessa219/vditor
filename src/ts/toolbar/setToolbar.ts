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
        if (itemElement && itemElement.classList.contains("vditor-menu--disabled")) {
            itemElement.classList.remove("vditor-menu--disabled");
        }
    });
};

export const disableToolbar = (toolbar: { [key: string]: HTMLElement }, names: string[]) => {
    names.forEach((name) => {
        if (!toolbar[name]) {
            return;
        }
        const itemElement = toolbar[name].children[0];
        if (itemElement && !itemElement.classList.contains("vditor-menu--disabled")) {
            itemElement.classList.add("vditor-menu--disabled");
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
