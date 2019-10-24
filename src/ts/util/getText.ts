import {code160to32} from "../util/code160to32";

export const getText = (element: HTMLElement, mode: string) => {
    // last char must be a `\n`.
    if (mode === "markdown") {
        return code160to32(`${element.textContent}\n`.replace(/\n\n$/, "\n"));
    } else {
        return element.textContent;
    }
};
