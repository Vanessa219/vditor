<p align="center">
<img alt="Vditor" src="https://b3log.org/images/brand/vditor-128.png" />

<br>
Easy-to-use Markdown editor, born to adapt to different application scenarios
<br><br>
<a title="MIT" target="_blank" href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-orange.svg?style=flat-square"></a>
<a title="npm bundle size" target="_blank" href="https://www.npmjs.com/package/vditor"><img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/vditor?style=flat-square&color=blueviolet"></a>
<a title="Version" target="_blank" href="https://www.npmjs.com/package/vditor"><img src="https://img.shields.io/npm/v/vditor.svg?style=flat-square"></a><br>
<a title="Downloads" target="_blank" href="https://www.npmjs.com/package/vditor"><img src="https://img.shields.io/npm/dt/vditor.svg?style=flat-square&color=97ca00"></a>
<a title="jsdelivr" target="_blank" href="https://www.jsdelivr.com/package/npm/vditor"><img src="https://data.jsdelivr.com/v1/package/npm/vditor/badge"/></a>
<a title="Hits" target="_blank" href="https://github.com/88250/hits"><img src="https://hits.b3log.org/Vanessa219/vditor.svg"></a> <br><br>
<a title="GitHub Watchers" target="_blank" href="https://github.com/Vanessa219/vditor/watchers"><img src="https://img.shields.io/github/watchers/Vanessa219/vditor.svg?label=Watchers&style=social"></a>
<a title="GitHub Stars" target="_blank" href="https://github.com/Vanessa219/vditor/stargazers"><img src="https://img.shields.io/github/stars/Vanessa219/vditor.svg?label=Stars&style=social"></a>
<a title="GitHub Forks" target="_blank" href="https://github.com/Vanessa219/vditor/network/members"><img src="https://img.shields.io/github/forks/Vanessa219/vditor.svg?label=Forks&style=social"></a>
<a title="Author GitHub Followers" target="_blank" href="https://github.com/vanessa219"><img src="https://img.shields.io/github/followers/vanessa219.svg?label=Followers&style=social"></a>
</p>

<p align="center">
<a href="https://github.com/Vanessa219/vditor/blob/master/README.md">中文</a> &nbsp;|&nbsp; <a href="https://b3log.org/vditor/demo/index.html">Demo</a>
</p>

## 💡 Introduction

