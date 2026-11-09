require("../../src/js/lute/lute.min.js");

describe("list Setext continuation", () => {
    it("keeps list continuation markers as literal text", () => {
        const lute = global.Lute.New();

        expect(lute.FormatStr("test", "* a\n* b\n=")).toBe("* a\n* b\n  \\=\n");
        expect(lute.FormatStr("test", "1. a\n2. b\n===")).toBe("1. a\n2. b\n   \\===\n");
    });

    it("keeps WYSIWYG list continuation markers as literal text", () => {
        const lute = global.Lute.New();
        lute.SetVditorWYSIWYG(true);
        const dom = `<ul data-tight="true" data-marker="*" data-block="0"><li data-marker="*">a</li><li data-marker="*">b
-<wbr></li></ul>`;

        expect(lute.VditorDOM2Md(dom)).toBe("* a\n* b\n  \\-\n");
        expect(lute.SpinVditorDOM(dom)).not.toContain("<h2");
    });

    it("keeps SV list continuation markers as literal text", () => {
        const lute = global.Lute.New();
        lute.SetVditorSV(true);
        const spun = lute.SpinVditorSVDOM("* a\n* b\n=‸");

        expect(spun).toContain("\\=");
        expect(spun).not.toContain("heading-marker");
    });

    it("keeps a thematic break at the document start out of YAML front matter", () => {
        const lute = global.Lute.New();
        lute.SetVditorSV(true);
        const spun = lute.SpinVditorSVDOM("***\n‸");

        expect(spun).toContain(">***</span>");
        expect(spun).not.toContain("yaml-front-matter");
    });
});
