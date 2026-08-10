require("../../src/js/lute/lute.min.js");

describe("table cell line breaks in IR mode", () => {
    const newLute = () => {
        const lute = global.Lute.New();
        lute.SetVditorIR(true);
        return lute;
    };

    it("renders br variants as visible line breaks and preserves them", () => {
        const lute = newLute();
        const dom = lute.Md2VditorIRDOM("| c |\n| - |\n| 1<br>2<br/>3 |\n");

        expect(dom).toContain("<td>1<br />2<br />3</td>");
        expect(dom).not.toContain("data-type=\"html-inline\"");
        expect(lute.VditorIRDOM2Md(dom)).toContain("1<br />2<br />3");
    });

    it("keeps a trailing logical break stable across spins", () => {
        const lute = newLute();
        const input = "<table data-block=\"0\"><thead><tr><th>c</th></tr></thead>" +
            "<tbody><tr><td>1<br><wbr><br></td></tr></tbody></table>";
        const dom = lute.SpinVditorIRDOM(input);

        expect(dom).toContain("<td>1<br /><wbr><br /></td>");
        expect(lute.VditorIRDOM2Md(dom)).toContain("1<br />");
        expect(lute.SpinVditorIRDOM(dom)).toBe(dom);
    });
});
