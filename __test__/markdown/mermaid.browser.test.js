const path = require("path");
const {launchBrowser} = require("../util/launchBrowser");

describe("Mermaid subgraph layout", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await page.setContent("<div id='diagram'></div>");
        await page.addScriptTag({path: path.resolve(__dirname, "../../src/js/mermaid/mermaid.min.js")});
    });

    afterAll(async () => {
        if (browser) {
            await browser.close();
        }
    });

    it.each(["default", "dark"])("stacks connected subgraph nodes vertically in %s theme", async (theme) => {
        const nodes = await page.evaluate(async (theme) => {
            mermaid.initialize({startOnLoad: false, securityLevel: "loose", theme,
                flowchart: {htmlLabels: true, useMaxWidth: true}});
            const source = `flowchart LR
subgraph left["❌ 两个极端"]
direction TB
L1["🚫 太被动<br/>被 AI 带着跑<br/>45 分钟不喊停"]
L2["🗑️ 追问完扔掉<br/>决策留在聊天记录里<br/>换会话全丢了"]
L3["😈 用弱模型<br/>提的问题全是虚的<br/>「你希望什么风格？」"]
L4["📦 串行追问<br/>大项目追完整棵树<br/>要 2 小时+"]
end
subgraph right["✅ 正确做法"]
direction TB
R1["🎯 主动导航<br/>「方向正确，推进到下一层」"]
R2["📝 grill-with-docs<br/>自动沉淀 CONTEXT.md + ADR"]
R3["🧠 前沿模型<br/>好问题来自参数化知识"]
R4["⚡ 并行 session<br/>拆成小块，两个窗口同时跑"]
end
L1 -.->|"平衡点"| R1
L2 -.->|"平衡点"| R2
L3 -.->|"平衡点"| R3
L4 -.->|"平衡点"| R4
classDef redNode fill:#e74c3c,stroke:#c0392b,color:#fff
classDef greenNode fill:#27ae60,stroke:#1e8449,color:#fff
classDef subGraph fill:#fcf8e3,stroke:#e0d5a6
class L1,L2,L3,L4 redNode
class R1,R2,R3,R4 greenNode
class left,right subGraph`;
            const {svg} = await mermaid.render("layoutTest", source);
            document.querySelector("#diagram").innerHTML = svg;
            return ["L1", "L2", "L3", "L4", "R1", "R2", "R3", "R4"].map((id) => {
                const node = document.querySelector(`g.node[id*="-${id}-"]`);
                const rect = node.getBoundingClientRect();
                return {x: rect.x + rect.width / 2, y: rect.y + rect.height / 2};
            });
        }, theme);
        for (let i = 0; i < 4; i++) {
            expect(nodes[i].x).toBeLessThan(nodes[i + 4].x);
            if (i > 0) {
                expect(nodes[i].x).toBeCloseTo(nodes[0].x, 0);
                expect(nodes[i + 4].x).toBeCloseTo(nodes[4].x, 0);
                expect(nodes[i].y).toBeGreaterThan(nodes[i - 1].y);
                expect(nodes[i + 4].y).toBeGreaterThan(nodes[i + 3].y);
            }
        }
    });
});
