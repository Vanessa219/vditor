import {CDN_PATH} from "../constants";

export const loadLuteJs = () => {
    const scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    scriptElement.src = `${CDN_PATH}/vditor/dist/js/lute/lute.min.js`;
    document.getElementsByTagName("head")[0].appendChild(scriptElement);

    return new Promise((resolve) => {
        scriptElement.onload = () => {
            resolve();
        };
    });
};

export const md2htmlByText = async (mdText: string) => {
    if (typeof lute === "undefined") {
        await loadLuteJs();
    }
    return await lute.markdown(mdText);
};
