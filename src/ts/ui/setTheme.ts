export const setTheme = (vditor: IVditor) => {
    switch (vditor.options.theme) {
        case "dark":
            vditor.element.classList.toggle("vditor--dark", true);
            break;

        case "classic":
        default:
            vditor.element.classList.toggle("vditor--dark", false);
            break;
    }
};
