import { VDITOR_VERSION} from "../constants";
import {getEventName} from "../util/compatibility";
import {MenuItem} from "./MenuItem";

export class Info extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].addEventListener(getEventName(), (event) => {
            event.preventDefault();
            vditor.tip.show(`<div style="max-width: 520px; font-size: 14px;line-height: 22px;margin: 0 0 7px 6px;">
<p style="text-align: center">
<img src="https://cdn.jsdelivr.net/npm/vditor/src/assets/images/logo.png"><br>
<em>下一代的 Markdown 编辑器，为未来而构建</em>
</p>
<p>
Vditor 是一款浏览器端的 Markdown 编辑器，支持所见即所得、即时渲染（类似 Typora）和分屏预览模式。
它使用 TypeScript 实现，支持原生 JavaScript、Vue、React 和Angular。</p>
<div style="display: flex;align-items: center">
<ul style="flex: 1;list-style: none">
    <li>
    项目地址：<a href="https://github.com/Vanessa219/vditor" target="_blank">https://github.com/Vanessa219/vditor</a>
    </li>
    <li>
    开源协议：MIT
    </li>
    <li>
    组件版本：Vditor v${VDITOR_VERSION} / Lute v${Lute.Version}
    </li>
    <li>
    赞助捐赠：<a href="https://hacpai.com/sponsor" target="_blank">https://hacpai.com/sponsor</a>
    </li>
</ul>
</div>
</div>`, 0);
        });
    }
}
