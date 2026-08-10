require("../../src/js/lute/lute.min.js");

it("preserves relative image paths with linkBase when switching editor modes", () => {
    const lute = global.Lute.New();
    const markdown = "![foo](dir/foo.png)";
    const expected = `${markdown}\n`;

    lute.SetLinkBase("/configured/base");
    lute.SetVditorWYSIWYG(true);
    const wysiwygMarkdown = lute.VditorDOM2Md(lute.Md2VditorDOM(markdown));
    expect(wysiwygMarkdown).toBe(expected);

    lute.SetVditorWYSIWYG(false);
    lute.SetVditorIR(true);
    expect(lute.VditorIRDOM2Md(lute.Md2VditorIRDOM(wysiwygMarkdown))).toBe(expected);
});
