import {Constants} from "../constants";
import {addScript} from "../util/addScript";
import {chartRenderAdapter} from "./adapterRender";
import {looseJsonParse} from "../util/function";

declare const echarts: {
    init(element: HTMLElement, theme?: string): IEChart & {dispose(): void};
};

const charts = new WeakMap<HTMLElement, {
    instance: IEChart & {dispose(): void},
    observer?: ResizeObserver,
}>();

export const chartRender = (element: (HTMLElement | Document) = document, cdn = Constants.CDN, theme: string) => {
    const echartsElements = chartRenderAdapter.getElements(element);
    if (echartsElements.length > 0) {
        addScript(`${cdn}/dist/js/echarts/echarts.min.js?v=5.5.1`, "vditorEchartsScript").then(() => {
            echartsElements.forEach(async (e: HTMLDivElement) => {
                if (e.parentElement.classList.contains("vditor-wysiwyg__pre") ||
                    e.parentElement.classList.contains("vditor-ir__marker--pre")) {
                    return;
                }

                const text = chartRenderAdapter.getCode(e).trim();
                if (!text) {
                    return;
                }
                try {
                    if (e.getAttribute("data-processed") === "true") {
                        return;
                    }
                    const option = await looseJsonParse(text);
                    const previous = charts.get(e);
                    previous?.observer?.disconnect();
                    previous?.instance.dispose();
                    const instance = echarts.init(e, theme === "dark" ? "dark" : undefined);
                    instance.setOption(option);
                    const state: {instance: typeof instance, observer?: ResizeObserver} = {instance};
                    if (typeof ResizeObserver !== "undefined") {
                        state.observer = new ResizeObserver(() => {
                            if (!e.isConnected) {
                                state.observer.disconnect();
                                instance.dispose();
                                charts.delete(e);
                                e.removeAttribute("data-processed");
                                return;
                            }
                            if (e.clientWidth > 0 && e.clientHeight > 0) {
                                instance.resize();
                            }
                        });
                        state.observer.observe(e);
                    }
                    charts.set(e, state);
                    e.setAttribute("data-processed", "true");
                } catch (error) {
                    e.className = "vditor-reset--error";
                    e.innerHTML = `echarts render error: <br>${error}`;
                }
            });
        });
    }
};
