import {addScript} from "../util/addScript";
import {CDN_PATH} from "../constants";

declare const lute: {
    markdown(text: string): string,
};

declare const Go: new() => {
    importObject: WebAssembly.WebAssemblyInstantiatedSource
    run(instance: WebAssembly.Instance): void,
};

const initLute = async () => {
    await addScript(`${CDN_PATH}/vditor/dist/js/lute/wasm_exec.js`, "vditorLuteJS");
    const go = new Go();
    const resp = await fetch(`${CDN_PATH}/vditor/dist/js/lute/lute.wasm`);
    const bytes = await resp.arrayBuffer();
    const result = await WebAssembly.instantiate(bytes, go.importObject);
    go.run(result.instance);
};

export const md2htmlByText = async (mdText: string) => {
    if (typeof lute === "undefined") {
         await initLute();
    }
    return await lute.markdown(mdText);
};
