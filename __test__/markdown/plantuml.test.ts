/** @jest-environment jsdom */
import {plantumlRender} from "../../src/ts/markdown/plantumlRender";
import {addScript} from "../../src/ts/util/addScript";

jest.mock("../../src/ts/constants", () => ({Constants: {
    CDN: "https://cdn.example", PLANTUML_OPTIONS: {server: "https://www.plantuml.com/plantuml/svg/"},
}}));
jest.mock("../../src/ts/util/addScript", () => ({addScript: jest.fn(() => Promise.resolve())}));

describe("PlantUML rendering", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        document.body.innerHTML = '<pre><code class="language-plantuml">Alice -&gt; Bob</code></pre>';
        (globalThis as any).plantumlEncoder = {encode: () => "encoded"};
    });

    const flush = async () => {
        for (let i = 0; i < 6; i++) {
            await Promise.resolve();
        }
    };

    it.each([undefined, {server: "https://private.example/svg/"}])("uses the configured server: %p", async (options) => {
        plantumlRender(document, undefined, options);
        await flush();
        expect(document.querySelector("object").getAttribute("data")).toBe(
            `${options?.server || "https://www.plantuml.com/plantuml/svg/"}~1encoded`);
        expect(addScript).toHaveBeenCalledTimes(1);
    });

    it("keeps quotes in the server address inside the data attribute", async () => {
        plantumlRender(document, undefined, {server: 'https://private.example/" onload="alert(1)/'});
        await flush();
        expect(document.querySelector("object").hasAttribute("onload")).toBe(false);
    });

    it("runs an async renderer without loading the encoder", async () => {
        const renderer = jest.fn(async (code, element) => { element.textContent = code + " rendered"; });
        plantumlRender(document, undefined, {renderer});
        await flush();
        expect(renderer).toHaveBeenCalledWith("Alice -> Bob", document.querySelector("code"));
        expect(document.querySelector("code").textContent).toBe("Alice -> Bob rendered");
        expect(addScript).not.toHaveBeenCalled();
        expect(document.querySelector("object")).toBeNull();
    });

    it.each([false, true])("displays renderer errors as text (async: %s)", async (asyncError) => {
        const error = '<img src=x onerror="alert(1)">';
        plantumlRender(document, undefined, {renderer: () => {
            if (asyncError) { return Promise.reject(error); }
            throw error;
        }});
        await flush();
        expect(document.querySelector("code").className).toBe("vditor-reset--error");
        expect(document.querySelector("code").textContent).toContain(error);
        expect(document.querySelector("img")).toBeNull();
    });
});
