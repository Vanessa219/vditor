import {getText} from "../editor/getText";
import {initLute} from "./lute";

declare global {
    interface Window {
        lute: {
            markdown (text: string): string
        }
    }
}

export const md2htmlByText = async  (mdText: string) => {
    if (typeof window.lute === "undefined") {
        await initLute()
    }
    return window.lute.markdown(mdText)
};

export const md2htmlByVditor = async (vditor: IVditor) => {
    if (typeof window.lute === "undefined") {
        await initLute()
    }
    return window.lute.markdown(getText(vditor.editor.element))
};
