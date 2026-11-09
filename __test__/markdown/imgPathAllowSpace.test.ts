const globalAny: any = global;
globalAny.VDITOR_VERSION = "version";
require("../../src/js/lute/lute.min.js");
import {Constants} from "../../src/ts/constants";
import {setLute} from "../../src/ts/markdown/setLute";

const createLute = (imgPathAllowSpace = false) => setLute({
    ...Constants.MARKDOWN_OPTIONS,
    imgPathAllowSpace,
    emojis: {},
    emojiSite: "",
    headingAnchor: false,
    inlineMathDigit: false,
});

it("does not parse bare spaces in image paths by default", () => {
    expect(createLute().Md2HTML("![alt](images/my photo.png)")).not.toContain("<img");
});

it("parses image paths with spaces when enabled", () => {
    const lute = createLute(true);
    const markdown = "![alt](images/my photo.png)";
    expect(lute.Md2HTML(markdown)).toContain('src="images/my photo.png"');
    [lute.Md2VditorDOM(markdown), lute.Md2VditorIRDOM(markdown)].forEach(html => {
        expect(html).toContain('src="images/my photo.png"');
    });
    expect(lute.Md2HTML(lute.VditorDOM2Md(lute.Md2VditorDOM(markdown))))
        .toContain('src="images/my photo.png"');
    expect(lute.Md2HTML(lute.VditorIRDOM2Md(lute.Md2VditorIRDOM(markdown))))
        .toContain('src="images/my%20photo.png"');
});

it.each([false, true])("preserves standard image destinations with imgPathAllowSpace=%s", enabled => {
    const lute = createLute(enabled);
    expect(lute.Md2HTML('![alt](<images/my photo.png> "caption")'))
        .toContain(`src="images/my${enabled ? " " : "%20"}photo.png" alt="alt" title="caption"`);
    expect(lute.Md2HTML("![alt](images/my%20photo.png)"))
        .toContain('src="images/my%20photo.png"');
    expect(lute.Md2HTML('[link](images/my photo.png)'))
        .toContain(enabled ? '<a href="images/my photo.png">link</a>' : '[link](images/my photo.png)');
});
