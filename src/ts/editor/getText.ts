import {code160to32} from "../util/code160to32";

export const getText = (element: HTMLElement) => {
    // last char must be a `\n`.
    return code160to32(`${element.textContent}\n`.replace(/\n\n$/, "\n"));
};
