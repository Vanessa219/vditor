export const chartRender = async (element: (HTMLElement | Document) = document) => {
    const chartjsElements = element.querySelectorAll(".vditorChartJS");
    if (chartjsElements.length > 0) {
        const {default: Chart} = await import(/* webpackChunkName: "chart.js" */ "chart.js");

        chartjsElements.forEach((e: HTMLCanvasElement) => {
            const chart = new Chart(e.getContext("2d"), JSON.parse(e.innerHTML));
        });
    }

    const echartsElements = element.querySelectorAll(".vditorEcharts");
    if (echartsElements.length > 0) {
        const {default: echarts} = await import(/* webpackChunkName: "echarts" */ "echarts");
        echartsElements.forEach((e: HTMLDivElement) => {
            const chart = echarts.init(e);
            const dataElement = e.nextElementSibling as HTMLTextAreaElement
            chart.setOption(JSON.parse(dataElement.value));
            dataElement.remove()
        });
    }
};
