import {Constants} from "../constants";
import {addScript} from "../util/addScript";
import {looseJsonParse} from "../util/function";
import {wavedromRenderAdapter} from "./adapterRender";

declare const wavedrom: {
    renderWaveElement(index: number, source: object, element: HTMLElement, skin: object, notFirstSignal: boolean): void;
    waveSkin: object;
};

let wavedromIndex = 0;

export const wavedromRender = (element: (HTMLElement | Document) = document, cdn = Constants.CDN) => {
    const wavedromElements = wavedromRenderAdapter.getElements(element);
    if (wavedromElements.length === 0) {
        return;
    }

    addScript(`${cdn}/dist/js/wavedrom/wavedrom.min.js?v=3.6.2`, "vditorWavedromScript").then(() => {
        wavedromElements.forEach(async (item: HTMLElement) => {
            if (item.parentElement.classList.contains("vditor-wysiwyg__pre") ||
                item.parentElement.classList.contains("vditor-ir__marker--pre")) {
                return;
            }

            const code = wavedromRenderAdapter.getCode(item);
            if (item.getAttribute("data-processed") === "true" || code.trim() === "") {
                return;
            }

            let renderElement = item;
            if (item.tagName === "CODE") {
                renderElement = document.createElement("div");
                Array.from(item.attributes).forEach((attribute) => {
                    renderElement.setAttribute(attribute.name, attribute.value);
                });
                item.replaceWith(renderElement);
            }

            try {
                const source = await looseJsonParse(code);
                wavedrom.renderWaveElement(wavedromIndex, source, renderElement, wavedrom.waveSkin, false);
                wavedromIndex++;
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                const lineBreak = document.createElement("br");
                renderElement.replaceChildren(document.createTextNode("wavedrom render error:"), lineBreak,
                    document.createTextNode(message));
                renderElement.classList.add("vditor-reset--error");
            }
            renderElement.setAttribute("data-processed", "true");
        });
    });
};
