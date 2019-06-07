export const chartRender = async (element: (HTMLElement | Document) = document) => {
    const echartsElements = element.querySelectorAll(".language-echarts");
    if (echartsElements.length > 0) {
        const {default: echarts} = await import(/* webpackChunkName: "echarts" */ "echarts");
        echartsElements.forEach((e: HTMLDivElement) => {
            try {
                if (e.getAttribute('data-processed') === 'true') {
                    return
                }
                const option = JSON.parse(e.innerHTML.trim());
                echarts.init(e).setOption(option);
                e.setAttribute('data-processed', 'true')
            } catch (error) {
                e.className = 'hljs'
                e.innerHTML = `echarts render error: <br>${error}`;
            }
        });
    }
};
