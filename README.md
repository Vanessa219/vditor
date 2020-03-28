<p align="center">
<img alt="Vditor" src="https://b3log.org/images/brand/vditor-128.png" />

<br>
下一代的 Markdown 编辑器，为未来而构建
<br><br>
<a title="MIT" target="_blank" href="https://opensource.org/licenses/MIT"><img src="http://img.shields.io/badge/license-MIT-orange.svg?style=flat-square"></a>
<a title="npm bundle size" target="_blank" href="https://www.npmjs.com/package/vditor"><img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/vditor?style=flat-square&color=blueviolet"></a>
<a title="Dependencies" target="_blank" href="https://github.com/Vanessa219/vditor"><img src="https://img.shields.io/david/Vanessa219/vditor.svg?style=flat-square&color=ff96b4"></a>  <br>
<a title="Version" target="_blank" href="https://www.npmjs.com/package/vditor"><img src="https://img.shields.io/npm/v/vditor.svg?style=flat-square"></a>
<a title="Downloads" target="_blank" href="https://www.npmjs.com/package/vditor"><img src="https://img.shields.io/npm/dt/vditor.svg?style=flat-square&color=97ca00"></a><br>
<a title="jsdelivr" target="_blank" href="https://www.jsdelivr.com/package/npm/vditor"><img src="https://data.jsdelivr.com/v1/package/npm/vditor/badge"/></a>
<a title="Hits" target="_blank" href="https://github.com/88250/hits"><img src="https://hits.b3log.org/Vanessa219/vditor.svg"></a> <br><br>
<a title="GitHub Watchers" target="_blank" href="https://github.com/Vanessa219/vditor/watchers"><img src="https://img.shields.io/github/watchers/Vanessa219/vditor.svg?label=Watchers&style=social"></a>  
<a title="GitHub Stars" target="_blank" href="https://github.com/Vanessa219/vditor/stargazers"><img src="https://img.shields.io/github/stars/Vanessa219/vditor.svg?label=Stars&style=social"></a>  
<a title="GitHub Forks" target="_blank" href="https://github.com/Vanessa219/vditor/network/members"><img src="https://img.shields.io/github/forks/Vanessa219/vditor.svg?label=Forks&style=social"></a>  
<a title="Author GitHub Followers" target="_blank" href="https://github.com/vanessa219"><img src="https://img.shields.io/github/followers/vanessa219.svg?label=Followers&style=social"></a>
</p>

## 💡 简介

