import {getMarkdown} from "../../src/ts/markdown/getMarkdown";

require("../../src/js/lute/lute.min.js");

const globalAny: any = global;

const newLute = () => globalAny.Lute.New();

describe("getMarkdown normalizes U+00A0 in wysiwyg/ir", () => {
    it("writes a regular space before bold when the wysiwyg DOM has &nbsp;", () => {
        const lute = newLute();
        const html = "<p data-block=\"0\">identifiable&nbsp;<strong data-marker=\"**\">feeder patterns</strong></p>";
        const vditor: any = {
            currentMode: "wysiwyg",
            lute,
            wysiwyg: {element: {innerHTML: html}},
        };
        const md = getMarkdown(vditor);
        expect(md).not.toMatch(/\u00a0/);
        expect(md).toContain("identifiable **feeder patterns**");
    });

    it("writes a regular space before bold when the IR DOM has &nbsp;", () => {
        const lute = newLute();
        const html = "<p data-block=\"0\">identifiable&nbsp;<span data-type=\"strong\"><span class=\"vditor-ir__marker vditor-ir__marker--pre\">**</span><span class=\"vditor-ir__node\">feeder patterns</span><span class=\"vditor-ir__marker vditor-ir__marker--pre\">**</span></span></p>";
        const vditor: any = {
            currentMode: "ir",
            lute,
            ir: {element: {innerHTML: html}},
        };
        const md = getMarkdown(vditor);
        expect(md).not.toMatch(/\u00a0/);
        expect(md).toContain("identifiable **feeder patterns**");
    });

    it("keeps a regular space before bold inside a table cell after wysiwyg serialize", () => {
        const lute = newLute();
        const html = "<table data-block=\"0\"><thead><tr><th>q</th></tr></thead>" +
            "<tbody><tr><td>identifiable&nbsp;<strong data-marker=\"**\">feeder patterns</strong></td></tr></tbody></table>";
        const vditor: any = {
            currentMode: "wysiwyg",
            lute,
            wysiwyg: {element: {innerHTML: html}},
        };
        const md = getMarkdown(vditor);
        expect(md).not.toMatch(/\u00a0/);
        expect(md).toMatch(/identifiable \*\*feeder patterns\*\*/);
    });
});
