import {Constants} from "../constants";
import {addScript} from "../util/addScript";
import {SMILESRenderAdapter} from "./adapterRender";
import {genUUID} from "../util/function";

declare class SmiDrawer {
    constructor(moleculeOptions: IObject, reactionOptions: IObject);

    public draw: (code: string, id: string, theme?: string) => void;
}

export const SMILESRender = (element: (HTMLElement | Document) = document, cdn = Constants.CDN, theme: string) => {
    const SMILESElements = SMILESRenderAdapter.getElements(element);
    if (SMILESElements.length > 0) {
        addScript(`${cdn}/dist/js/smiles-drawer/smiles-drawer.min.js?v=2.1.7`, "vditorAbcjsScript").then(() => {
            let sd = new SmiDrawer({}, {});
            SMILESElements.forEach((item: HTMLDivElement) => {
                const code = SMILESRenderAdapter.getCode(item).trim();
                if (item.getAttribute("data-processed") === "true" || code.trim() === "") {
                    return;
                }
                const id = "smiles" + genUUID()
                item.innerHTML = `<svg id="${id}"></svg>`;
                sd.draw(code, '#' + id, theme === "dark" ? "dark" : undefined)
                item.setAttribute("data-processed", "true");
            });
        });
    }
};
