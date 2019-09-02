import {addScript} from "../util/addScript";
import {CDN_PATH} from "../constants"; // TODO

declare global {
    interface Window {
        Go: {
            new(): {
                run(instance: WebAssembly.Instance): void
                importObject: WebAssembly.WebAssemblyInstantiatedSource
            }
        }
    }
}

export const initLute = async () => {
    if (!WebAssembly.instantiateStreaming) { // polyfill
        WebAssembly.instantiateStreaming = async (resp, importObject) => {
            const source = await (await resp).arrayBuffer();
            return await WebAssembly.instantiate(source, importObject);
        };
    }

    await addScript(`http://localhost:9000/dist/js/lute/wasm_exec.js`, 'vditorLuteJS')
    const go = new window.Go();
    const result = await WebAssembly.instantiateStreaming(fetch(`http://localhost:9000/dist/js/lute/lute.wasm`),
        go.importObject)
    go.run(result.instance);
}
