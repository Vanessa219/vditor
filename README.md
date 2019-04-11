<p align="center">
<img alt="Vditor" src="https://user-images.githubusercontent.com/873584/52320007-9980bf00-2a07-11e9-8acc-0fb5a7fab8c9.png" />
<br>
下一代的 Markdown 编辑器，为未来而构建
<br><br>
<a title="MIT" target="_blank" href="https://opensource.org/licenses/MIT"><img src="http://img.shields.io/badge/license-MIT-orange.svg?style=flat-square"></a>
<a title="Code Size" target="_blank" href="https://github.com/b3log/vditor"><img src="https://img.shields.io/github/languages/code-size/b3log/vditor.svg?style=flat-square"></a>
<a title="Dependencies" target="_blank" href="https://github.com/b3log/vditor"><img src="https://img.shields.io/david/b3log/vditor.svg?style=flat-square"></a>  
<a title="Version" target="_blank" href="https://www.npmjs.com/package/vditor"><img src="https://img.shields.io/npm/v/vditor.svg?style=flat-square"></a>
<a title="Downloads" target="_blank" href="https://www.npmjs.com/package/vditor"><img src="https://img.shields.io/npm/dt/vditor.svg?style=flat-square"></a>
<a title="Hits" target="_blank" href="http://hits.dwyl.io/b3log/vditor"><img src="http://hits.dwyl.io/b3log/vditor.svg"></a>
</p>

## 简介

[Vditor](https://github.com/b3log/vditor) 是一款浏览器端的 Markdown 编辑器，使用 TypeScript 实现。支持原生 JavaScript、Vue、React。

## 背景

<details>
<summary>太长不看。</summary>
<br>

我们在开发 [Sym](https://github.com/b3log/symphony) 的初期是直接使用 WYSIWYG 富文本编辑器的。那时候基于 HTML 的编辑器非常流行，项目中引用起来也很方便，也符合用户当时的使用习惯。

后来，Markdown 的崛起逐步改变了大家的排版方式。再加上我们其他几个项目都是面向程序员用户的，所以迁移到 md 上也是大势所趋。我们选择了 [CodeMirror](https://github.com/codemirror/CodeMirror)，这是一款优秀的编辑器，它对开发者提供了丰富的编程接口，对各种浏览器的兼容性也比较好。

再后来，随着我们项目业务需求方面的沉淀，使用 CodeMirror 有时候会感到比较“笨重”。比如要实现 @自动完成用户名列表、插入 Emoji、上传文件等就需要比较深入的二次开发，而这些业务需求恰恰是很多项目场景共有且必备的。

终于，我们决定开始在 Sym 中自己实现编辑器。随着几个版本的迭代，Sym 的编辑器也日趋成熟。在我们运营的社区[黑客派](https://hacpai.com)上陆续有人问我们是否能将编辑器单独抽离出来提供给大家使用。与此同时，我们的前端主程 [V](https://hacpai.com/member/Vanessa) 同学对于维护分散在各个项目中的编辑器也感到有点力不从心，外加她最近在学 TypeScript 正好需要练手实践，所以就决定使用 ts 来实现一个全新的浏览器端 md 编辑器。

于是，Vditor 就这样诞生了。
</details>

## 功能

* 支持流程图、甘特图、时序图、任务列表
* 插入原生 Emoji、设置常用表情列表
* 自定义工具栏按钮、提示、插入文案及快捷键
* 可使用拖拽、剪切板粘贴上传，显示实时上传进度
* 支持 CORS 跨域上传
* 内容保存本地存储，防止意外丢失
* 录音支持，用户可直接发布语音
* 粘贴 HTML 自动转换为 Markdown
* 提供实时预览、滚动同步定位
* 支持主窗口大小拖拽、字符计数
* 多主题支持、内置黑白两套
* 多语言支持、内置中英文
* 支持主流浏览器和移动端

![v](https://user-images.githubusercontent.com/970828/52485686-66e7e980-2bf4-11e9-9ad3-e84f1d364351.png)

![v](https://user-images.githubusercontent.com/970828/52489258-bf22e980-2bfc-11e9-8721-9e2bbb91c3f1.png)

## 案例

* [Sym](https://github.com/b3log/symphony)：一款用 Java 实现的现代化社区（论坛/BBS/社交网络/博客）平台
* [Solo](https://github.com/b3log/solo)：一款小而美的博客系统，使用 Java 实现
* [Pipe](https://github.com/b3log/pipe)：一款小而美的博客平台，使用 Go 实现

## 文档

* [《提问的智慧》精读注解版](https://hacpai.com/article/1536377163156)
* [Vditor 使用指南](https://hacpai.com/article/1549638745630?r=Vanessa)

## 授权

Vditor 使用 [MIT](https://opensource.org/licenses/MIT) 开源协议。

## 社区

* [讨论区](https://hacpai.com/tag/vditor)
* [报告问题](https://github.com/b3log/vditor/issues/new/choose)

## 鸣谢

* [markdown-it](https://github.com/markdown-it/markdown-it)：Markdown parser, done right. 100% CommonMark support, extensions, syntax plugins & high speed
* [highlight.js](https://github.com/highlightjs/highlight.js)：Javascript syntax highlighter
* [Turndown](https://github.com/domchristie/turndown)：🛏 An HTML to Markdown converter written in JavaScript
* [mermaid](https://github.com/knsv/mermaid)：Generation of diagram and flowchart from text in a similar manner as markdown
