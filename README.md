<p align="center">
<img alt="Vditor" src="https://b3log.org/images/brand/vditor-128.png" />

<br>
The next generation of Markdown editor, built for the future
<br><br>
<a title="MIT" target="_blank" href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-orange.svg?style=flat-square"></a>
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

<p align="center">
<a href="https://hacpai.com/article/1549638745630">中文</a> &nbsp;|&nbsp; <a href="https://vditor.b3log.org/demo/index.html">Demo</a>
</p>

## 💡 Introduction

[Vditor](https://vditor.b3log.org) is a browser-side Markdown editor, implemented using TypeScript. Support native JavaScript, Vue, React and Angular, provide [desktop](https://github.com/88250/liandi).

Welcome to [Vditor Official Site](https://vditor.b3log.org) to learn more.

## 📽️ Background

In the initial stage of developing [Sym](https://github.com/88250/symphony), we directly used WYSIWYG rich text editor. At that time, HTML-based editors were very popular, and it was very convenient to quote them in the project, which also conformed to the usage habits of users at that time.

Later, the rise of Markdown gradually changed everyone's typography. In addition, several of our other projects are for programmer users, so it is also a general trend to migrate to md. We chose [CodeMirror](https://github.com/codemirror/CodeMirror), which is an excellent editor, it provides a rich programming interface for developers, and is also compatible with various browsers. it is good.

Later, as the business needs of our projects have precipitated, using CodeMirror sometimes feels more "cumbersome." For example, to implement @automatically complete the user name list, insert Emoji, upload files, etc., it requires more in-depth secondary development, and these business requirements are precisely common and necessary in many project scenarios.

Finally, we decided to start implementing the editor ourselves in Sym. With the iterations of several versions, Sym's editor has matured. In the community [HacPai](https://hacpai.com) that we operate, people have asked us if we can separate the editor for everyone to use. At the same time, our front-end main programmer [V](https://hacpai.com/member/Vanessa) also felt a little bit overwhelmed with maintaining the editors scattered in various projects, plus a good impression of TypeScript, so I decided Use ts to implement a new browser-side md editor.

So, Vditor was born.

## ✨  Features

* Support three editing modes: WYSIWYG(wysiwyg), Instant Rendering(ir) and Split View(sv)
* Support outline, mathematical formulas, mind maps, charts, flowcharts, Gantt charts, timing charts, staffs, [multimedia](https://hacpai.com/article/1589813914768), voice reading, heading anchors, code highlighting and copying, graphviz rendering
* Built-in security filtering, export, image lazy loading, task list, at, multi-platform preview, multi-theme switching, copy to WeChat function
* Implementation of CommonMark and GFM specifications, formatting and syntax tree viewing of Markdown, and support for [10+ configurations](https://hacpai.com/article/1549638745630#options-preview-markdown)
* The toolbar contains 36+ items of operations. In addition to support for expansion, the [shortcut keys](https://hacpai.com/article/1582778815353), tip, tip positions, icons, click events, class names, and sub-toolbars can be customized
* Emoji auto-complete, set common emoticons, support emoticon customization
* You can use drag and drop, paste and paste to upload, display real-time upload progress, support CORS cross-domain upload
* Save content in real time to prevent accidental loss
* Recording support, users can directly publish voice
* The markup HTML is automatically converted to Markdown, if the paste contains images of external links, it can be uploaded to the server through the specified interface
* Support main window size drag and drop, character counting
* Multi-theme support, built-in black, white and green three sets of themes
* Multi-language support, built-in Chinese, English, Korean text localization
* Support mainstream browsers, mobile friendly

![editor.png](https://b3logfile.com/file/2020/05/editor-adc7f8fd.png)

![preview.png](https://b3logfile.com/file/2020/05/preview-80846f66.png)

## 🔮 Editing Modes

### WYSIWYG

*WYSIWYG* mode is more friendly to users who are not familiar with Markdown, and you can use it seamlessly if you are familiar with Markdown.

![vditor-wysiwyg](https://img.hacpai.com/file/2020/03/wysiwyg-94c13d78.gif)

### Instant Rendering

*Instant Rendering* mode should not be unfamiliar to users who are familiar with Typora. In theory, this is the most elegant Markdown editing method.

![vditor-ir](https://img.hacpai.com/file/2020/03/ir-6d784c1f.gif)

### Split View

The traditional *Split View* mode is suitable for Markdown editing on a large screen.

![vditor-sv](https://img.hacpai.com/file/2020/03/sv-776055ce.gif)

## 🗃 Showcases

* [🎶 Sym](https://github.com/88250/symphony) A modern community (forum/BBS/SNS/blog) platform implemented in Java
* [🎸 Solo](https://github.com/88250/solo) & [🎷 Pipe](https://github.com/88250/pipe) B3log distributed community blog end node, welcome to join the next generation community network
* [📕 LianDi Note](https://github.com/88250/liandi) A desktop note application that supports Windows, Mac and Linux
* [🌟 Starfire](https://github.com/88250/starfire) A distributed content-sharing and discussion community, the spark can catch fire
* [📝 Arya](https://github.com/nicejade/markdown-online-editor) Based on Vue, Vditor, built online Markdown editor

## 🛠️ User Guide

### CommonJS

* Install dependencies

```shell
npm install vditor --save
```

* Introduce and initialize objects in the code, you can refer to [index.js](https://github.com/Vanessa219/vditor/blob/master/demo/index.js)

```ts
import Vditor from 'vditor'
import "~vditor/src/assets/scss/index" // Or use dark

const vditor = new Vditor(id, {options...})
```

### HTML script

* Insert CSS and js in HTML, you can refer to [demo](https://vditor.b3log.org/demo/index.html)

```html
<!-- ⚠️Please specify the version number in the production environment, such as https://cdn.jsdelivr.net/npm/vditor@x.x.x/dist... -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vditor/dist/index.css" />
<script src="https://cdn.jsdelivr.net/npm/vditor/dist/index.min.js" defer></script>
```

### Demo code

* [Demo](https://vditor.b3log.org/demo/index.html)
* [CommonJS Editor](https://github.com/Vanessa219/vditor/blob/master/demo/index.js)
* [CommonJS Render](https://github.com/Vanessa219/vditor/blob/master/demo/render.js)

### Themes

* Support two sets of black and white themes: classic/dark
* Use the scss/css developed by yourself to fully customize the style after referring to the existing style
* Theme colors can be customized by modifying variables in [index.scss](https://github.com/Vanessa219/vditor/blob/master/src/assets/scss/index.scss)
* Adding `class="vditor-reset"` (classic theme) or `class="vditor-reset vditor-reset--dark"` (black theme) attribute on the content display element can display the content more friendly

### API

#### id

Can be filled with element `id` or element itself` HTMLElement`

⚠️: When filling in the element's `HTMLElement`, you need to set `options.cache.id` or set `options.cache.enable` to `false`

#### options

|   | Explanation | Default |
| - | - | - |
| after | Callback method after editor asynchronous rendering is completed | - |
| height | Total editor height | 'auto' |
| minHeight | Editing area minimum height | - |
| width | Total editor width, supports % | 'auto' |
| placeholder | Tips when the input area is empty | '' |
| lang | i18n: en_US, ko_KR, zh_CN | 'zh_CN' |
| input | Trigger after input (value: string, previewElement?: HTMLElement): void | - |
| focus | Trigger after focusing (value: string): void | - |
| blur | Trigger after out of focus (value: string): void | - |
| esc | Trigger after pressing <kbd>esc</kbd> (value: string): void | - |
| ctrlEnter | Trigger after pressing <kbd>⌘/ctrl+enter</kbd> (value: string): void | - |
| select | Triggered after selecting text in the editor (value: string): void | - |
| tab | <kbd>tab</kbd> key operation string, support `\ t` and any string | - |
| typewriterMode | Whether to enable typewriter mode | false |
| cdn | Configure self-built CDN address | `https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}` |
| mode | Editing mode: sv, ir, wysiwyg | 'wysiwyg' |
| debugger | Whether to display the log | false |
| value | Editor initialization value | '' |
| theme | Theme: classic, dark | 'classic' |
| outline | show outline | false |

#### options.toolbar

* Toolbar, you can use name for shorthand: `toolbar: ['emoji', 'br', 'bold', '|', 'line']`. See default [src/ts/util/Options.ts](https://github.com/Vanessa219/vditor/blob/master/src/ts/util/Options.ts)
* name can be enumerated as: `emoji` , `headings` , `bold` , `italic` , `strike` , `|` , `line` , `quote` , `list` , `ordered-list` , `check` ,`outdent` ,`indent` , `code` , `inline-code`, `insert-after`, `insert-before`, `code-theme`, `content-theme`, `export`, `undo` , `redo` , `upload` , `link` , `table` , `record` , `edit-mode` , `both` , `preview` , `format` , `fullscreen` , `outline` , `devtools` , `info` , `help` , `br`
* When `name` is not in the enumeration, you can add a custom button in the following format: 

```js
{  
 hotkey: '⌘-⇧-f',  
 name: 'format',  
 tipPosition: 'ne',  
 tip: 'format',  
 className: '',
 icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="768" height="768" viewBox="0 0 768 768"><path d="M342 426v-84h426v84h-426zM342 256v-86h426v86h-426zM0 0h768v86h-768v-86zM342 598v-86h426v86h-426zM0 214l170 170-170 170v-340zM0 768v-86h768v86h-768z"></path></svg>',  
 click: () => {  
   alert('custom toolbar')  
 },  
}
```

|   | Explanation | Default |
| - | - | - |
| name | Unique label | - |
| icon | svg icon | - |
| tip | Prompt | - |
| tipPosition | Prompt location: ne, nw | - |
| hotkey | Shortcut keys, support <kbd>⌘/ctrl-key</kbd> or <kbd>⌘/ctrl-⇧/shift-key</kbd> format configuration, do not support wysiwyg mode | - |
| suffix | Insert the suffix in the editor | - |
| prefix | Insert the prefix in the editor | - |
| click | Custom event triggered when button is clicked (): void | - |
| className | Style name | '' |
| toolbar?: Array<options.toolbar> | sub menu | - |

#### options.toolbarConfig

|   | Explanation | Default |
| - | - | - |
| hide | Whether to hide the toolbar | false |
| pin | Whether to pin the toolbar | false |

#### options.counter

|   | Explanation | Default |
| - | - | - |
| enable | Whether to use counter | false |
| max | max counter | - |
| type | counter type: md, text | 'md' |

#### options.cache

|   | Explanation | Default |
| - | - | - |
| enable | Whether to use localStorage for caching | true |
| id | Cache key, the first parameter is an element and when caching is enabled **required** | - |
| after | cache callback (markdown: string): void | - |

#### options.preview

|   | Explanation | Default |
| - | - | - |
| delay | Preview debounce millisecond interval | 1000 |
| maxWidth | Preview area maximum width | 800 |
| mode | Display mode: both, editor | 'both' |
| url | md parsing request | - |
| parse | Preview callback (element: HTMLElement): void | - |
| transform | Callback before rendering (html: string): string | - |

#### options.preview.hljs

|   | Explanation | Default |
| - | - | - |
| enable | Whether to enable code syntax highlighting | true |
| style | For optional values, see [Chroma](https://xyproto.github.io/splash/docs/longer/all.html) | `github` |
| lineNumber | Whether to enable line number | false |

#### options.preview.markdown

|   | Explanation | Default |
| - | - | - |
| autoSpace | Autospace | false |
| fixTermTypo | Automatically correct terminology | false |
| chinesePunct | Automatic punctuation correction | false |
| toc | Insert Table of Contents | false |
| footnotes | Footnotes | true |
| codeBlockPreview |Whether to render code blocks in wysiwyg and ir modes | true |
| theme | Content Theme | 'light' |
| setext | Whether to parse the setext header | fa;se |
| paragraphBeginningSpace | Two spaces before the paragraph | false |
| sanitize | Use XSS | true |
| listStyle | add data-style attribute | false |
| linkBase | link prefix | '' |

#### options.preview.math

|   | Explanation | Default |
| - | - | - |
| inlineDigit | Whether numbers are allowed after the inline math formula starting with $ | false |
| macros | Macro definition passed in when rendering with MathJax | {} |
| engine | Math formula rendering engine: KaTeX, MathJax | 'KaTeX' |

#### options.hint

|   | Explanation | Default |
| - | - | - |
| delay | Tip debounce millisecond interval | 200 |
| emoji | The default emoji can be selected from [lute/emoji_map](https://github.com/88250/lute/blob/master/parse/emoji_map.go), or can be customized | { '+1': '👍', '-1': '👎', 'heart': '❤️', 'cold_sweat': '😰' } |
| emojiTail | Common emoji | - |
| emojiPath | Emoji path | `https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}/dist/images/emoji` |
| at | @user callback (value: string): Array\<any>, Need to return array synchronously [{value: '', html: ''}] | - |

#### options.upload

* The data structure of the file upload is as follows. When the data structure returned by the backend is inconsistent, you can use `format` for conversion.

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

* In order to prevent the off-site pictures from being invalid, `linkToImgUrl` can transfer the off-site picture addresses in the clipboard to the server for saving and processing. The data structure is as follows:

```js
// POST data  
xhr.send(JSON.stringify({url: src})); // src is the address of the image outside the station
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

|   | Explanation | Default |
| - | - | - |
| url | Upload url | '' |
| max | The largest upload file Byte | 10 * 1024 * 1024 |
| linkToImgUrl | When the clipboard contains the image address, use this url to re-upload | '' |
| success | Upload success callback (editor: HTMLPreElement, msg: string): void | - |
| error | Upload failure callback (msg: string): void | - |
| token | CORS upload verification, header is X-Upload-Token | - |
| withCredentials | Cross-site access control | false |
| headers | Request header settings | - |
| filename | Sanitizing file names (name: string): string \| name => name.replace(/\W/g, '') |
| accept | File upload type, same as [input accept](https://www.w3schools.com/tags/att_input_accept.asp) | - |
| validate | Check, return true if successful, otherwise return error message (files: File[]) => string \| boolean | - |
| handler | Custom upload, return error message when an error occurs (files: File[]) => string \| null | - |
| format | Transform the data returned by the server to meet the built-in data structure (files: File[], responseText: string): string | - |
| file | Process the uploaded file before returning (files: File[]): File[] | - |
| setHeaders | Use the return value to set the header before uploading (): { [key: string]: string } | - |
| extraData | Append data to FormData { [key: string]: string | Blob } | - |

#### options.resize

|   | Explanation | Default |
| - | - | - |
| enable | Whether to support size drag | false |
| position | Drag column position:top, bottom | 'bottom' |
| after | Callback when dragging ends (height: number): void | - |

#### options.classes

|   | Explanation | Default |
| - | - | - |
| preview | Preview on the element className | '' |

#### options.keymap

|   | Explanation | Default |
| - | - | - |
| deleteLine | Delete the cursor line or selected line | '⌘-Backspace' |
| duplicate | Copy current line or selected content | '⌘-D' |

#### methods

|   | Explanation |
| - | - |
| getValue() | Get editor content |
| getHTML() | Get preview area content |
| insertValue(value: string, render = true) | Insert content at the focus and markdown rendering by default |
| focus() | Focus on the editor |
| blur() | Make the editor out of focus |
| disabled() | Disable editor |
| enable() | Unedit editor |
| setSelection(start: number, end: number) | Select the string from start to end and does not support wysiwyg mode |
| getSelection(): string | Returns the selected string |
| setValue(markdown: string, clearStack = false) | Set editor content |
| clearStack() | remove undo and redo stack |
| renderPreview(value?: string) | Set preview area content |
| getCursorPosition():{top: number, left: number} | Get focus position |
| deleteValue() | Delete selected content |
| updateValue(value: string) | Update selected content |
| isUploading() | Whether the upload is still in progress |
| clearCache() | clear cache |
| disabledCache() | Disable cache |
| enableCache() | Enable caching |
| html2md(value: string) | HTML to md |
| tip(text: string, time: number) | notification. time is 0 will always display |
| setPreviewMode(mode: "both" \| "editor") | Set preview mode |
| setTheme(theme: "dark" \| "classic", contentTheme?: string, codeTheme?: string) | Set theme |
| getCurrentMode(): string | Get the editor's current editing mode |

#### static methods

* When no editing operation is required, just introduce [`method.min.js`](https://cdn.jsdelivr.net/npm/vditor/dist/) and directly call

```js
Vditor.mermaidRender(document)
```

```js
import VditorPreview from 'vditor/dist/method.min'  
VditorPreview.mermaidRender(document)
```

* When you need to render Markdown on the page, you can directly call the `preview` method with the following parameters:

```ts
previewElement: HTMLDivElement,   // Use this element for rendering
markdown: string,  // The original markdown to be rendered
options?: IPreviewOptions {  
 anchor?: number;  // 0: no render, 1: render left, 2: render right
 customEmoji?: { [key: string]: string };    // Custom emoji, default is {}
 lang?: (keyof II18nLang);    // Language, default is 'zh_CN'  
 emojiPath?: string;    // Emoji picture path 
 hljs?: IHljs; // Refer to options.preview.hljs 
 speech?: {  // Read the selected content
  enable?: boolean,
 };
 math?: IMath; // Math formula rendering configuration
 transform?(html: string): string; // Callback method before rendering
 after?(): void; // Callback method after rendering
 cdn?: string; // Self-built CDN address
 lazyLoadImage?: string; // use "https://cdn.jsdelivr.net/npm/vditor/dist/images/img-loading.svg" to lazy load image
 markdown?: options.preview.markdown;
 renderers?: ILuteRender; // Custom rendering method https://hacpai.com/article/1588412297062
}
```

* ⚠️`method.min.js` and` index.min.js` cannot be introduced at the same time

|   | Explanation |
| - | - |
| mermaidRender(element: HTMLElement, className = ".language-mermaid", cdn = options.cdn) | Convert elements in class to className in element to flowchart/sequence diagram/gantt diagram |
| codeRender(element: HTMLElement, lang: (keyof II18nLang) = "zh_CN") | Add a copy button for the code block in element |
| chartRender(element: (HTMLElement\| Document) = document, cdn = options.cdn) | Chart rendering |
| abcRender(element: (HTMLElement\| Document) = document, cdn = options.cdn) | Stave rendering |
| outlineRender(contentElement: HTMLElement, targetElement: Element, vditor?: IVditor) | Outline rendering |
| md2html(mdText: string, options?: IPreviewOptions): Promise\<string> | Markdown text is converted to HTML, this method needs to use [asynchronous programming](https://hacpai.com/article/1546828434083?r=Vanessa#toc_h3_1) |
| preview(previewElement: HTMLDivElement, markdown: string, options?: IPreviewOptions) | Page Markdown article rendering |
| highlightRender(hljsOption?: IHljs, element?: HTMLElement \| Document, cdn = options.cdn) | Highlight the code block in element |
| mediaRender(element: HTMLElement) | Rendering as [specific link](https://hacpai.com/article/1589813914768) as video, audio, embedded iframe |
| mathRender(element: HTMLElement, options?: {cdn?: string, math?: IMath}) | Render math formulas |
| speechRender(element: HTMLElement, lang?: (keyof II18nLang)) | Read the selected text |
| graphvizRender(element: HTMLElement, cdn?: string) | Render graphviz |
| lazyLoadImageRender(element: (HTMLElement \| Document) = document) | Render lazy load image |
| setCodeTheme (codeTheme: string, cdn = options.cdn)  | update code theme |
| setContentTheme (contentTheme: string, cdn = options.cdn)  | update content theme |
| mindmapRender (element: (HTMLElement \| Document) = document, cdn = options.cdn)  | Render mind map |

## 🏗 Developer Guide

### Principle related

* [Discussion on WYSIWYG Markdown Editor](https://hacpai.com/article/1579414663700)
* [Vditor implements Markdown WYSIWYG](https://hacpai.com/article/1577370404903)
* [Lute is a Markdown engine optimized for Chinese context, supports Go and JavaScript](https://hacpai.com/article/1567047822949)

### Environment

1. Install [node](https://nodejs.org/) LTS version
2. [Download](https://github.com/Vanessa219/vditor/archive/master.zip) latest code and unzip
3. Run `npm install` in the root directory
4. `npm run start` Start the local server, open http: // localhost: 9000
5. Modify the code
6. `npm run build` package code to dist directory

### CDN switch

Due to the on-demand loading mechanism, the default CDN is [https://cdn.jsdelivr.net/npm/vditor](https://cdn.jsdelivr.net/npm/vditor)@version number

If the code is modified or you need to use a self-built CDN, you can follow the steps below:

* The initial `options` and` IPreviewOptions` need to add `cdn` configuration
* `highlightRender`,` mathRender`, `abcRender`,` chartRender`, `mermaidRender` methods need to add cdn parameter
* Copy the dist directory in the successful build or [jsDelivr](https://www.jsdelivr.com/package/npm/vditor?path=dist) to the correct location

### Upgrade

Please read [CHANGELOG](https://github.com/Vanessa219/vditor/blob/master/CHANGELOG.md) carefully when upgrading the version.

## Ⓜ️ Markdown User Guide

* [Basic syntax](https://hacpai.com/article/1583129520165)
* [Extended syntax](https://hacpai.com/article/1583305480675)
* [Quick Reference Manual](https://hacpai.com/article/1583308420519)

## 🏘️ Community

* [Forum](https://hacpai.com/tag/vditor)
* [Issues](https://github.com/Vanessa219/vditor/issues/new)

## 📄 License

Vditor uses the [MIT](https://opensource.org/licenses/MIT) open source license.

## 🙏 Acknowledgement

* [Lute](https://github.com/88250/lute): A structured Markdown engine that supports Go and JavaScript
* [highlight.js](https://github.com/highlightjs/highlight.js): JavaScript syntax highlighter
* [mermaid](https://github.com/knsv/mermaid): Generation of diagram and flowchart from text in a similar manner as Markdown
* [incubator-echarts](https://github.com/apache/incubator-echarts): A powerful, interactive charting and visualization library for browser
* [abcjs](https://github.com/paulrosen/abcjs): JavaScript library for rendering standard music notation in a browser
* [IntelliJ IDEA](https://www.jetbrains.com/?from=Vditor): Family of capable and ergonomic development environments
