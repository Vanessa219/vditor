import {setCodeTheme} from "../toolbar/CodeTheme";
import {setContentTheme} from "../toolbar/ContentTheme";

export const setTheme = (vditor: IVditor, codeTheme?: string) => {
    if (vditor.options.theme === "dark") {
        setContentTheme(vditor, "dark");
    } else {
        vditor.element.classList.remove("vditor--dark");
        setContentTheme(vditor, "light");
    }
    setCodeTheme(vditor, codeTheme);
};
