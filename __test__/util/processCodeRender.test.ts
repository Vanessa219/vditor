jest.mock("../../src/ts/markdown/abcRender", () => ({abcRender: jest.fn()}));
jest.mock("../../src/ts/markdown/chartRender", () => ({chartRender: jest.fn()}));
jest.mock("../../src/ts/markdown/codeRender", () => ({codeRender: jest.fn()}));
jest.mock("../../src/ts/markdown/flowchartRender", () => ({flowchartRender: jest.fn()}));
jest.mock("../../src/ts/markdown/graphvizRender", () => ({graphvizRender: jest.fn()}));
jest.mock("../../src/ts/markdown/highlightRender", () => ({highlightRender: jest.fn()}));
jest.mock("../../src/ts/markdown/mathRender", () => ({mathRender: jest.fn()}));
jest.mock("../../src/ts/markdown/mermaidRender", () => ({mermaidRender: jest.fn()}));
jest.mock("../../src/ts/markdown/markmapRender", () => ({markmapRender: jest.fn()}));
jest.mock("../../src/ts/markdown/mindmapRender", () => ({mindmapRender: jest.fn()}));
jest.mock("../../src/ts/markdown/plantumlRender", () => ({plantumlRender: jest.fn()}));
jest.mock("../../src/ts/markdown/SMILESRender", () => ({SMILESRender: jest.fn()}));
jest.mock("../../src/ts/markdown/wavedromRender", () => ({wavedromRender: jest.fn()}));

import {processCodeRender} from "../../src/ts/util/processCode";

describe("ordinary code preview classification", () => {
    const classes = new Set<string>();
    const panel = {
        classList: {
            add: (name: string) => classes.add(name),
            remove: (name: string) => classes.delete(name),
        },
        parentElement: {getAttribute: () => "code-block"},
        firstElementChild: {className: "language-javascript"},
        setAttribute: jest.fn(),
    };
    const vditor = {
        options: {cdn: "", theme: "classic", preview: {hljs: {}, math: {}},
            customRenders: [] as Array<{language: string, render: jest.Mock}>},
    };
    const render = () => processCodeRender(panel as unknown as HTMLElement, vditor as unknown as IVditor);
    const ordinary = () => classes.has("vditor-code__preview");

    beforeEach(() => {
        classes.clear();
        panel.firstElementChild.className = "language-javascript";
        panel.parentElement.getAttribute = () => "code-block";
        vditor.options.customRenders = [];
    });

    it.each(["javascript", "plaintext", "unknown", ""])("marks ordinary %s code", language => {
        panel.firstElementChild.className = "language-" + language;
        render();
        expect(ordinary()).toBe(true);
    });

    it.each(["abc", "mermaid", "smiles", "markmap", "flowchart", "echarts", "mindmap", "plantuml",
        "graphviz", "wavedrom", "math"])("clears the marker when switching to %s and restores it afterwards", language => {
        render();
        expect(ordinary()).toBe(true);
        panel.firstElementChild.className = "language-" + language;
        render();
        expect(ordinary()).toBe(false);
        panel.firstElementChild.className = "language-javascript";
        render();
        expect(ordinary()).toBe(true);
    });

    it("does not collapse a custom renderer for an ordinary code language", () => {
        render();
        const customRender = jest.fn();
        vditor.options.customRenders.push({language: "javascript", render: customRender});
        render();
        expect(customRender).toHaveBeenCalledWith(panel, vditor);
        expect(ordinary()).toBe(false);
    });

    it("clears the marker for an HTML block", () => {
        render();
        panel.parentElement.getAttribute = () => "html-block";
        render();
        expect(ordinary()).toBe(false);
    });
});
