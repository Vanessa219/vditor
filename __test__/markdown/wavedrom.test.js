const wavedrom = require("../../src/js/wavedrom/wavedrom.min.js");
const {looseJsonParse} = require("../../src/ts/util/function");

it("renders WaveJSON as SVG", async () => {
    const source = await looseJsonParse(`{ signal: [
        { name: "clk", wave: "p......" },
        { name: "bus", wave: "x.34.5x", data: "head body tail" }
    ]}`);
    const tree = wavedrom.renderAny(0, source, wavedrom.waveSkin, false);
    const svg = wavedrom.onml.stringify(tree);

    expect(svg).toContain("<svg");
    expect(svg).toContain("clk");
    expect(svg).toContain("head");
});

it("escapes markup in signal labels", async () => {
    const source = await looseJsonParse(`{ signal: [
        { name: "</text><script>alert(1)</script>", wave: "0" }
    ]}`);
    const tree = wavedrom.renderAny(1, source, wavedrom.waveSkin, false);
    const svg = wavedrom.onml.stringify(tree);

    expect(svg).not.toContain("<script>");
    expect(svg).toContain("&lt;/text&gt;");
});
