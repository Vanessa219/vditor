import {spec} from "./commonmark-0.29";

require("../../src/js/lute/lute.min.js");

const globalAny: any = global;
// Lute 对宽松 HTML 注释的处理不同于 CommonMark 0.29。
const luteDifferences = new Set([622, 623]);

it("MarkdownIt", () => {
    spec.forEach((item: any) => {
        if (luteDifferences.has(item.example)) {
            return;
        }
        const lute = globalAny.Lute.New();
        lute.SetGFMAutoLink(false);
        lute.SetGFMStrikethrough(false);
        lute.SetGFMTable(false);
        lute.SetGFMTaskListItem(false);
        lute.SetSoftBreak2HardBreak(false);
        lute.SetAutoSpace(false);
        lute.SetFixTermTypo(false);
        lute.SetEmoji(false);
        lute.SetYamlFrontMatter(false);
        const result = lute.MarkdownStr("", item.markdown);
        expect(result).toBe(item.html);
    });
});
