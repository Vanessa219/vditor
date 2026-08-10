require("../../src/js/lute/lute.min.js");

it("exports raw custom heading IDs", () => {
    const lute = global.Lute.New();
    const rawIDs = [];
    lute.SetHeadingID(true);
    lute.SetJSRenderers({
        renderers: {
            Md2HTML: {
                renderHeading: (node, entering) => {
                    if (entering) {
                        rawIDs.push(global.Lute.GetHeadingIDRaw(node));
                    }
                    return ["", global.Lute.WalkContinue];
                },
            },
        },
    });

    lute.MarkdownStr("", "# Heading\n\n# Heading {#raw_custom-ID}\n\n# 标题 {# 自定义 ID}");

    expect(rawIDs).toEqual(["", "#raw_custom-ID", "# 自定义 ID"]);
});
