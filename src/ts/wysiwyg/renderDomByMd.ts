import {abcRender} from "../markdown/abcRender";
import {chartRender} from "../markdown/chartRender";
import {codeRender} from "../markdown/codeRender";
import {highlightRender} from "../markdown/highlightRender";
import {mathRender} from "../markdown/mathRender";
import {mediaRender} from "../markdown/mediaRender";
import {mermaidRender} from "../markdown/mermaidRender";

export const renderDomByMd = (vditor: IVditor, md: string) => {
    const domHTML = vditor.lute.RenderVditorDOM(md);
    vditor.wysiwyg.element.innerHTML = domHTML[1] || domHTML[0];
    codeRender(vditor.wysiwyg.element, vditor.options.lang);
    highlightRender(vditor.options.preview.hljs.style, vditor.options.preview.hljs.enable,
        vditor.wysiwyg.element);
    mathRender(vditor.wysiwyg.element, vditor.options.lang);
    mermaidRender(vditor.wysiwyg.element);
    chartRender(vditor.wysiwyg.element);
    abcRender(vditor.wysiwyg.element);
    mediaRender(vditor.wysiwyg.element);
};
