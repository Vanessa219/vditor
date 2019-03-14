export const flowRender = (element: HTMLElement) => {
    if (element.querySelectorAll('code.language-flow').length === 0) {
        return
    }
    import(/* webpackChunkName: "flowchart.js" */ "flowchart.js").then((FlowChart) => {
        element.querySelectorAll('code.language-flow').forEach((e, index) => {
            const id = 'vditorFlow' + (new Date()).getTime() + index
            e.setAttribute('style', 'display:none')
            const flowElement = document.createElement('div')
            flowElement.id = id
            e.parentElement.after(flowElement)
            const diagram = FlowChart.default.parse(e.textContent.trim())
            diagram.drawSVG(id)
            e.parentElement.remove()

            // 防止被 svg icon 样式覆盖
            const svg = document.getElementById(id).querySelector('svg')
            svg.style.height = 'auto'
            svg.style.width = 'auto'
        })
    });

};