[Vditor](https://github.com/Vanessa219/vditor) 是一款浏览器端的 Markdown 编辑器，使用 TypeScript 实现。支持原生 JavaScript、Vue、React、Angular。

欢迎到 [Vditor 官方讨论区](https://hacpai.com/tag/vditor)了解更多。同时也欢迎关注 B3log 开源社区微信公众号 `B3log开源`：

![b3logos.png](https://img.hacpai.com/file/2019/10/image-d3c00d78.png)

## 📽️ 背景

我们在开发 [Sym](https://github.com/88250/symphony) 的初期是直接使用 WYSIWYG 富文本编辑器的。那时候基于 HTML 的编辑器非常流行，项目中引用起来也很方便，也符合用户当时的使用习惯。

后来，Markdown 的崛起逐步改变了大家的排版方式。再加上我们其他几个项目都是面向程序员用户的，所以迁移到 md 上也是大势所趋。我们选择了 [CodeMirror](https://github.com/codemirror/CodeMirror)，这是一款优秀的编辑器，它对开发者提供了丰富的编程接口，对各种浏览器的兼容性也比较好。

再后来，随着我们项目业务需求方面的沉淀，使用 CodeMirror 有时候会感到比较“笨重”。比如要实现 @自动完成用户名列表、插入 Emoji、上传文件等就需要比较深入的二次开发，而这些业务需求恰恰是很多项目场景共有且必备的。

终于，我们决定开始在 Sym 中自己实现编辑器。随着几个版本的迭代，Sym 的编辑器也日趋成熟。在我们运营的社区[黑客派](https://hacpai.com)上陆续有人问我们是否能将编辑器单独抽离出来提供给大家使用。与此同时，我们的前端主程 [V](https://hacpai.com/member/Vanessa) 同学对于维护分散在各个项目中的编辑器也感到有点力不从心，外加对 TypeScript 的好感，所以就决定使用 ts 来实现一个全新的浏览器端 md 编辑器。

于是，Vditor 就这样诞生了。

## ✨  特性

* 支持三种编辑模式：所见即所得、即时渲染、分屏预览
* 支持任务列表、at、图表、流程图、甘特图、时序图、五线谱、[多媒体](https://github.com/Vanessa219/vditor/issues/5)、语音阅读、标题锚点渲染
* 支持[**快捷键**](https://hacpai.com/article/1582778815353)操作
* 支持 Markdown **格式化**， Markdown **语法树**实时渲染
* **表情**自动补全，设置常用表情，支持表情自定义
* 自定义**工具栏**按钮、提示、插入字符、快捷键，支持工具栏添加按钮
* 可使用拖拽、剪切板粘贴上传，显示实时上传进度，支持 CORS 跨域上传
* 实时保存内容，防止意外丢失
* 录音支持，用户可直接**发布语音**
* 粘贴 HTML **自动转换**为 Markdown，如粘贴中包含外链图片可通过指定接口上传到服务器
* 提供实时预览、滚动同步定位
* 支持主窗口大小拖拽、字符计数
* 多主题支持、内置黑白两套
* 多语言支持、内置中英文
* 支持主流浏览器和移动端

![demo](https://img.hacpai.com/file/2020/02/%E6%88%AA%E5%9B%BE%E4%B8%93%E7%94%A8-ef21ef12.png)

![render](https://img.hacpai.com/file/2019/12/6434107230ebd600d01a11e98e8ab30c24364b58-2f777b2d.png)

## 🔮 编辑模式

### 所见即所得

*所见即所得*模式对不熟悉 Markdown 的用户较为友好，熟悉 Markdown 的话也可以无缝使用。

![vditor-wysiwyg](https://img.hacpai.com/file/2020/03/wysiwyg-94c13d78.gif)

### 即时渲染

*即时渲染*模式对熟悉 Typora 的用户应该不会感到陌生，理论上这是最优雅的 Markdown 编辑方式。

![vditor-ir](https://img.hacpai.com/file/2020/03/ir-6d784c1f.gif)

### 分屏预览

传统的*分屏预览*模式适合大屏下的 Markdown 编辑。

![vditor-sv](https://img.hacpai.com/file/2020/03/sv-776055ce.gif)

## 🗃 案例

* [🎶 Sym](https://github.com/88250/symphony) 一款用 Java 实现的现代化社区（论坛/BBS/社交网络/博客）平台
* [🎸 Solo](https://github.com/88250/solo) & [🎷Pipe](https://github.com/88250/pipe) B3log 分布式社区的博客端节点，欢迎加入下一代社区网络
* [📕 链滴笔记](https://github.com/88250/liandi) 一款桌面端笔记应用，支持 Windows、Mac 和 Linux
* [🌟 Starfire](https://github.com/88250/starfire) 一个分布式的内容分享讨论社区，星星之火可以燎原
* [📝 Arya](https://github.com/nicejade/markdown-online-editor) 基于 Vue、Vditor，所构建的在线 Markdown 编辑器

## 🛠️ 使用文档

### CommonJS

* 安装依赖

```shell
npm install vditor --save
```

* 在代码中引入并初始化对象，可参考 [index.js](https://github.com/Vanessa219/vditor/blob/master/demo/index.js)

```ts
import Vditor from 'vditor'
import "~vditor/src/assets/scss/index" // 或者使用 dark

const vditor = new Vditor(id, {options...})
```

### HTML script

* 在 HTML 中插入 CSS 和 js，可参考 [static.html](https://github.com/Vanessa219/vditor/blob/master/demo/static.html)

```html
<!-- ⚠️生产环境请指定版本号，如 https://cdn.jsdelivr.net/npm/vditor@x.x.x/dist... -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vditor/dist/index.css" />
<script src="https://cdn.jsdelivr.net/npm/vditor/dist/index.min.js" defer></script>
```

### 示例代码

* [CommonJS](https://github.com/Vanessa219/vditor/blob/master/demo/index.js)
* [HTML script](https://github.com/Vanessa219/vditor/blob/master/demo/static.html)
* [Preview](https://github.com/Vanessa219/vditor/blob/master/demo/static-preview.html)
* [Vue](https://github.com/88250/pipe/blob/master/console/pages/admin/articles/post/index.vue)

### 主题

* 支持黑白两套主题：classic/dark
* 参考现有样式后使用自己开发的 scss/css 进行样式的完全自定制
* 可通过修改 [index.scss](https://github.com/Vanessa219/vditor/blob/master/src/assets/scss/index.scss) 中的变量对主题颜色进行定制
* 在内容显示元素上添加 `class="vditor-reset"` （经典主题） 或 `class="vditor-reset vditor-reset--dark"`（黑色主题） 属性可对内容进行更为友好的展示

### API

#### id

可填入元素 `id` 或元素自身 `HTMLElement`

⚠️：当填入元素自身的 `HTMLElement` 时需设置 `options.cache.id` 或将 `options.cache.enable` 设置为 `false`

#### options

|   | 说明 | 默认值 |
| - | - | - |
| after | 编辑器异步渲染完成后的回调方法 | undefined |
| height | 编辑器总高度 | 'auto' |
| width | 编辑器总宽度，支持 % | 'auto' |
| placeholder | 输入区域为空时的提示 | '' |
| lang | 多语言：en_US, zh_CN | 'zh_CN' |
| counter | 计数器 | 0 |
| input | 输入后触发 (value: string, previewElement?: HTMLElement): void | - |
| focus | 聚焦后触发 (value: string): void | - |
| blur | 失焦后触发 (value: string): void | - |
| esc | <kbd>esc</kbd> 按下后触发 (value: string): void | - |
| ctrlEnter | <kbd>⌘/ctrl+enter</kbd> 按下后触发 (value: string): void | - |
| select | 编辑器中选中文字后触发 (value: string): void | - |
| tab | tab 键操作字符串，支持 `\t` 及任意字符串 | - |
| typewriterMode | 是否启用打字机模式 | false |
| cdn | 配置自建 CDN 地址 | `https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}` |
| mode | 可选模式："sv", "ir", "wysiwyg" | 'wysiwyg' |
| debugger | 是否显示日志 | false |
| value | 编辑器初始化值 | '' |
| theme | 主题："classic"，"dark" | 'classic' |
| hideToolbar | 是否隐藏工具栏 | false |

#### options.toolbar

* 工具栏，可使用 name 进行简写： `toolbar: ['emoji', 'br', 'bold', '|', 'line']` 。默认值参见 [src/ts/util/Options.ts](https://github.com/Vanessa219/vditor/blob/master/src/ts/util/Options.ts)
* name 可枚举为： `emoji` , `headings` , `bold` , `italic` , `strike` , `|` , `line` , `quote` , `list` , `ordered-list` , `check` , `code` , `inline-code` , `undo` , `redo` , `upload` , `link` , `table` , `record` , `edit-mode` , `both` , `preview` , `format` , `fullscreen` , `devtools` , `info` , `help` , `br`
* 当 `name` 不在枚举中时，可以添加自定义按钮，格式如下：

```js
{  
 hotkey: '⌘-⇧-f',  
 name: 'format',  
 tipPosition: 'ne',  
 tip: 'format',  
 icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="768" height="768" viewBox="0 0 768 768"><path d="M342 426v-84h426v84h-426zM342 256v-86h426v86h-426zM0 0h768v86h-768v-86zM342 598v-86h426v86h-426zM0 214l170 170-170 170v-340zM0 768v-86h768v86h-768z"></path></svg>',  
 click: () => {  
   alert('custom toolbar')  
 },  
}
```

|   | 说明 | 默认值 |
| - | - | - |
| name | 唯一标示 | - |
| icon | svg 图标 | - |
| tip | 提示 | - |
| tipPosition | 提示位置：ne, nw | - |
| hotkey | 快捷键，支持<kbd> ⌘/ctrl-key </kbd>  或  <kbd> ⌘/ctrl-⇧/shif-key </kbd>  格式的配置，不支持 wysiwyg 模式 | - |
| suffix | 插入编辑器中的后缀 | - |
| prefix | 插入编辑器中的前缀 | - |
| click | 自定义按钮点击时触发的事件 ():viod | - |

#### options.cache

|   | 说明 | 默认值 |
| - | - | - |
| enable | 是否使用 localStorage 进行缓存 | true |
| id | 缓存 key，第一个参数为元素且启用缓存时**必填** | - |

#### options.preview

|   | 说明 | 默认值 |
| - | - | - |
| delay | 预览 debounce 毫秒间隔 | 1000 |
| maxWidth | 预览区域最大宽度 | 768 |
| mode | 显示模式：'both', 'editor', 'preview' | 'both' |
| url | md 解析请求 | - |
| parse | 预览回调 (element: HTMLElement): void | - |
| transform | 渲染之前回调(html: string): string | - |

#### options.preview.hljs

|   | 说明 | 默认值 |
| - | - | - |
| enable | 是否启用代码高亮 | true |
| style | 可选值参见[Chroma](https://xyproto.github.io/splash/docs/longer/all.html) | `github` |
| lineNumber | 是否启用行号 | false |

#### options.preview.markdown

|   | 说明 | 默认值 |
| - | - | - |
| autoSpace | 自动空格 | false |
| fixTermTypo | 自动矫正术语 | false |
| chinesePunct | 自动矫正标点 | false |
| toc | 插入目录 | false |
| footnotes | 脚注 | true |

#### options.preview.math

|   | 说明 | 默认值 |
| - | - | - |
| inlineDigit | 内联数学公式起始 $ 后是否允许数字 | false |
| macros | 使用 MathJax 渲染时传入的宏定义 | {} |
| engine | 数学公式渲染引擎："KaTeX", "MathJax" | 'KaTeX' |

#### options.hint

|   | 说明 | 默认值 |
| - | - | - |
| delay | 提示 debounce 毫秒间隔 | 200 |
| emoji | 默认表情，可从[lute/emoji_map](https://github.com/88250/lute/blob/master/emoji_map.go) 中选取，也可自定义 | { '+1': '👍', '-1': '👎', 'heart': '❤️ ', 'cold_sweat': '😰' } |
| emojiTail | 常用表情提示 | - |
| emojiPath | 表情图片地址 | `https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}/dist/images/emoji` |
| at | @用户回调，(value: string): Array\<any> ，需同步返回数组[{value: '', html: ''}] | - |

#### options.upload

* 文件上传的数据结构如下。后端返回的数据结构不一致时，可使用 `format` 进行转换。

```js
// POST data  
xhr.send(formData);  // formData = FormData.append("file[]", File)  
// return data  
{  
 "msg": "",  
 "code": 0,  
 "data": {  
 "errFiles": ['filename', 'filename2'],  
 "succMap": {  
   "filename3": "filepath3",  
   "filename3": "filepath3"  
   }  
 }  
}
```

* 为了防止站外图片失效， `linkToImgUrl` 可将剪贴板中的站外图片地址传到服务器端进行保存处理，其数据结构如下：

```js
// POST data  
xhr.send(JSON.stringify({url: src})); // src 为站外图片地址  
// return data  
{  
 msg: '',  
 code: 0,  
 data : {  
   originalURL: '',  
   url: ''  
 }  
}
```

|   | 说明 | 默认值 |
| - | - | - |
| url | 上传 url | '' |
| max | 上传文件最大 Byte | 10 * 1024 * 1024 |
| linkToImgUrl | 剪切板中包含图片地址时，使用此 url 重新上传 | '' |
| success | 上传成功回调 (editor: HTMLPreElement, msg: string): void | - |
| error | 上传失败回调 (msg: string): void | - |
| token | CORS 上传验证，头为 X-Upload-Token | - |
| withCredentials | 跨站点访问控制 | false |
| headers | 请求头设置 | - |
| filename | 文件名安全处理 (name: string): string | name => name.replace(/\W/g, '') |
| accept | 文件上传类型，同[input accept](https://www.w3schools.com/tags/att_input_accept.asp) | - |
| validate | 校验，成功时返回 true 否则返回错误信息 (files: File[]) => string\| boolean | - |
| handler | 自定义上传，当发生错误时返回错误信息 (files: File[]) => string\| null | - |
| format | 对服务端返回的数据进行转换，以满足内置的数据结构 (files: File[], responseText: string): string | - |
| file | 将上传的文件处理后再返回 (files: File[]): File[] | - |

#### options.resize

|   | 说明 | 默认值 |
| - | - | - |
| enable | 是否支持大小拖拽 | false |
| position | 拖拽栏位置：top, bottom | 'bottom' |
| after | 拖拽结束的回调 (height: number): void | - |

#### options.classes

|   | 说明 | 默认值 |
| - | - | - |
| preview | 预览元素上的 className | '' |

#### options.keymap

|   | 说明 | 默认值 |
| - | - | - |
| deleteLine | 删除光标所在行或选中的行 | <kbd> ⌘-Backspace </kbd> |
| duplicate | 复制当前行或选中的内容 | <kbd> ⌘-d </kbd> |

#### methods

|   | 说明 |
| - | - |
| getValue() | 获取编辑器内容 |
| getHTML() | 获取预览区内容 |
| insertValue(value: string, render = true) | 在焦点处插入内容，并默认进行 Markdown 渲染 |
| focus() | 聚焦到编辑器 |
| blur() | 让编辑器失焦 |
| disabled() | 禁用编辑器 |
| enable() | 解除编辑器禁用 |
| setSelection(start: number, end: number) | 选中从 start 开始到 end 结束的字符串，不支持 wysiwyg 模式 |
| getSelection():string | 返回选中的字符串 |
| setValue(markdown: string) | 设置编辑器内容 |
| renderPreview(value?: string) | 设置预览区域内容 |
| getCursorPosition():{top: number, left: number} | 获取焦点位置 |
| deleteValue() | 删除选中内容 |
| updateValue(value: string) | 更新选中内容 |
| isUploading() | 上传是否还在进行中 |
| clearCache() | 清除缓存 |
| disabledCache() | 禁用缓存 |
| enableCache() | 启用缓存 |
| html2md(value: string) | HTML 转 md |
| tip(text:string, time:number) | 消息提示。time 为 0 将一直显示 |
| setPreviewMode(mode: string) | 设置预览模式。mode: 'both', 'editor', 'preview' |
| setTheme(theme: "dark"\|"classic") | 设置主题 |

#### static methods

* 不需要进行编辑操作时，仅需引入 [`method.min.js`](https://cdn.jsdelivr.net/npm/vditor/dist/) 后如下直接调用

```js
Vditor.mermaidRender(document)
```

```js
import VditorPreview from 'vditor/dist/method.min'  
VditorPreview.mermaidRender(document)
```

* 需要对页面中的 Markdown 进行渲染时可直接调用 `preview` 方法，参数如下：

```js
previewElement: HTMLDivElement,   // 使用该元素进行渲染
markdown: string,  // 需要渲染的 markdown 原文
options?: IPreviewOptions {  
 anchor?: boolean;  // 为标题添加锚点
 theme?: string;  // 主题：'classic' | 'dark'，默认为 'classic'
 customEmoji?: { [key: string]: string };    // 自定义 emoji，默认为 {}  
 lang?: (keyof II18nLang);    // 语言，默认为 'zh_CN'  
 emojiPath?: string;    // 表情图片路径 
 hljs?: IHljs // 参见 options.preview.hljs 
 speech?: {  // 对选中后的内容进行阅读
  enable?: boolean
 }
 math?: IMath // 数学公式渲染配置
 transform?(html: string): string // 在渲染前进行的回调方法
 cdn?: string // 自建 CDN 地址
}
```

* ⚠️ `method.min.js`  和 `index.min.js` 不可同时引入

|   | 说明 |
| - | - |
| mermaidRender(element: HTMLElement, className = ".language-mermaid", cdn = options.cdn) | 转换 element 中 class 为 className 的元素为流程图/时序图/甘特图 |
| codeRender(element: HTMLElement, lang: (keyof II18nLang) = "zh_CN") | 为 element 中的代码块添加复制按钮 |
| chartRender(element: (HTMLElement\| Document) = document, cdn = options.cdn) | 图表渲染 |
| abcRender(element: (HTMLElement\| Document) = document, cdn = options.cdn) | 五线谱渲染 |
| md2html(mdText: string, options?: IPreviewOptions): string | Markdown 文本转换为 HTML |
| preview(previewElement: HTMLDivElement, markdown: string, options?: IPreviewOptions) | 页面 Markdown 文章渲染 |
| highlightRender(hljsOption?:IHljs, element?: HTMLElement\| Document, cdn = options.cdn) | 为 element 中的代码块进行高亮渲染 |
| mediaRender(element: HTMLElement) | 为[特定链接](https://github.com/Vanessa219/vditor/issues/7)分别渲染为视频、音频、嵌入的 iframe |
| mathRender(element: HTMLElement, options?: {cdn?: string, math?: IMath}) | 对数学公式进行渲染 |
| speechRender(element: HTMLElement, lang?: (keyof II18nLang)) | 对选中的文字进行阅读 |
| graphvizRender(element: HTMLElement, cdn?: string) | 对 graphviz 进行渲染 |

## 🏗 开发文档

### 原理相关

* [关于所见即所得 Markdown 编辑器的讨论](https://hacpai.com/article/1579414663700)
* [Vditor 实现 Markdown 所见即所得](https://hacpai.com/article/1577370404903)
* [Lute 一款对中文语境优化的 Markdown 引擎，支持 Go 和 JavaScript](https://hacpai.com/article/1567047822949)

### 环境

1. 安装 [node](https://nodejs.org/) LTS 版本
2. [下载](https://github.com/Vanessa219/vditor/archive/master.zip) 最新代码并解压
3. 根目录运行 `npm install`
4. `npm run start` 启动本地服务器，打开 http://localhost:9000
5. 修改代码
6. `npm run build` 打包代码到 dist 目录

### CDN 切换

由于使用了按需加载的机制，默认 CDN 为 [https://cdn.jsdelivr.net/npm/vditor](https://cdn.jsdelivr.net/npm/vditor)@版本号

如果代码有修改或需要使用自建 CDN 的话，可按以下步骤进行操作：

* 初始化的 `options` 及 `IPreviewOptions` 中需添加 `cdn` 配置
* `highlightRender` , `mathRender` , `abcRender` , `chartRender` , `mermaidRender` 方法中需添加 cdn 参数
* 将 build 成功的 dist 目录或 [jsDelivr](https://www.jsdelivr.com/package/npm/vditor?path=dist) 中的 dist 目录拷贝至正确的位置

### 升级

版本升级时请**仔细阅读** [CHANGELOG](https://github.com/Vanessa219/vditor/blob/master/CHANGELOG.md) 中的**升级**部分

## Ⓜ️ Markdown 使用指南

* [基础语法](https://hacpai.com/article/1583129520165)
* [扩展语法](https://hacpai.com/article/1583305480675)
* [速查手册](https://hacpai.com/article/1583308420519)

## 🏘️ 社区

* [讨论区](https://hacpai.com/tag/vditor)
* [报告问题](https://github.com/Vanessa219/vditor/issues/new)

## 📄 授权

Vditor 使用 [MIT](https://opensource.org/licenses/MIT) 开源协议。

## 🙏 鸣谢

* [Lute](https://github.com/88250/lute)：🎼 一款结构化的 Markdown 引擎，支持 Go 和 JavaScript
* [highlight.js](https://github.com/highlightjs/highlight.js)：JavaScript syntax highlighter
* [mermaid](https://github.com/knsv/mermaid)：Generation of diagram and flowchart from text in a similar manner as Markdown
* [incubator-echarts](https://github.com/apache/incubator-echarts)：A powerful, interactive charting and visualization library for browser
* [abcjs](https://github.com/paulrosen/abcjs)：JavaScript library for rendering standard music notation in a browser
