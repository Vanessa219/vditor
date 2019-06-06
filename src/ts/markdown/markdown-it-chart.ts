export const chart = (md: markdownit) => {
    const tokenInfo = ["chart", "echarts"];
    const defaultRender = md.renderer.rules.fence
    md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        if (tokenInfo.indexOf(token.info) === -1) {
            return defaultRender(tokens, idx, options, env, self);
        }
        let data = token.content.trim();
        let html = "";
        try {
            data = JSON.stringify(JSON.parse(data))
            switch (token.info) {
                case "chart":
                    html = `<canvas class="vditorChartJS">${data}</canvas>`;
                    break;
                case "echarts":
                    html = `<div class="vditorEcharts" style="height:300px"></div><textarea style='display:none'>${
                        data}</textarea>`;
                    break;
                default:
                    html = `<pre><code>${data}</code></pre>`;
                    break;
            }
        } catch (e) {
            html = `<pre><code>${token.info} ${e}</code></pre>`;
        }

        return html;
    };
};
