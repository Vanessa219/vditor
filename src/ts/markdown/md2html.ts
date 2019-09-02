import {getText} from "../editor/getText";
import {initLute} from "./lute";

declare const lute: {
    markdown(text: string): string,
};

export const md2htmlByText = async (mdText: string) => {
    if (typeof lute === "undefined") {
        await initLute();
    }
    return lute.markdown(mdText);
};

export const md2htmlByVditor = async (vditor: IVditor) => {
    if (typeof lute === "undefined") {
        await initLute();
    }
    return lute.markdown(getText(vditor.editor.element));
};
