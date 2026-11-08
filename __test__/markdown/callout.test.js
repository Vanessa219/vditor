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

it("imports callout HTML", () => {
    const lute = Lute.New();
    lute.SetCallout(true);
    const html = [
        ["NOTE", "✏️", "Note", "突出显示即使快速浏览也应注意的信息。"],
        ["TIP", "💡", "Tip", "可选信息，有助于更顺利地完成任务。"],
        ["IMPORTANT", "❗", "Important", "成功完成任务所必需的关键信息。"],
        ["WARNING", "⚠️", "Warning", "由于存在潜在风险，此重要内容需要立即关注。"],
        ["CAUTION", "🚨", "Caution", "某项操作可能带来的负面后果。"],
    ].map(([type, icon, title, content]) => `<div class="callout" data-subtype="${type}">` +
        `<div class="callout-info"><span class="callout-icon">${icon}</span>` +
        `<span class="callout-title">${title}</span></div>` +
        `<div class="callout-content"><p>${content}</p></div></div>`).join("");

    const markdown = lute.HTML2Md(html);
    expect(markdown).toContain("> [!NOTE]");
    expect(markdown).toContain("> [!CAUTION]");
    expect((lute.HTML2VditorDOM(html).match(/data-type="callout"/g) || []).length).toBe(5);
    expect((lute.HTML2VditorIRDOM(html).match(/data-type="callout"/g) || []).length).toBe(5);
    expect((lute.Md2VditorSVDOM(markdown).match(/vditor-sv__marker--callout/g) || []).length).toBe(5);
});
