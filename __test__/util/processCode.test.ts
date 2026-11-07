const {processPasteCode} = require("../../src/ts/util/processCode");

describe("processPasteCode", () => {
    test("should not treat plain pre-wrapped markdown as code block", () => {
        const text = "<div>inline html tag</div>\n\n- item";
        const html = `<pre>${text}</pre>`;

        expect(processPasteCode(html, text, "wysiwyg")).toBe(false);
    });

    test("should still detect pre+code as code block", () => {
        const text = "const a = 1;\nconsole.log(a);";
        const html = `<pre><code>${text}</code></pre>`;

        const result = processPasteCode(html, text, "wysiwyg");
        expect(result).toContain("data-type=\"code-block\"");
    });

    test("should not auto-detect code only by pre class", () => {
        const text = "just a normal sentence";
        const html = `<pre class="language-js">${text}</pre>`;

        expect(processPasteCode(html, text, "wysiwyg")).toBe(false);
    });

    test("should detect code by content", () => {
        const text = "const a = 1;\nif (a) {\n  console.log(a);\n}";
        const html = `<pre>${text}</pre>`;

        const result = processPasteCode(html, text, "wysiwyg");
        expect(result).toContain("data-type=\"code-block\"");
    });
});
