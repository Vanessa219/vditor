import {spec} from "./commonmark-0.29";

require("../../src/js/lute/lute.min.js");

const globalAny: any = global;

it("MarkdownIt", () => {
    spec.forEach(async (item: any) => {
        const lute = globalAny.Lute.New();
        lute.SetGFMAutoLink(false);
        lute.SetGFMStrikethrough(false);
        lute.SetGFMTable(false);
        lute.SetGFMTaskListItem(false);
        lute.SetSoftBreak2HardBreak(false);
        lute.SetAutoSpace(false);
        lute.SetFixTermTypo(false);
        lute.SetEmoji(false);
        const result = lute.MarkdownStr("", item.markdown);
        expect(result[0]).toBe(item.html);
    });
});
