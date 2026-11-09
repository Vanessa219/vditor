const globalAny: any = global;
globalAny.VDITOR_VERSION = "version";
require("../../src/js/lute/lute.min.js");
import {Constants} from "../../src/ts/constants";
import {setLute} from "../../src/ts/markdown/setLute";

const createLute = (inlineMath = true) => setLute({
    ...Constants.MARKDOWN_OPTIONS,
    inlineMath,
    emojis: {},
    emojiSite: "",
    headingAnchor: false,
    inlineMathDigit: false,
});

it("keeps inline math enabled by default", () => {
    expect(createLute().Md2HTML("$x$")).toContain("language-math");
});

it("preserves dollar amounts when inline math is disabled", () => {
    const lute = createLute(false);
    ["US$ 1,200 and US$ 800", "Price $ 100 to $ 500", "Cost 100$ and 500$", "$x$"].forEach((md) => {
        expect(lute.Md2HTML(md)).toBe(`<p>${md}</p>\n`);
        expect(lute.VditorDOM2Md(lute.Md2VditorDOM(md))).toContain(md);
        expect(lute.VditorIRDOM2Md(lute.Md2VditorIRDOM(md))).toContain(md);
    });
    expect(lute.Md2HTML("$$\nx\n$$")).toContain("language-math");
});
