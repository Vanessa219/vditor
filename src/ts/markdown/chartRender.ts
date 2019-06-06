export const chartRender = async (element: (HTMLElement | Document) = document) => {
    const echartsElements = element.querySelectorAll(".vditor-echarts");
    if (echartsElements.length > 0) {
        const {default: echarts} = await import(/* webpackChunkName: "echarts" */ "echarts");
        echartsElements.forEach((e: HTMLDivElement) => {
            const chart = echarts.init(e);
            const dataElement = e.nextElementSibling as HTMLTextAreaElement;
            chart.setOption(JSON.parse(dataElement.value));
            dataElement.remove();
        });
    }
};
