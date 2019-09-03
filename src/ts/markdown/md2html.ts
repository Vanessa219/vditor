import {CDN_PATH} from "../constants";

declare const lute: {
    markdown(text: string): string,
};

declare const Go: new() => {
    importObject: WebAssembly.WebAssemblyInstantiatedSource
    run(instance: WebAssembly.Instance): void,
};

const loadLuteJs = () => {
    const scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    scriptElement.src = `${CDN_PATH}/vditor/dist/js/lute/wasm_exec.js`;
    document.getElementsByTagName("head")[0].appendChild(scriptElement);

    return new Promise((resolve) => {
        scriptElement.onload = () => {
            resolve();
        };
    });
};

export const md2htmlByText = async (mdText: string) => {
    if (typeof Go === "undefined") {
        await loadLuteJs();
    }
    if (typeof lute === "undefined" && typeof Go !== "undefined") {
        const resp = await fetch(`${CDN_PATH}/vditor/dist/js/lute/lute.wasm`);
        const bytes = await resp.arrayBuffer();
        const go = new Go();
        const result = await WebAssembly.instantiate(bytes, go.importObject);
        go.run(result.instance);
    }
    return await lute.markdown(mdText);
};
