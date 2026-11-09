require("../../src/js/lute/lute.min.js");

describe("temporarily empty inline math", () => {
    it.each(["<code></code>", "\u200b<code></code>", "<code>x</code>"])(
        "keeps surrounding content while converting %s", content => {
            const lute = Lute.New();
            const html = `<p data-block="0">before <span data-type="math-inline">${content}</span> after</p>`;
            for (const method of ["VditorDOM2Md", "VditorDOM2HTML", "SpinVditorDOM"]) {
                const result = lute[method](html);
                expect(result).toContain("before");
                expect(result).toContain("after");
                if (content.includes(">x<")) { expect(result).toContain("x"); }
            }
        });
});
