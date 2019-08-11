import {code160to32} from "../util/code160to32";

export const getText = (element: HTMLDivElement) => {
    return code160to32(element.textContent);
};