[Vditor](https://b3log.org/vditor) is a browser-side Markdown editor, Support WYSIWYG, instant rendering (similar to Typora) and split-screen preview mode. It is implemented using TypeScript and supports native JavaScript and frameworks such as Vue, React, Angular, and Svelte..

Welcome to [Vditor Official Site](https://b3log.org/vditor) to learn more.

## 🗺️ Background

With the popularization of Markdown typesetting methods, more and more applications begin to integrate the Markdown editor. The current status of mainstream integrable Markdown editors is as follows:

* Some only support split-screen preview, that is, the editing area and preview area are separated
* Some support WYSIWYG and split-screen previews at the same time, but they cannot fully support Markdown syntax typesetting in WYSIWYG mode
* There is almost no instant rendering similar to Typora

These three points correspond to three application scenarios:

* Split screen preview: adapt to the traditional Markdown usage scene, suitable for editing and typesetting on a large screen
* WYSIWYG: Friendly to users who are not familiar with Markdown, users who are familiar with Markdown can also use it seamlessly
* Instant rendering: In theory, this is the most elegant Markdown editing method, allowing users familiar with Markdown to focus more on content creation

Therefore, a Markdown editor that can **adapt to application scenarios** is essential, it needs to consider:

* Use scenes of traditional Markdown users, providing split screen preview
* Rich text editing users' usage scenarios, providing WYSIWYG
* High-end Markdown users' use scenes, providing instant rendering

Vditor has made efforts in these areas, hoping to make some contributions to the modern general Markdown editing field.

## ✨  Features

* Support three editing modes: WYSIWYG(wysiwyg), Instant Rendering(ir) and Split View(sv)
* Support outline, mathematical formulas, mind maps, charts, flowcharts, Gantt charts, timing charts, staffs, [multimedia](https://ld246.com/article/1589813914768), voice reading, heading anchors, code highlighting and copying, graphviz rendering
* Export, image lazy loading, task list, multi-platform preview, multi-theme switching, copy to WeChat/zhihu function
* Implementation of CommonMark and GFM specifications, formatting and syntax tree viewing of Markdown, and support for [10+ configurations](https://ld246.com/article/1549638745630#options-preview-markdown)
* The toolbar contains 36+ items of operations. In addition to support for expansion, the [shortcut keys](https://ld246.com/article/1582778815353), tip, tip positions, icons, click events, class names, and sub-toolbars can be customized
* Extend auto-complete for emoji/@/# and so on
* You can use drag and drop, paste and paste to upload, display real-time upload progress, support CORS cross-domain upload
* Save content in real time to prevent accidental loss
* Recording support, users can directly publish voice
* The markup HTML is automatically converted to Markdown, if the paste contains images of external links, it can be uploaded to the server through the specified interface
* Support main window size drag and drop, character counting
* Multi-theme support, built-in black, white and green three sets of themes
* Multi-language support, built-in Chinese, English, Korean text localization
* Support mainstream browsers, mobile friendly

![editor.png](https://b3logfile.com/file/2020/07/editor-b304aa97.png)

![preview.png](https://b3logfile.com/file/2020/05/preview-80846f66.png)

## 🔮 Editing Modes

### WYSIWYG

*WYSIWYG* mode is more friendly to users who are not familiar with Markdown, and you can use it seamlessly if you are familiar with Markdown.

![vditor-wysiwyg](https://b3logfile.com/file/2020/07/wysiwyg-4f216b9b.gif)

### Instant Rendering

*Instant Rendering* mode should not be unfamiliar to users who are familiar with Typora. In theory, this is the most elegant Markdown editing method.

![vditor-ir](https://b3logfile.com/file/2020/07/ir-67cd956c.gif)

### Split View

The traditional *Split View* mode is suitable for Markdown editing on a large screen.

![vditor-sv](https://b3logfile.com/file/2020/07/sv-595dcb28.gif)

## 🍱 Syntax support

* All CommonMark syntax: Thematic breaks, ATX headings, Setext headings, Indented code blocks, Fenced code blocks, HTML blocks, Link reference definitions, Paragraphs, Block quotes, Lists, Backslash escapes, Entity and numeric character references, Code spans, Emphasis and strong emphasis, Links, Images, Raw HTML, Hard line breaks, Soft line breaks, and Textual content.
* All GFM syntax: Tables, Task list items, Strikethrough, Autolinks, XSS filtering
* Common Markdown extended syntax: Footnotes, ToC, Custom Heading ID
* Chart syntax
  * Flow chart, sequence diagram, Gantt chart, supported by Mermaid
  * Graphviz
  * Line chart, pie chart, brain chart, etc., supported by ECharts
* Stave: supported by abc.js
* Math formulas: Math formula blocks, row-level math formulas, supported by MathJax and KaTeX
* YAML Front Matter
* Chinese context optimization
  * Insert space between Chinese and Western
  * Terminology spelling correction
  * Chinese followed by English comma period and other punctuation are replaced with Chinese corresponding punctuation

Most of the above features can be enabled or disabled through the switch configuration, developers can choose to match according to their own application scenarios.

## 🗃 Showcases

* [Sym](https://github.com/88250/symphony) A modern community (forum/BBS/SNS/blog) platform implemented in Java
* [Solo](https://github.com/88250/solo) & [Pipe](https://github.com/88250/pipe) B3log distributed community blog end node, welcome to join the next generation community network
* [Arya](https://github.com/nicejade/markdown-online-editor) Based on Vue, Vditor, built online Markdown editor
* [More cases](https://github.com/Vanessa219/vditor/network/dependents?package_id=UGFja2FnZS0zMTY2Mzg4MzE%3D)

## 🛠️ User Guide

### CommonJS

* Install dependencies

```shell
npm install vditor --save
```

* Introduce and initialize objects in the code, you can refer to [index.js](https://github.com/Vanessa219/vditor/blob/master/demo/index.js)

```ts
import Vditor from 'vditor'
import "~vditor/src/assets/less/index" // Or use dark

const vditor = new Vditor(id, {options...})
```

### HTML script

* Insert CSS and js in HTML, you can refer to [demo](https://b3log.org/vditor/demo/index.html)

```html
<!-- ⚠️Please specify the version number in the production environment, such as https://unpkg.com/vditor@x.x.x/dist... -->
<link rel="stylesheet" href="https://unpkg.com/vditor/dist/index.css" />
<script src="https://unpkg.com/vditor/dist/index.min.js"></script>
```

### Demo code

* [Demo](https://b3log.org/vditor/demo/index.html)
* [CommonJS Editor](https://github.com/Vanessa219/vditor/blob/master/demo/index.js)
* [CommonJS Render](https://github.com/Vanessa219/vditor/blob/master/demo/render.js)
* [Use in Svelte](https://github.com/HerbertHe/svelte-vditor-demo)

### Themes

* Support four sets of black and white themes: and-design, classic, dark, wechat
* Use the less/css developed by yourself to fully customize the style after referring to the existing style
* Theme colors can be customized by modifying variables in [index.less](https://github.com/Vanessa219/vditor/blob/master/src/assets/less/index.less)
* Adding `class="vditor-reset"` (classic theme) or `class="vditor-reset vditor-reset--dark"` (black theme) attribute on the content display element can display the content more friendly

### API

#### id

Can be filled with element `id` or element itself` HTMLElement`

⚠️: When filling in the element's `HTMLElement`, you need to set `options.cache.id` or set `options.cache.enable` to `false`

#### options

|   | Explanation | Default |
| - | - | - |
| i18n | I18n, more details see ITips | - |
| undoDelay | Undo interval | - |
| after | Callback method after editor asynchronous rendering is completed | - |
| height | Total editor height | 'auto' |
| minHeight | Editing area minimum height | - |
| width | Total editor width, supports % | 'auto' |
| placeholder | Tips when the input area is empty | '' |
| lang | I18n type: en_US, fr_FR, pt_BR, ja_JP, ko_KR, ru_RU, sv_SE, zh_CN, zh_TW | 'zh_CN' |
| input | Trigger after input (value: string) | - |
| focus | Trigger after focusing (value: string) | - |
| blur | Trigger after out of focus (value: string) | - |
| keydown(event: KeyboardEvent) | Trigger after keydown | - |
| esc | Trigger after pressing <kbd>esc</kbd> (value: string) | - |
| ctrlEnter | Trigger after pressing <kbd>⌘/ctrl+enter</kbd> (value: string) | - |
| select | Triggered after selecting text in the editor (value: string) | - |
| tab | <kbd>tab</kbd> key operation string, support `\ t` and any string | - |
| typewriterMode | Whether to enable typewriter mode | false |
| cdn | Configure self-built CDN address | `https://unpkg.com/vditor@${VDITOR_VERSION}` |
| mode | Editing mode: sv, ir, wysiwyg | 'ir' |
| debugger | Whether to display the log | false |
| value | Editor initialization value | '' |
| theme | Theme: classic, dark | 'classic' |
| icon | icon theme: ant, material | 'ant' |
| customRenders: {language: string, render: (element: HTMLElement, vditor: IVditor) => void}[] | Custom render | [] |

#### options.toolbar

* Toolbar, you can use name for shorthand: `toolbar: ['emoji', 'br', 'bold', '|', 'line']`. See default [src/ts/util/Options.ts](https://github.com/Vanessa219/vditor/blob/master/src/ts/util/Options.ts)
* name can be enumerated as: `emoji` , `headings` , `bold` , `italic` , `strike` , `|` , `line` , `quote` , `list` , `ordered-list` , `check` ,`outdent` ,`indent` , `code` , `inline-code`, `insert-after`, `insert-before`, `code-theme`, `content-theme`, `export`, `undo` , `redo` , `upload` , `link` , `table` , `record` , `edit-mode` , `both` , `preview` , `fullscreen` , `outline` , `devtools` , `info` , `help` , `br`
* When `name` is not in the enumeration, you can add a custom button in the following format:

```js
new Vditor('vditor', {
  toolbar: [
    {
      hotkey: '⇧⌘S',
      name: 'sponsor',
      tipPosition: 's',
      tip: '成为赞助者',
      className: 'right',
      icon: '<svg t="1589994565028" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2808" width="32" height="32"><path d="M506.6 423.6m-29.8 0a29.8 29.8 0 1 0 59.6 0 29.8 29.8 0 1 0-59.6 0Z" fill="#0F0F0F" p-id="2809"></path><path d="M717.8 114.5c-83.5 0-158.4 65.4-211.2 122-52.7-56.6-127.7-122-211.2-122-159.5 0-273.9 129.3-273.9 288.9C21.5 562.9 429.3 913 506.6 913s485.1-350.1 485.1-509.7c0.1-159.5-114.4-288.8-273.9-288.8z" fill="#FAFCFB" p-id="2810"></path><path d="M506.6 926c-22 0-61-20.1-116-59.6-51.5-37-109.9-86.4-164.6-139-65.4-63-217.5-220.6-217.5-324 0-81.4 28.6-157.1 80.6-213.1 53.2-57.2 126.4-88.8 206.3-88.8 40 0 81.8 14.1 124.2 41.9 28.1 18.4 56.6 42.8 86.9 74.2 30.3-31.5 58.9-55.8 86.9-74.2 42.5-27.8 84.3-41.9 124.2-41.9 79.9 0 153.2 31.5 206.3 88.8 52 56 80.6 131.7 80.6 213.1 0 103.4-152.1 261-217.5 324-54.6 52.6-113.1 102-164.6 139-54.8 39.5-93.8 59.6-115.8 59.6zM295.4 127.5c-72.6 0-139.1 28.6-187.3 80.4-47.5 51.2-73.7 120.6-73.7 195.4 0 64.8 78.3 178.9 209.6 305.3 53.8 51.8 111.2 100.3 161.7 136.6 56.1 40.4 88.9 54.8 100.9 54.8s44.7-14.4 100.9-54.8c50.5-36.3 108-84.9 161.7-136.6 131.2-126.4 209.6-240.5 209.6-305.3 0-74.9-26.2-144.2-73.7-195.4-48.2-51.9-114.7-80.4-187.3-80.4-61.8 0-127.8 38.5-201.7 117.9-2.5 2.6-5.9 4.1-9.5 4.1s-7.1-1.5-9.5-4.1C423.2 166 357.2 127.5 295.4 127.5z" fill="#141414" p-id="2811"></path><path d="M353.9 415.6m-33.8 0a33.8 33.8 0 1 0 67.6 0 33.8 33.8 0 1 0-67.6 0Z" fill="#0F0F0F" p-id="2812"></path><path d="M659.3 415.6m-33.8 0a33.8 33.8 0 1 0 67.6 0 33.8 33.8 0 1 0-67.6 0Z" fill="#0F0F0F" p-id="2813"></path><path d="M411.6 538.5c0 52.3 42.8 95 95 95 52.3 0 95-42.8 95-95v-31.7h-190v31.7z" fill="#5B5143" p-id="2814"></path><path d="M506.6 646.5c-59.6 0-108-48.5-108-108v-31.7c0-7.2 5.8-13 13-13h190.1c7.2 0 13 5.8 13 13v31.7c0 59.5-48.5 108-108.1 108z m-82-126.7v18.7c0 45.2 36.8 82 82 82s82-36.8 82-82v-18.7h-164z" fill="#141414" p-id="2815"></path><path d="M450.4 578.9a54.7 27.5 0 1 0 109.4 0 54.7 27.5 0 1 0-109.4 0Z" fill="#EA64F9" p-id="2816"></path><path d="M256 502.7a32.1 27.5 0 1 0 64.2 0 32.1 27.5 0 1 0-64.2 0Z" fill="#EFAFF9" p-id="2817"></path><path d="M703.3 502.7a32.1 27.5 0 1 0 64.2 0 32.1 27.5 0 1 0-64.2 0Z" fill="#EFAFF9" p-id="2818"></path></svg>',
      click () {alert('捐赠地址：https://ld246.com/sponsor')},
    }],
})
```

|   | Explanation | Default |
| - | - | - |
| name | Unique label | - |
| icon | svg icon | - |
| tip | Prompt | - |
| tipPosition | Prompt location: 'n', 'ne', 'nw', 's', 'se', 'sw', 'w', 'e' | - |
| hotkey | Shortcut keys, support 为<kbd>⇧⌘</kbd>/<kbd>⌘</kbd>/<kbd>⌥⌘</kbd> format configuration | - |
| suffix | Insert the suffix in the editor | - |
| prefix | Insert the prefix in the editor | - |
| click(event: Event, vditor: IVditor) | Custom event triggered when button is clicked | - |
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
| after(length: number, counter: options.counter): void | After count callback | - |
| max | max counter | - |
| type | counter type: 'markdown', 'text' | 'markdown' |

#### options.cache

|   | Explanation | Default |
| - | - | - |
| enable | Whether to use localStorage for caching | true |
| id | Cache key, the first parameter is an element and when caching is enabled **required** | - |
| after | cache callback (markdown: string) | - |

#### options.comment

⚠️: Only supports wysiwyg mode

|   | Explanation | Default |
| - | - | - |
| enable | Whether to enable comment mode | false |
| add(id: string, text: string, commentsData: ICommentsData[]) | Add comment callback | - |
| remove(ids: string[]) | delete comment callback | - |
| scroll(top: number) | Scroll callback | - |
| adjustTop(commentsData: ICommentsData[]) | Adapt the comment height | - |

#### options.preview

|   | Explanation | Default |
| - | - | - |
| delay | Preview debounce millisecond interval | 1000 |
| maxWidth | Preview area maximum width | 800 |
| mode | Display mode: both, editor | 'both' |
| url | md parsing request | - |
| parse | Preview callback (element: HTMLElement) | - |
| transform | Callback before rendering (html: string): string | - |

#### options.preview.theme

|   | Explanation | Default |
| - | - | - |
| current | current Markdown Theme | "light" |
| list | Choose Markdown Theme List | { "ant-design": "Ant Design", dark: "Dark", light: "Light", wechat: "WeChat" } |
| path | CSS Path | `https://unpkg.com/vditor@${VDITOR_VERSION}/dist/css/content-theme` |

#### options.preview.hljs

|   | Explanation | Default |
| - | - | - |
| defaultLang | The language is used by default when no language is specified | '' |
| enable | Whether to enable code syntax highlighting | true |
| style | For optional values, see [Chroma](https://xyproto.github.io/splash/docs/longer/all.html) | `github` |
| lineNumber | Whether to enable line number | false |
| langs | Custom languages | [CODE_LANGUAGES](https://github.com/Vanessa219/vditor/blob/53ca8f9a0e511b37b5dae7c6b15eb933e9e02ccd/src/ts/constants.ts#L20) |

#### options.preview.markdown

|   | Explanation | Default |
| - | - | - |
| autoSpace | Autospace | false |
| gfmAutoLink | Automatic link | true |
| fixTermTypo | Automatically correct terminology | false |
| toc | Insert Table of Contents | false |
| footnotes | Footnotes | true |
| codeBlockPreview | Whether to render code blocks in wysiwyg and ir modes | true |
| mathBlockPreview | Whether to render math blocks in wysiwyg and ir modes | true |
| paragraphBeginningSpace | Two spaces before the paragraph | false |
| sanitize | Use XSS | true |
| listStyle | add data-style attribute | false |
| linkBase | link relative path prefix | '' |
| linkPrefix | link prefix | '' |
| mark | enable mark tag | false |

#### options.preview.math

|   | Explanation | Default |
| - | - | - |
| inlineDigit | Whether numbers are allowed after the inline math formula starting with $ | false |
| macros | Macro definition passed in when rendering with MathJax | {} |
| engine | Math formula rendering engine: KaTeX, MathJax | 'KaTeX' |
| mathJaxOptions | Parameters when the math formula rendering engine is MathJax | - |

#### options.preview.actions

Default: ["desktop", "tablet", "mobile", "mp-wechat", "zhihu"]

|   | Explanation | Default |
| - | - | - |
| key | Custom action ID, not Empty. | - |
| tooltip | Tooltip | - |
| text | Button Text | - |
| className | Button Class | - |
| click(key: string) | Click Event | - |

#### options.image

|   | Explanation | Default |
| - | - | - |
| isPreview | Whether to preview the picture | true |
| preview(bom: Element) => void | Image preview processing | - |

#### options.link

|   | Explanation | Default |
| - | - | - |
| isOpen | Whether to open the link address | true |
| click(bom: Element) => void | Click link event | - |

#### options.hint

|   | Explanation | Default |
| - | - | - |
| parse | Whether to perform md parsing | true |
| delay | Tip debounce millisecond interval | 200 |
| emoji | The default emoji can be selected from [lute/emoji_map](https://github.com/88250/lute/blob/master/parse/emoji_map.go), or can be customized | { '+1': '👍', '-1': '👎', 'heart': '❤️', 'cold_sweat': '😰' } |
| emojiTail | Common emoji | - |
| emojiPath | Emoji path | `https://unpkg.com/vditor@${VDITOR_VERSION}/dist/images/emoji` |
| extend: IHintExtend[] | @/# and other keyword auto-completion expansion | [] |

```ts
interface IHintData {
  html: string;
  value: string;
}

interface IHintExtend {
  key: string;

  hint?(value: string): IHintData[] | Promise<IHintData[]>;
}
```

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
| url | Upload url, empty will not trigger upload related events | '' |
| max | The largest upload file Byte | 10 * 1024 * 1024 |
| linkToImgUrl | When the clipboard contains the image address, use this url to re-upload | '' |
| linkToImgCallback | Callback when uploading picture address | - |
| linkToImgFormat | Transform the data returned by the server to meet the built-in data structure (responseText: string): string | - |
| success | Upload success callback (editor: HTMLPreElement, msg: string) | - |
| error | Upload failure callback (msg: string) | - |
| token | CORS upload verification, header is X-Upload-Token | - |
| withCredentials | Cross-site access control | false |
| headers | Request header settings | - |
| filename | Sanitizing file names (name: string): string \| name => name.replace(/\W/g, '') |
| accept | File upload type, same as [input accept](https://www.w3schools.com/tags/att_input_accept.asp) | - |
| validate | Check, return true if successful, otherwise return error message (files: File[]) => string \| boolean | - |
| handler(files: File[]) => string \| null \| Promise<string> \| Promise<null> | Custom upload, return error message when an error occurs | - |
| format | Transform the data returned by the server to meet the built-in data structure (files: File[], responseText: string): string | - |
| file(files: File[]): File[] \| Promise<File[]> | Process the uploaded file before return. | - |
| setHeaders | Use the return value to set the header before uploading (): { [key: string]: string } | - |
| extraData | Append data to FormData { [key: string]: string | Blob } | - |
| multiple | Allow multiple file uploads | true |
| fieldName | The key of field name | file[] |

#### options.resize

|   | Explanation | Default |
| - | - | - |
| enable | Whether to support size drag | false |
| position | Drag column position: 'top', 'bottom' | 'bottom' |
| after | Callback when dragging ends (height: number) | - |

#### options.classes

|   | Explanation | Default |
| - | - | - |
| preview | Preview on the element className | '' |

#### options.fullscreen

|   | Explanation | Default |
| - | - | - |
| index | fullscreen index | 90 |

#### options.outline

|   | Explanation | Default |
| - | - | - |
| enable | Initialize whether to show outline | false |
| position | Outline location: 'left', 'right' | 'left' |

#### methods

|   | Explanation |
| - | - |
| exportJSON(markdown: string) | Get JSON by markdown |
| getValue() | Get editor content |
| getHTML() | Get preview area content |
| insertValue(value: string, render = true) | Insert content at the focus and markdown rendering by default |
| focus() | Focus on the editor |
| blur() | Make the editor out of focus |
| disabled() | Disable editor |
| enable() | Unedit editor |
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
| setTheme(theme: "dark" | "classic", contentTheme?: string, codeTheme?: string, contentThemePath?: string) | Set theme |
| getCurrentMode(): string | Get the editor's current editing mode |
| destroy() | Destroy the vditor |
| getCommentIds(): {id: string, top: number}[] | Get all comments |
| hlCommentIds(ids: string[]) | Highlight comment by Ids |
| unHlCommentIds(ids: string[]) | Cancel highlight comment by Ids |
| removeCommentIds(removeIds: string[]) | Remove comment by Ids |

#### static methods

* When no editing operation is required, just introduce [`method.min.js`](https://unpkg.com/vditor/dist/) and directly call

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
  mode: "dark" | "light";
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
  after?(); // Callback method after rendering
  cdn?: string; // Self-built CDN address
  lazyLoadImage?: string; // use "https://unpkg.com/vditor/dist/images/img-loading.svg" to lazy load image
  markdown?: options.preview.markdown;
  renderers?: ILuteRender; // Custom rendering method https://ld246.com/article/1588412297062
}
```

* ⚠️`method.min.js` and` index.min.js` cannot be introduced at the same time

|   | Explanation |
| - | - |
| previewImage(oldImgElement: HTMLImageElement, lang: keyof II18n = "zh_CN", theme = "classic") | Click on the image to preview |
| mermaidRender(element: HTMLElement, cdn = options.cdn, theme = options.theme) | flowchart/sequence diagram/gantt diagram rendering |
| flowchartRender(element: HTMLElement, cdn = options.cdn) | flowchart.js rendering |
| codeRender(element: HTMLElement) | Add a copy button for the code block in element |
| chartRender(element: (HTMLElement\| Document) = document, cdn = options.cdn, theme = options.theme) | Chart rendering |
| plantumlRender(element: (HTMLElement\| Document) = document, cdn = options.cdn) | plantuml rendering |
| abcRender(element: (HTMLElement\| Document) = document, cdn = options.cdn) | Stave rendering |
| outlineRender(contentElement: HTMLElement, targetElement: Element, vditor?: IVditor) | Outline rendering |
| md2html(mdText: string, options?: IPreviewOptions): Promise\<string> | Markdown text is converted to HTML, this method needs to use [asynchronous programming](https://ld246.com/article/1546828434083?r=Vanessa#toc_h3_1) |
| preview(previewElement: HTMLDivElement, markdown: string, options?: IPreviewOptions) | Page Markdown article rendering |
| highlightRender(hljsOption?: IHljs, element?: HTMLElement \| Document, cdn = options.cdn) | Highlight the code block in element |
| mediaRender(element: HTMLElement) | Rendering as [specific link](https://ld246.com/article/1589813914768) as video, audio, embedded iframe |
| mathRender(element: HTMLElement, options?: {cdn?: string, math?: IMath}) | Render math formulas |
| speechRender(element: HTMLElement, lang?: (keyof II18nLang)) | Read the selected text |
| graphvizRender(element: HTMLElement, cdn?: string) | Render graphviz |
| lazyLoadImageRender(element: (HTMLElement \| Document) = document) | Render lazy load image |
| setCodeTheme (codeTheme: string, cdn = options.cdn)  | update code theme |
| setContentTheme (contentTheme: string, path: string)  | update content theme |
| mindmapRender (element: (HTMLElement \| Document) = document, cdn = options.cdn, theme = options.theme)  | Render mind map |

## 🏗 Developer Guide

### Principle related

* [Discussion on WYSIWYG Markdown Editor](https://ld246.com/article/1579414663700)
* [Vditor implements Markdown WYSIWYG](https://ld246.com/article/1577370404903)
* [Lute is a Markdown engine optimized for Chinese context, supports Go and JavaScript](https://ld246.com/article/1567047822949)

### Environment

1. Install [node](https://nodejs.org/) LTS version
2. [Download](https://github.com/Vanessa219/vditor/archive/master.zip) latest code and unzip
3. Run `npm install` in the root directory
4. `npm run start` Start the local server, open http: // localhost: 9000
5. Modify the code
6. `npm run build` package code to dist directory

### CDN switch

Due to the on-demand loading mechanism, the default CDN is [https://unpkg.com/vditor](https://unpkg.com/vditor)@version number

If the code is modified or you need to use a self-built CDN, you can follow the steps below:

* The initial `options` and` IPreviewOptions` need to add `cdn` configuration
* `highlightRender`,` mathRender`, `abcRender`,` chartRender`, `mermaidRender` methods need to add cdn parameter
* Copy the dist directory in the successful build or [jsDelivr](https://www.jsdelivr.com/package/npm/vditor?path=dist) to the correct location

### Upgrade

Please read [CHANGELOG](https://github.com/Vanessa219/vditor/blob/master/CHANGELOG.md) carefully when upgrading the version.

## Ⓜ️ Markdown User Guide

* [Basic syntax](https://ld246.com/article/1583129520165)
* [Extended syntax](https://ld246.com/article/1583305480675)
* [Quick Reference Manual](https://ld246.com/article/1583308420519)

## 🏘️ Community

* [Forum](https://ld246.com/tag/vditor)
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

## 📽️ History

In the initial stage of developing [Sym](https://github.com/88250/symphony), we directly used WYSIWYG rich text editor. At that time, HTML-based editors were very popular, and it was very convenient to quote them in the project, which also conformed to the usage habits of users at that time.

Later, the rise of Markdown gradually changed everyone's typography. In addition, several of our other projects are for programmer users, so it is also a general trend to migrate to md. We chose [CodeMirror](https://github.com/codemirror/CodeMirror), which is an excellent editor, it provides a rich programming interface for developers, and is also compatible with various browsers. it is good.

Later, as the business needs of our projects have precipitated, using CodeMirror sometimes feels more "cumbersome." For example, to implement @automatically complete the user name list, insert Emoji, upload files, etc., it requires more in-depth secondary development, and these business requirements are precisely common and necessary in many project scenarios.

Finally, we decided to start implementing the editor ourselves in Sym. With the iterations of several versions, Sym's editor has matured. In the community [LianDi](https://ld246.com) that we operate, people have asked us if we can separate the editor for everyone to use. At the same time, our front-end main programmer [V](https://ld246.com/member/Vanessa) also felt a little bit overwhelmed with maintaining the editors scattered in various projects, plus a good impression of TypeScript, so I decided Use ts to implement a new browser-side md editor.

So, Vditor was born.
