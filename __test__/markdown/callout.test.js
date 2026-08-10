require("../../src/js/lute/lute.min.js");

const Lute = global.Lute;

it("renders and edits callouts", () => {
    const markdowns = [
        "> [!NOTE]\n> Content",
        "> [!TIP] Custom **title**\n> First\n>\n> Second",
        "> [!IMPORTANT] ![callout-icon](<https://example.com/icon.png>) Image\n> Content",
    ];

    markdowns.forEach((markdown) => {
        const lute = Lute.New();
        lute.SetCallout(true);
        const expected = lute.Md2HTML(markdown);
        const wysiwygDOM = lute.Md2VditorDOM(markdown);
        const irDOM = lute.Md2VditorIRDOM(markdown);
        const svDOM = lute.Md2VditorSVDOM(markdown);

        expect(wysiwygDOM).toContain("data-type=\"callout\"");
        expect(irDOM).toContain("data-type=\"callout\"");
        expect(svDOM).toContain("[!");
        expect(lute.Md2HTML(lute.VditorDOM2Md(wysiwygDOM))).toBe(expected);
        expect(lute.Md2HTML(lute.VditorIRDOM2Md(irDOM))).toBe(expected);
    });
});

it("escapes callout type attributes", () => {
    const lute = Lute.New();
    lute.SetCallout(true);
    const markdown = "> [!\" onclick=\"alert(1)] Title\n> Content";

    [lute.Md2HTML(markdown), lute.Md2VditorDOM(markdown), lute.Md2VditorIRDOM(markdown)].forEach((html) => {
        expect(html).not.toContain(" onclick=\"");
    });
});

it("converts callout edits back to markdown", () => {
    const lute = Lute.New();
    lute.SetCallout(true);
    const markdown = "> [!NOTE]\n> Content";

    const wysiwygDOM = lute.Md2VditorDOM(markdown)
        .replace("Note", "Changed title")
        .replace("Content", "Changed content");
    const wysiwygMarkdown = lute.VditorDOM2Md(wysiwygDOM);
    expect(wysiwygMarkdown).toContain("Changed title");
    expect(wysiwygMarkdown).toContain("Changed content");

    const irDOM = lute.Md2VditorIRDOM(markdown)
        .replace("[!NOTE]", "[!WARNING]")
        .replace("✏️", "⚠️")
        .replace("Note", "Warning");
    expect(lute.VditorIRDOM2Md(irDOM)).toContain("[!WARNING]");
});
