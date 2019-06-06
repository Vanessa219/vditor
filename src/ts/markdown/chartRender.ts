export const chartRender = async (element: (HTMLElement | Document) = document) => {
    const echartsElements = element.querySelectorAll(".language-echarts");
    if (echartsElements.length > 0) {
        const {default: echarts} = await import(/* webpackChunkName: "echarts" */ "echarts");
        echartsElements.forEach((e: HTMLDivElement) => {
            const option = JSON.parse(e.innerHTML);
            echarts.init(e).setOption(option);
        });
    }
};
