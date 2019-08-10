import {code160to32} from "./insertText";

export const getText = (element: HTMLDivElement) => {
    return code160to32(element.textContent);
};
