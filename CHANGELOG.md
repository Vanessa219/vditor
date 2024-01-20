## Vditor change log

### 升级
* 3.9
  * 添加 options.preview.math.mathJaxOptions
  * 添加 hljs.langs
  * 添加 option.keydown
  * 添加 option.link 和 options.image
  * 添加 hljs.defaultLang

### TODO

* [open issues](https://github.com/Vanessa219/vditor/issues)

### v3.9.9 / 2024-01

* [wysiwyg 模式下通过输入框修改元素属性时触发 input ](https://github.com/Vanessa219/vditor/issues/1542) `改进功能`
* [自定义渲染器支持](https://github.com/Vanessa219/vditor/issues/1540) `引入特性`

### v3.9.8 / 2023-12-26

* [多语言加载失败后给出相关提示](https://github.com/Vanessa219/vditor/issues/1531) `改进功能`
* [导出 PDF 时 CDN 配置不生效](https://github.com/Vanessa219/vditor/pull/1529) `修复缺陷`
* [sv 模式中在脚注下方输入文本出现渲染错误](https://github.com/Vanessa219/vditor/issues/1518) `修复缺陷`
* [KaTeX 渲染支持 macros](https://github.com/Vanessa219/vditor/issues/1519) `引入特性`
* [简化 CDN 配置](https://github.com/Vanessa219/vditor/issues/1522) `改进功能`

### v3.9.7 / 2023-12-14

* [改进带端口的超链接解析](https://github.com/Vanessa219/vditor/issues/1513) `改进功能`
* [优化代码块复制功能的渲染性能](https://github.com/Vanessa219/vditor/pull/1502) `开发重构`
* [tipPosition 设置在取消全屏后失效](https://github.com/Vanessa219/vditor/issues/1491) `修复缺陷`

### v3.9.6 / 2023-09-26

* [预览页面渲染错误](https://github.com/Vanessa219/vditor/pull/1475/files) `修复缺陷`
* [markmap 生产环境路径错误](https://github.com/Vanessa219/vditor/issues/1467) `修复缺陷`
* [insertValue 后光标移动到插入的字符串之后](https://github.com/Vanessa219/vditor/issues/1464) `改进功能`
* [preview.actions 为空不渲染工具栏](https://github.com/Vanessa219/vditor/issues/1453) `改进功能`
* [MathJax 支持传入其他配置项](https://github.com/Vanessa219/vditor/issues/1453) `引入特性`

### v3.9.5 / 2023-08-29

* [换行+冒号会被识别为表格](https://github.com/Vanessa219/vditor/issues/1460) `修复缺陷`
* [自定义代码块语言](https://github.com/Vanessa219/vditor/issues/1459) `引入特性`
* [编辑器全票后双击图片无法放大](https://github.com/Vanessa219/vditor/issues/1437) `修复缺陷`
* [⬆️ Bump word-wrap from 1.2.3 to 1.2.4](https://github.com/Vanessa219/vditor/pull/1436) `dependencies`
* [IR 模式下输入 `<!--` 后报错](https://github.com/Vanessa219/vditor/issues/1431) `修复缺陷`
* [改进预览界面复制提示](https://github.com/Vanessa219/vditor/pull/1429) `改进功能`

### v3.9.4 / 2023-06-20

* [支持自动链接配置 `gfmAutoLink`](https://github.com/Vanessa219/vditor/issues/1422) `引入特性`
* [订正多语言繁体中的文案错误](https://github.com/Vanessa219/vditor/pull/1421) `文档相关`
* [修正多语言中英语的错误](https://github.com/Vanessa219/vditor/pull/1416) `文档相关`
* [IR, SV 模式下输入内容后立即点击工具栏下拉无反应](https://github.com/Vanessa219/vditor/issues/1414) `改进功能`
* [为 `button` 添加 `type` 属性](https://github.com/Vanessa219/vditor/pull/1410) `开发重构`
* [XSS 代码注入漏洞 - 表单](https://github.com/Vanessa219/vditor/issues/1412) `修复缺陷`
* [XSS 代码注入漏洞 - meta](https://github.com/Vanessa219/vditor/issues/1411) `修复缺陷`

### v3.9.3 / 2023-05-23

* [XSS 代码注入漏洞 - 链接](https://github.com/Vanessa219/vditor/issues/1401) `修复缺陷`
* [XSS 代码注入漏洞 - iframe](https://github.com/Vanessa219/vditor/issues/1400) `修复缺陷`
* [添加`keydown`回调](https://github.com/Vanessa219/vditor/issues/1397) `引入特性`
* [输入内容后立即点击工具栏下拉无反应](https://github.com/Vanessa219/vditor/issues/1391) `改进功能`
* [XSS 代码注入漏洞](https://github.com/Vanessa219/vditor/issues/1395) `修复缺陷`
* [支持葡萄牙语](https://github.com/Vanessa219/vditor/pull/1394) `引入特性`

### v3.9.2 / 2023-04-11

* [代码高亮不指定语言时使用 hljs.defaultLang 进行渲染](https://github.com/Vanessa219/vditor/issues/1382) `引入特性`
* [选中文本后粘贴网址自动生成链接](https://github.com/Vanessa219/vditor/issues/1301) `改进功能`
* [情景菜单输入框中 Esc/alt+Enter/Enter 可将光标设置到编辑器中](https://github.com/Vanessa219/vditor/issues/1302) `改进功能`
* [文本选中弹出组件 speech 位置被多屏影响](https://github.com/Vanessa219/vditor/issues/1373) `改进功能`
* [更新补充 JSDoc](https://github.com/Vanessa219/vditor/pull/1374) `文档相关`

### v3.9.1 / 2023-03-14

* [新增法语](https://github.com/Vanessa219/vditor/pull/1365) `引入特性`
* [新增瑞士语](https://github.com/Vanessa219/vditor/pull/1359) `引入特性`
* [代码块下一行的标题前输入中文时内容会跑到代码块里面](https://github.com/Vanessa219/vditor/issues/1356) `修复缺陷`
* [连续插入多个列表，控制台报错](https://github.com/Vanessa219/vditor/issues/1343) `修复缺陷`
* [IR 模式选择内容设置为代码块时异常](https://github.com/Vanessa219/vditor/issues/1354) `修复缺陷`

### v3.9.0 / 2023-01-15

* [1345](https://github.com/Vanessa219/vditor/issues/1345) 移除复制代码块末尾的换行 `改进功能`
* [1348](https://github.com/Vanessa219/vditor/pull/1348) 新增链接和图片处理接口 `引入特性`
* [1342](https://github.com/Vanessa219/vditor/pull/1342) 初始化后不自动聚焦 `改进功能`
* [1341](https://github.com/Vanessa219/vditor/pull/1341) 支持 markmap `引入特性`
* [1335](https://github.com/Vanessa219/vditor/issues/1335) 嵌入 Iframe 时无法导出 PDF `修复缺陷`

### 历史版本升级记录
* 3.8
  * 添加 plantumlRender 方法
  * options.input 移除 previewElement 参数
  * 添加表格增加向上插入行 ⇧⌘F 和向左插入列 ⇧⌘G 的快捷键
  * 快捷键配置格式修改为 ⇧⌘[] / ⌘[] / ⌥⌘[]
  * 添加 hint.parse 配置
  * codeRender 方法中移除 lang 参数
  * 为 options 添加 i18n 语言自定义参数
  * 添加 exportJSON 方法
* 3.7
  * `preview` 静态方法添加 `mode` 配置
  * 大纲 DOM 结构和 class 变更
  * 添加 `options.undoDelay` 配置
  * 添加 `options.counter.after` 回调方法
  * 添加 `previewImage` 静态方法
  * 添加 `options.fullscreen.index`
  * 移除`options.preview.markdown.chinesePunct` 配置
  * `options.outline` 修改为 `{ enable: boolean, position: "left" | "right" }`
  * `toolbar.click` 参数修改为 `event: Event, vditor: IVditor`
* 3.6
  * `options.preview.actions` 添加 `tooltip`
  * `mermaidRender` 添加 `theme` 参数
  * `mindmapRender` 添加 `theme` 参数
  * `chartRender` 添加 `theme` 参数
* 3.5
  * `mermaidRender` 移除 `className` 参数
* 3.4
  * `options.hint.at` => "options.hint.extend: IHintExtend[]"
* v3.3
  * options.mode 默认值修改为 `ir`
  * `options.markdown.listMarker` 修改为 `options.markdown.listStyle`
  * `options.preview.markdow.theme` 修改为 `options.preview.theme`
  * `setContentTheme` 参数修改为 `contentTheme: string, path: string`
  * `setTheme` 参数修改为 `theme: "dark" | "classic", contentTheme?: string, codeTheme?: string, contentThemePath?: string`
  * 移除 `setSelection`
  * 移除 `options.keymap`
  * 移除 `options.preview.markdown.setext`
  * 移除工具栏上的格式化功能：`options.toolbar` 中移除 `format` 选项
* v3.2
  * IPreviewOptions.anchor 从 `boolean` 类型修改为 `number` 类型
* v3.1
  * `options.counter` 修改为 `counter?: { enable: boolean; max?: number; type: "markdown" | "text"; }`
  * `options.hideToolbar` 修改为 `toolbarConfig: { hide?: boolean, pin?: boolean }`
  * `setPreviewMode` 方法中移除 `preview` 选项
  * `options.preview.mode` 移除 `preview` 选项
  * 将 `IPreviewOptions` 中的 `theme` 配置移动到 `IPreviewOptions.markdown` 中
* v3.0
  * `options.mode` 可选值为：'wysiwyg', 'sv', 'ir'
  * toolbar 中的 `wysiwyg` 修改为 `edit-mode`
  * new 支持传入 element
  * `options.cache` 修改为 `{enable: boolean, id: string}`
  * `md2html` 方法改为异步
  * 添加 `options.preview.markdown.codeBlockPreview` 配置
  * 为 `options.toolbar` 添加 `className` 配置
  * 添加 `getCurrentMode` 方法
* v2.2
  * 移除 `IPreviewOptions` 中的 `className`
  * `insertValue` 添加 `render` 参数，以便配置是否需要进行 Markdown 处理
  * 将异步方法变为同步
  * 引用快捷键修改为 <kbd>Ctrl-;</kbd>
  * 移除 index-preview.html, index-preview.js 文件
  * `options.preview.markdown.autoSpace/chinesePunct/fixTermTypo` 默认值设置为 `false`
* v2.1
  * 添加 options.upload.file 方法
  * options.preview 修改，支持 MathJax 配置
  * 移除 mathRenderByLute 方法
  * 添加 setTheme 方法，classic.scss -> index.scss
* v2.0
  * 默认为 WYSIWYG 模式，可根据需要修改 option.mode 参数
  * 添加 options.debugger, options.value
* v1.9
  * preview 静态方法参数修改为 `(previewElement: HTMLDivElement, markdown: string, options?: IPreviewOptions)`，其中参数 `IPreviewOptions` 修改为
    ```ts
        anchor?: boolean;
        className?: string;
        customEmoji?: { [key: string]: string };
        lang?: (keyof II18nLang);
        emojiPath?: string;
        hljs?: {
            lineNumber?: boolean;
            style?: string;
            enable?: boolean;
        };
        speech?: {
            enable?: boolean
        }
    ```
  * highlightRender 参数修改为 `(hljs?: IHljs, element?: HTMLElement | Document)`
* v1.8
  * `getHTML` 方法移除参数
  * `md2html` 静态方法参数修改为 `(mdText: string, options?: IPreviewOptions)`
  * `mathRender` 参数修改为 `(element: HTMLElement)`
  * `preview.hljs.style` 默认值修改为 `github`，可选值参见[chroma](https://xyproto.github.io/splash/docs/longer/all.html)
  * 添加 `typewriterMode` 配置，默认值为 false。1.7 版本用户需要手动开启该功能
* v1.7
  * `option.preivew.show?: boolean` => `option.preivew.mode?: string`
  * 移除 `option.editorName`

### v3.8.18 / 2022-11-01

* [1325](https://github.com/Vanessa219/vditor/pull/1325) 日语改进 `文档相关`
* [1312](https://github.com/Vanessa219/vditor/issues/1312) 导出 PDF 图表缺失 `修复缺陷`
* [1297](https://github.com/Vanessa219/vditor/issues/1297) mermaid 升级到 9.1.7 `改进功能`
* [1289](https://github.com/Vanessa219/vditor/issues/1289) 切换输入法后光标错位 `兼容性`
* [1278](https://github.com/Vanessa219/vditor/issues/1278) RenderJSON 导出的 JSON 不正确 `修复缺陷`
* [1275](https://github.com/Vanessa219/vditor/issues/1275) XSS 安全漏洞 `修复缺陷`

### v3.8.17 / 2022-08-04

* [1270](https://github.com/Vanessa219/vditor/issues/1270) 切换编辑模式 SV 脚注缩进丢失 `修复缺陷`
* [1274](https://github.com/Vanessa219/vditor/issues/1274) XSS 安全漏洞 `修复缺陷`
* [1269](https://github.com/Vanessa219/vditor/issues/1269) 代码块自动补全会包含链接引用和脚注 `修复缺陷`
* [1263](https://github.com/Vanessa219/vditor/issues/1263) 所见即所得和即使渲染只有空格输入时，不会触发 input 事件 `修复缺陷`
* [1264](https://github.com/Vanessa219/vditor/issues/1264) 链接中，会强制将&reg解析为 ® 字符 `修复缺陷`
* [1242](https://github.com/Vanessa219/vditor/issues/1242) 在即时渲染模式下表格源文件未对齐 `改进功能`

### v3.8.15 / 2022-05-24

* [1241](https://github.com/Vanessa219/vditor/issues/1241) 默认 CDN 从 cdn.jsdelivr.net 切换到 unpkg.com `改进功能`
* [1231](https://github.com/Vanessa219/vditor/pull/1231) 支持使用 Base64 显示图片 `引入特性`
* [1235](https://github.com/Vanessa219/vditor/issues/1235) 自定义上传无法连续上传相同的图片 `修复缺陷`
* [1228](https://github.com/Vanessa219/vditor/issues/1228) 使用删除图标删除后，大纲没有自动更新 `修复缺陷`
* [1230](https://github.com/Vanessa219/vditor/issues/1230) cnd preview path 重复加载问题 `改进功能`

### v3.8.14 / 2022-05

* [1223](https://github.com/Vanessa219/vditor/issues/1223) 关于有时显示不完整 `修复缺陷`
* [1218](https://github.com/Vanessa219/vditor/issues/1218) 高度设置为 string 时，大纲锚点失效 `修复缺陷`
* [1215](https://github.com/Vanessa219/vditor/issues/1215) sv 模式 setValue 导致状态错误 `修复缺陷`
* [1219](https://github.com/Vanessa219/vditor/issues/1219) vditor.destroy 报错 `修复缺陷`
* [1208](https://github.com/Vanessa219/vditor/pull/1208) Sass -> Less `开发重构`
* [1209](https://github.com/Vanessa219/vditor/issues/1209) 侧栏大纲内容未转义 `修复缺陷`
* [1207](https://github.com/Vanessa219/vditor/issues/1207) 3.8.13 源码 build 报错 `修复缺陷`

### v3.8.13 / 2022-03-31

* [1206](https://github.com/Vanessa219/vditor/issues/1206) 评论语法解析和行级 HTML 解析冲突 `修复缺陷`
* [1054](https://github.com/Vanessa219/vditor/issues/1054) disabled 后应禁止粘贴 `修复缺陷`
* [1162](https://github.com/Vanessa219/vditor/issues/1162) XSS 安全漏洞 `修复缺陷`
* [1203](https://github.com/Vanessa219/vditor/issues/1203) 支持 solidity, yul 语法 `引入特性`
* [1176](https://github.com/Vanessa219/vditor/issues/1176) 代码规范 lint 从 Tslint 迁移至 Eslint `开发重构`
* [1178](https://github.com/Vanessa219/vditor/issues/1198) 调用 insertValue 后第一次用户输入没有触发 input 回调函数 `修复缺陷`
* [1179](https://github.com/Vanessa219/vditor/pull/1179) 更新代码风格工具&包管理工具 `开发重构`

### v3.8.12 / 2022-03-03

* [1184](https://github.com/Vanessa219/vditor/issues/1184) wysiwyg 模式下，录音渲染出现问题，无法正常显示 audio 组件 `修复缺陷`
* [1182](https://github.com/Vanessa219/vditor/issues/1182) 撤销后大纲不会刷新 `修复缺陷`
* [1178](https://github.com/Vanessa219/vditor/issues/1178) 3.8.12 中使用 highlight.js 渲染的代码块无法高亮 `修复缺陷`
* [1171](https://github.com/Vanessa219/vditor/issues/1171) 代码编辑区域未能按照预期隐藏 `改进功能`
* [1177](https://github.com/Vanessa219/vditor/pull/1177) 优化 Emoji 绑定事件 `开发重构`

### v3.8.11 / 2022-01-22

* [1156](https://github.com/Vanessa219/vditor/issues/1156) 所见即所得行级 HTML 解析错误 `修复缺陷`
* [1133](https://github.com/Vanessa219/vditor/issues/1133) SVG 事件导致的 XSS 漏洞 `修复缺陷`
* [1158](https://github.com/Vanessa219/vditor/pull/1158) Add mhchem support to KaTex `引入特性`
* [1153](https://github.com/Vanessa219/vditor/issues/1153) vditor 的生产代码未经 minify `改进功能`
* [1004](https://github.com/Vanessa219/vditor/issues/1004) options.input无法监听点击toolbar link的输入内容 `改进功能`

### v3.8.10 / 2021-12-21

* [1134](https://github.com/Vanessa219/vditor/issues/1134) 渲染时代码块复制图标报错 `修复缺陷`
* [1129](https://github.com/Vanessa219/vditor/pull/1129) WYSIWYG 下，点击语言后光标切换到代码输入框中 `改进功能`
* [1122](https://github.com/Vanessa219/vditor/pull/1122) 预览中退出全屏后，工具栏布局错误 `修复缺陷`
* [1123](https://github.com/Vanessa219/vditor/pull/1123) 预览模式下，工具栏不自动隐藏 `改进功能`
* [1124](https://github.com/Vanessa219/vditor/pull/1124) 在焦点更改后，代码选择列表不自动隐藏 `改进功能`
* [1121](https://github.com/Vanessa219/vditor/pull/1121) WYSIWYG 下，Enter 也可以切换到代码输入框中 `改进功能`
* [1103](https://github.com/Vanessa219/vditor/pull/1103) 支持多语言切换 `改进功能`
* [1105](https://github.com/Vanessa219/vditor/pull/1105) 兼容 Firefox 中的代码语言选择 `修复缺陷`
* [1098](https://github.com/Vanessa219/vditor/pull/1098) 兼容 Firefox 中的文件拖拽 `修复缺陷`
* [1097](https://github.com/Vanessa219/vditor/pull/1097) options.hint.extend[].hint 支持异步 `改进功能`
* [1101](https://github.com/Vanessa219/vditor/pull/1101) 支持 options.upload.handler 异步 `改进功能`
* [1089](https://github.com/Vanessa219/vditor/pull/1089) 解决内存泄漏问题 `开发重构`
* [158](https://github.com/88250/lute/issues/158) Table 紧跟的上一行不是空行时，SpinVditorSVDOM 会将整个表格过滤掉 `修复缺陷`

### v3.8.7 / 2021-09-21

* [1049](https://github.com/Vanessa219/vditor/issues/1049) #后面没有空格也会渲染为标题 `修复缺陷`
* [1085](https://github.com/Vanessa219/vditor/issues/1085) XSS 漏洞修复 `修复缺陷`
* [1074](https://github.com/Vanessa219/vditor/issues/1074) 升级 webpack-dev-server & node-sass `开发重构`
* [1063](https://github.com/Vanessa219/vditor/issues/1063) 所见即所得模式链接引用语法中链接文本包含行级嵌套的问题 `修复缺陷`
* [1047](https://github.com/Vanessa219/vditor/issues/1047) 列表换行问题 `修复缺陷`
* [974](https://github.com/Vanessa219/vditor/issues/974) 所见即所得模式下行级元素间的空格会被删除 `修复缺陷`
* [1029](https://github.com/Vanessa219/vditor/issues/1029) 公式内小于号大于号等没有转义 `修复缺陷`
* [1036](https://github.com/Vanessa219/vditor/issues/1036) 标题设置没有配置多语言 `改进功能`
* [957](https://github.com/Vanessa219/vditor/issues/957) 支持表格横向滚动 `引入特性`
* [1038](https://github.com/Vanessa219/vditor/issues/1038) 图片使用 pointer 样式 `改进功能`
* [1034](https://github.com/Vanessa219/vditor/pull/1034) Support Vue and Angular `改进功能`
* [1016](https://github.com/Vanessa219/vditor/pull/1016) Support Svelte `文档相关`
* [1009](https://github.com/Vanessa219/vditor/pull/1009/) 对于 markdown 目录下的渲染方法新增 适配模块 `引入特性`
* [1011](https://github.com/Vanessa219/vditor/issues/1011) 支持导出 JSON `引入特性`
* [1010](https://github.com/Vanessa219/vditor/issues/1010) 多语言分离 `改进功能`
* [1008](https://github.com/Vanessa219/vditor/pull/1008) 自定义多语言 `引入特性`
* [1000](https://github.com/Vanessa219/vditor/issues/1000) 升级 hljs 并添加更多的语言支持 `改进功能`
* [993](https://github.com/Vanessa219/vditor/pull/993) 加入繁體中文 `引入特性`
* [980](https://github.com/Vanessa219/vditor/pull/980) 流程图不应渲染代码高亮  `修复缺陷`
* [987](https://github.com/Vanessa219/vditor/pull/987) 完善 upload 必填项说明 `文档相关`
* [970](https://github.com/Vanessa219/vditor/pull/970) added ru_RU lang `引入特性`
* [955](https://github.com/Vanessa219/vditor/issues/955) 为 hint 内容添加是否进行 md 转换的设置 `改进功能`
* [956](https://github.com/Vanessa219/vditor/issues/956) 改进 plantuml 解析问题 `修复缺陷`
* [953](https://github.com/Vanessa219/vditor/issues/953) 标题删除需保留空行 `改进功能`
* [946](https://github.com/Vanessa219/vditor/issues/946) Improve delete behavior in the list item after the code block `修复缺陷`
* [949](https://github.com/Vanessa219/vditor/issues/949) lute.Md2HTML 3.7.5 后解析无 id 属性 `修复缺陷`
* [936](https://github.com/Vanessa219/vditor/issues/936) Auto link `.app` domain suffix `改进功能`
* [926](https://github.com/Vanessa219/vditor/issues/926) 即时渲染和所见即所得模式支持点击链接 `引入特性`
* [938](https://github.com/Vanessa219/vditor/issues/938) 大纲缺少样式 `修复缺陷`
* [928](https://github.com/Vanessa219/vditor/issues/928) Mathjax 资源缺失及添加 license `修复缺陷`
* [720](https://github.com/Vanessa219/vditor/issues/720) 在光标位置插入内容的问题 `改进功能`
* [751](https://github.com/Vanessa219/vditor/issues/751) firefox 代码块中 enter 键换行问题 `修复缺陷`
* [923](https://github.com/Vanessa219/vditor/issues/923) 隐藏预览操作栏 `改进功能`
* [921](https://github.com/Vanessa219/vditor/issues/921) MS Word 表格粘贴问题 `修复缺陷`
* [922](https://github.com/Vanessa219/vditor/issues/922) MS Excel 粘贴带图表格问题 `修复缺陷`
* [904](https://github.com/Vanessa219/vditor/issues/904) wysiwyg 和 ir 模式表格增加向上插入行和向左插入列 `改进功能`
* [920](https://github.com/Vanessa219/vditor/issues/920) ” 无法输入 `修复缺陷`
* [919](https://github.com/Vanessa219/vditor/issues/919) 支持外部文本内容拖拽进入编辑器 `改进功能`
* [917](https://github.com/Vanessa219/vditor/issues/917) intsertValue无法一次添加多行markdown内容 `修复缺陷`
* [910](https://github.com/Vanessa219/vditor/issues/910) 编辑列表内容时出现的问题 `改进功能`
* [913](https://github.com/Vanessa219/vditor/pull/913) 支持plantuml `引入特性`
* [907](https://github.com/Vanessa219/vditor/issues/907) mathjax 在method.min.js 中preview 显示错误 `修复缺陷`
* [909](https://github.com/Vanessa219/vditor/issues/909) toc 和大纲中数学公式显示问题修复 `修复缺陷`
* [908](https://github.com/Vanessa219/vditor/issues/908) 粘贴不了 MS Office Excel 内容的问题 `修复缺陷`
* 文档修改
  * 3.8.0
    * 添加 plantumlRender 方法
    * options.input 移除 previewElement 参数
  * 3.8.1
    * 添加表格增加向上插入行 ⇧⌘F 和向左插入列 ⇧⌘G 的快捷键
    * 快捷键配置格式修改为 ⇧⌘[] / ⌘[] / ⌥⌘[]
  * 3.8.4
    * 添加 hint.parse 配置
  * 3.8.5
    * codeRender 方法中移除 lang 参数
    * 为 options 添加 i18n 语言自定义参数
    * 添加 exportJSON 方法

### v3.7.7 / 2021-01-19

* [903](https://github.com/Vanessa219/vditor/issues/903) 使用 setValue 后第一次输入无法撤销 `修复缺陷`
* [902](https://github.com/Vanessa219/vditor/issues/902) hint 内容为 md 时，需进行渲染 `改进功能`
* [900](https://github.com/Vanessa219/vditor/issues/900) img标签图片无法显示 `修复缺陷`
* [901](https://github.com/Vanessa219/vditor/issues/901) 预览区域代码点击复制无效 `修复缺陷`
* [890](https://github.com/Vanessa219/vditor/issues/890) Can not delete the special tag(Wysiwyg mode) `修复缺陷`
* [894](https://github.com/Vanessa219/vditor/issues/894) 代码块下紧跟一张图片，使用回退键删除图片时光标跑到代码块里，图片不能删除 `修复缺陷`
* [659](https://github.com/Vanessa219/vditor/issues/659) IR 模式复制粘贴 <kbd> 问题 `修复缺陷`
* [888](https://github.com/Vanessa219/vditor/issues/888) 大纲点击错误 `修复缺陷`
* [884](https://github.com/Vanessa219/vditor/issues/884) 工具栏自定义按钮禁用 `改进功能`
* [877](https://github.com/Vanessa219/vditor/issues/877) 数学公式输入删除生成节点 `修复缺陷`
* [882](https://github.com/Vanessa219/vditor/issues/882) 改进 HTML 转换 Markdown 时加粗、斜体等空格的处理 `改进功能`
* [878](https://github.com/Vanessa219/vditor/issues/878) 移除列表标记符中文优化 `改进功能`
* [875](https://github.com/Vanessa219/vditor/issues/875) 增加大纲位置配置 `引入特性`
* [873](https://github.com/Vanessa219/vditor/issues/873) graphviz，mermaid 在为空时不应出现错误提示 `改进功能`
* [872](https://github.com/Vanessa219/vditor/issues/872) vditor.options.upload.file 支持 await `改进功能`
* [871](https://github.com/Vanessa219/vditor/issues/871) 大纲标题过长需显示省略号 `改进功能`
* [866](https://github.com/Vanessa219/vditor/issues/866) 预览配置开启自动空格后,链接中有中文,无法正常解析 `改进功能`
* [868](https://github.com/Vanessa219/vditor/issues/868) 将 Markdown 引擎选项拆分为解析选项和渲染选项 `改进功能`
* [869](https://github.com/Vanessa219/vditor/issues/869) 移除 options.preview.markdown. chinesePunct 配置 `开发重构`
* [848](https://github.com/Vanessa219/vditor/issues/848) 即时渲染模式下FireFox浏览器光标问题 `修复缺陷`
* [847](https://github.com/Vanessa219/vditor/issues/847) 即时渲染状态下 Firefox 删除线出错 `修复缺陷`
* [858](https://github.com/Vanessa219/vditor/issues/858) 预览模式下应禁用工具栏上传按钮 `修复缺陷`
* [849](https://github.com/Vanessa219/vditor/issues/849) 固定工具栏模式下点击全屏打开后导航栏位置异常 `修复缺陷`
* [855](https://github.com/Vanessa219/vditor/issues/855) 添加全屏 z-index 设置 `引入特性`
* [850](https://github.com/Vanessa219/vditor/issues/850) 工具栏大纲按钮点击后焦点并未回到内容区 `改进功能`
* [840](https://github.com/Vanessa219/vditor/issues/840) 关于移动端图片点击需求 `引入特性`
* [842](https://github.com/Vanessa219/vditor/issues/842) 大纲无法展示 `修复缺陷`
* [673](https://github.com/Vanessa219/vditor/issues/673) 复制粘贴 Excel 内容转换为表格问题 `修复缺陷`
* [742](https://github.com/Vanessa219/vditor/issues/742) IR 模式块引用换行问题 `修复缺陷`
* [759](https://github.com/Vanessa219/vditor/issues/759) 添加数字统计回调函数 `引入特性`
* [835](https://github.com/Vanessa219/vditor/issues/835) 历史性能优化 `改进功能`
* [837](https://github.com/Vanessa219/vditor/issues/837) 历史记录添加时间间隔配置 `引入特性`
* [479](https://github.com/Vanessa219/vditor/issues/479) 大纲折叠 `改进功能`
* [830](https://github.com/Vanessa219/vditor/issues/830) ToC 优化 `改进功能`
* [828](https://github.com/Vanessa219/vditor/issues/828) 为 Vditor.preview 添加 mode 设置 `修复缺陷`
* 文档修改
  * 3.7.0
    * `preview` 静态方法添加 `mode` 配置
    * 大纲 DOM 结构和 class 变更
  * 3.7.1
    * 添加 `options.undoDelay` 配置
    * 添加 `options.counter.after` 回调方法
  * 3.7.2
    * 添加 `previewImage` 静态方法
  * 3.7.3
    * 添加 `options.fullscreen.index`
  * 3.7.4
    * 移除`options.preview.markdown.chinesePunct` 配置
  * 3.7.5
    * `options.outline` 修改为 `{ enable: boolean, position: "left" | "right" }`
    * `toolbar.click` 参数修改为 `event: Event, vditor: IVditor`

### v3.6.6 / 2020-11-23

* [824](https://github.com/Vanessa219/vditor/issues/824) 流程图大小可自适应 & 居中 `引入特性`
* [822](https://github.com/Vanessa219/vditor/issues/822) 流程图、甘特图、时序图、图表、脑图、五线谱、添加暗黑模式 `引入特性`
* [823](https://github.com/Vanessa219/vditor/issues/823) 数学公式块去除背景 `改进功能`
* [761](https://github.com/Vanessa219/vditor/issues/761) 列表项批量缩进和取消缩进 `改进功能`
* [819](https://github.com/Vanessa219/vditor/issues/819) 粘贴后滚动到粘贴内容末尾 bug `修复缺陷`
* [815](https://github.com/Vanessa219/vditor/issues/815) wysiwyg sv 表格切换会多内容 `修复缺陷`
* [814](https://github.com/Vanessa219/vditor/issues/814) 划词评论纯文本以外的其他元素处理 `修复缺陷`
* [812](https://github.com/Vanessa219/vditor/issues/812) 粘贴时减少抖动优化 `改进功能`
* [810](https://github.com/Vanessa219/vditor/issues/810) 所见即所得模式划词评论功能改进 `修复缺陷`
* [807](https://github.com/Vanessa219/vditor/issues/807) 脚注和链接引用改进 `改进功能`
* [721](https://github.com/Vanessa219/vditor/issues/721) 所见即所得模式加入划词评论 `引入特性`
* [808](https://github.com/Vanessa219/vditor/issues/808) options.preview.actions 添加的自定义 tooltip `改进功能`
* [802](https://github.com/Vanessa219/vditor/issues/802) 粘贴后需滚动到粘贴内容的末尾 `改进功能`
* [806](https://github.com/Vanessa219/vditor/pull/806) 修复201不算成功的问题  `改进功能`
* [786](https://github.com/Vanessa219/vditor/issues/786) 数学公式块预览开关 `引入特性`
* [800](https://github.com/Vanessa219/vditor/issues/800) WG 模式代码块预览开关问题 `修复缺陷`
* [801](https://github.com/Vanessa219/vditor/issues/801) 编辑器拖拽问题 `修复缺陷`
* [796](https://github.com/Vanessa219/vditor/issues/796) 列表项合并 `改进功能`
* [787](https://github.com/Vanessa219/vditor/issues/787) IR 模式 Setext 风格标题编辑问题 `修复缺陷`
* [784](https://github.com/Vanessa219/vditor/issues/784) 从 WPS 粘贴时标题转 Markdown 优化 `改进功能`
* [781](https://github.com/Vanessa219/vditor/issues/781) 增加 `linkPrefix` 用于强制对链接目标地址添加前缀 `引入特性`
* [780](https://github.com/Vanessa219/vditor/pull/780) linkToImg支持自定义format `引入特性`
* 文档修改
  * 3.6.1
   * `options.preview.actions` 添加 `tooltip`
   * 添加 `options.comment` 及 `getCommentIds`, `hlCommentIds`, `unHlCommentIds`, `removeCommentIds` 方法
     ```
     comment?: {
         enable: boolean
         add?(id: string, text: string, commentsData: ICommentsData[]): void
         remove?(ids: string[]): void;
         scroll?(top: number): void;
         adjustTop?(commentsData: ICommentsData[]): void;
     };
     ```
  * 3.6.4
    * `mermaidRender` 添加 `theme` 参数
    * `mindmapRender` 添加 `theme` 参数
    * `chartRender` 添加 `theme` 参数

### v3.5.5 / 2020-10-12

* [777](https://github.com/Vanessa219/vditor/issues/777) blockquote 复制问题 `修复缺陷`
* [774](https://github.com/Vanessa219/vditor/issues/774) sv 模式在 table 后换行 bug`修复缺陷`
* [773](https://github.com/Vanessa219/vditor/issues/773) vditor支持FlowCharts的流程图语法 `引入特性`
* [770](https://github.com/Vanessa219/vditor/issues/770) 取消列表项自动合并 `改进功能`
* [768](https://github.com/Vanessa219/vditor/issues/768) mermaid 问题修复 `修复缺陷`
* [765](https://github.com/Vanessa219/vditor/issues/765) hint 组件中文回车及单引号转译修复 `修复缺陷`
* [746](https://github.com/Vanessa219/vditor/issues/746) 块引用 > 按下后即渲染（允许空内容的块引用） `改进功能`
* [757](https://github.com/Vanessa219/vditor/issues/757) 汉语拼音中文空格问题 `修复缺陷`
* [756](https://github.com/Vanessa219/vditor/issues/756) 任务列表编辑问题 `修复缺陷`
* [755](https://github.com/Vanessa219/vditor/issues/755) 撤销后光标位置改进 `修复缺陷`
* [746](https://github.com/Vanessa219/vditor/issues/746) 代码片段都没了 `修复缺陷`
* [753](https://github.com/Vanessa219/vditor/issues/753) 更新社区地址为 ld246.com `文档相关`
* [752](https://github.com/Vanessa219/vditor/issues/752) 图表和脑图 undo bug `修复缺陷`
* [749](https://github.com/Vanessa219/vditor/issues/749) 即时渲染模式转义符 \ 改进 `改进功能`
* [747](https://github.com/Vanessa219/vditor/issues/747) options.esc 中文处理 `改进功能`
* [744](https://github.com/Vanessa219/vditor/issues/744) IR 模式代码块闪烁 `修复缺陷`
* [748](https://github.com/Vanessa219/vditor/issues/748) 数学公式中出现中文不能渲染问题 `修复缺陷`
* [738](https://github.com/Vanessa219/vditor/issues/738) IR 模式标题变大变小快捷键及光标位置 `修复缺陷`
* [736](https://github.com/Vanessa219/vditor/issues/736) MathJax 数学公式会抖动 `改进功能`
* [735](https://github.com/Vanessa219/vditor/issues/735) 官网地址及桌面端地址修改 `文档相关`
* [730](https://github.com/Vanessa219/vditor/issues/730) 数学公式细节处理 `修复缺陷`
* 文档修改
  * 3.5.5 `mermaidRender` 移除 `className` 参数；添加 `flowchartRender` 方法

### v3.4.7 / 2020-08-22

* [717](https://github.com/Vanessa219/vditor/issues/717) 在IR模式下插入特殊字符的bug `修复缺陷`
* [719](https://github.com/Vanessa219/vditor/issues/719) 支持 ==Mark== 标记语法 `引入特性`
* [711](https://github.com/Vanessa219/vditor/issues/711) 调试工具栏图颜色不适配暗黑主题 `改进功能`
* [718](https://github.com/Vanessa219/vditor/issues/718) 脚注太长浮层渲染溢出 `修复缺陷`
* [716](https://github.com/Vanessa219/vditor/issues/716) insertValue 无法插入html文本 `改进功能`
* [714](https://github.com/Vanessa219/vditor/issues/714) preview 数学公式解析问题 `修复缺陷`
* [709](https://github.com/Vanessa219/vditor/issues/709) 操作栏按钮快速点击问题「ir」「wysiwyg」模式 `改进功能`
* [706](https://github.com/Vanessa219/vditor/issues/706) 光标非正常移动 `修复缺陷`
* [676](https://github.com/Vanessa219/vditor/issues/676) 请求：增加 Ant Design 主题 `引入特性`
* [703](https://github.com/Vanessa219/vditor/issues/703) codeblock with backspace(IR) `修复缺陷`
* [708](https://github.com/Vanessa219/vditor/issues/708) linkToImgUrl 方法添加 token `改进功能`
* [701](https://github.com/Vanessa219/vditor/issues/701) 复制到微信、知乎的改进 `改进功能`
* [684](https://github.com/Vanessa219/vditor/issues/684) 图片使用引用风格时的解析问题 `修复缺陷`
* [698](https://github.com/Vanessa219/vditor/issues/698) 图片上传解析问题 `修复缺陷`
* [696](https://github.com/Vanessa219/vditor/issues/696) 图片参考式解析问题 `修复缺陷`
* [694](https://github.com/Vanessa219/vditor/pull/694) Fix expandmarker for node element `修复缺陷`
* [697](https://github.com/Vanessa219/vditor/pull/697) 修复Lute类型的定义 `开发重构`
* [687](https://github.com/Vanessa219/vditor/issues/687) Code 内 Enter/Backspace/Delete 可能不触发 input，并导致 Code 不及时渲染 `改进功能`
* [685](https://github.com/Vanessa219/vditor/issues/685) options.icon 增加判断如果没有该属性则不引入js `改进功能`
* [689](https://github.com/Vanessa219/vditor/pull/689) 存在软换行时，选中文本执行 Backspace，会导致内容异常 `修复缺陷`
* [686](https://github.com/Vanessa219/vditor/pull/686) 修正 Issue：Code 内 Delete 键可能删除过多内容 & Code 内 回车后光标位置异常 `修复缺陷`
* [681](https://github.com/Vanessa219/vditor/pull/681) 修正 ExpandMarker 规则，避免无法取消选中区域 `修复缺陷`
* [653](https://github.com/Vanessa219/vditor/issues/653) [Feature Request] Hashtag `引入特性`
* [441](https://github.com/Vanessa219/vditor/issues/441) 对标 Typora 反馈 `改进功能`
* [669](https://github.com/Vanessa219/vditor/issues/669) links problem(Wysiwyg) `改进功能`
* [667](https://github.com/Vanessa219/vditor/issues/667) lists (SV) `修复缺陷`
* [446](https://github.com/Vanessa219/vditor/issues/446) 改进复制粘贴链接体验 `引入特性`
* [658](https://github.com/Vanessa219/vditor/issues/658) SV 模式打字机模式问题 `修复缺陷`
* [655](https://github.com/Vanessa219/vditor/issues/655) SV 模式代码块开始标记符 info 后回车问题 `修复缺陷`
* [656](https://github.com/Vanessa219/vditor/issues/656) SV 模式有序列表延续问题 `修复缺陷`
* [654](https://github.com/Vanessa219/vditor/issues/654) SV 模式 Placeholder 显示问题 `修复缺陷`
* [650](https://github.com/Vanessa219/vditor/pull/650) 全选剪切及任务列表样式和点击问题改进 `修复缺陷`
* [636](https://github.com/Vanessa219/vditor/issues/636) SV 模式 Setext 标题问题 `修复缺陷`
* [647](https://github.com/Vanessa219/vditor/pull/647) 即时渲染模式输入 ``` 后会弹出 hint，此时执行 undo 后， hint 不消失 `改进功能`
* [643](https://github.com/Vanessa219/vditor/issues/643) 支持 YAML Front Matter `引入特性`
* [648](https://github.com/Vanessa219/vditor/pull/648) added ja_JP lang `改进功能`
* [644](https://github.com/Vanessa219/vditor/pull/644) 粘贴多行代码时，避免代码段与当前行内容混淆在一起 `改进功能`
* [639](https://github.com/Vanessa219/vditor/issues/639) 列表嵌套代码块后输入中文的问题 `修复缺陷`
* [641](https://github.com/Vanessa219/vditor/issues/641) 清空 undo 栈后，第一次编辑操作无法进行记录 `修复缺陷`
* [640](https://github.com/Vanessa219/vditor/issues/640) options.icon 无法进行切换 `改进功能`
* [638](https://github.com/Vanessa219/vditor/pull/638) ir模式下图片编辑时很难触发md图片代码显示 `改进功能`
* 文档修改
  * 3.4.2 `options.hint.at` => "options.hint.extend: IHintExtend[]"
  * 3.4.7 删除线快捷键修改为 `⌘-D`
  * 3.4.8 添加 `options.preview.markdown.mark` 配置

### v3.3.12 / 2020-07-28

* [632](https://github.com/Vanessa219/vditor/issues/632) 复制代码块解析优化 `改进功能`
* [627](https://github.com/Vanessa219/vditor/issues/627) 为 <kbd> 提供单独的渲染效果 `改进功能`
* [621](https://github.com/Vanessa219/vditor/issues/621) 粘贴数学公式时渲染报错 `修复缺陷`
* [619](https://github.com/Vanessa219/vditor/issues/619) 即时渲染下list删除(或剪切)的问题 `修复缺陷`
* [633](https://github.com/Vanessa219/vditor/issues/633) SV 模式光标在列表标记符中的问题 `修复缺陷`
* [623](https://github.com/Vanessa219/vditor/pull/623) 修复即时渲染模式下复制光标位置错误和添加位置错误的问题 `修复缺陷`
* [608](https://github.com/Vanessa219/vditor/issues/608) 更新使用截图和演示动画 `文档相关`
* [587](https://github.com/Vanessa219/vditor/issues/587) IR & SV 保留 Setext 风格标题 `改进功能`
* [626](https://github.com/Vanessa219/vditor/issues/626) 去除 Setext 标题解析开关 `开发重构`
* [451](https://github.com/Vanessa219/vditor/issues/451) IR 模式保留 Emoji 原始输入 `改进功能`
* [620](https://github.com/Vanessa219/vditor/issues/620) 支持多套图标配置 `引入特性`
* [578](https://github.com/Vanessa219/vditor/issues/578) 添加 ant-design 及 Material 风格的图标 `改进功能`
* [614](https://github.com/Vanessa219/vditor/issues/614) 添加 linkToImgUrl 回调 `引入特性`
* [617](https://github.com/Vanessa219/vditor/issues/617) options.preview.theme.current 需设置不使用主题样式 `改进功能`
* [611](https://github.com/Vanessa219/vditor/issues/611) SV 模式粘贴图片拉取上传问题 `修复缺陷`
* [616](https://github.com/Vanessa219/vditor/pull/616) fix: safari下选中文字添加标题文字会消失 `修复缺陷`
* [615](https://github.com/Vanessa219/vditor/issues/615) 即时渲染模式下在safari中光标位置跳动 `修复缺陷`
* [596](https://github.com/Vanessa219/vditor/issues/596) blockquote insdie ordered list `改进功能`
* [605](https://github.com/Vanessa219/vditor/issues/605) 块节点上下插入的优化 `改进功能`
* [602](https://github.com/Vanessa219/vditor/issues/602) Three enters inside codeblock `修复缺陷`
* [600](https://github.com/Vanessa219/vditor/issues/600) codeblock inside footnote `修复缺陷`
* [590](https://github.com/Vanessa219/vditor/pull/590) Set value issue `修复缺陷`
* [594](https://github.com/Vanessa219/vditor/issues/594) Blockquote, ordered list and code block `改进功能`
* [593](https://github.com/Vanessa219/vditor/issues/593) IR 模式焦点离开时的渲染问题 `改进功能`
* [604](https://github.com/Vanessa219/vditor/issues/604) 站外图片抓取请求的 Content-Type 是 text/plain `改进功能`
* [597](https://github.com/Vanessa219/vditor/issues/597) one more backspace before delete lists `修复缺陷`
* [599](https://github.com/Vanessa219/vditor/issues/599) Ordered list(minor bug) `修复缺陷`
* [591](https://github.com/Vanessa219/vditor/issues/591) 粘贴有可能不渲染本行内容 `改进功能`
* [586](https://github.com/Vanessa219/vditor/issues/586) code block inside ordered list `修复缺陷`
* [585](https://github.com/Vanessa219/vditor/issues/585) [suggestion] when enter after code block inside blockqoute `改进功能`
* [584](https://github.com/Vanessa219/vditor/issues/584) Can not delete Code block `修复缺陷`
* [588](https://github.com/Vanessa219/vditor/issues/588) 第五版 SV 模式 bug 记录 `修复缺陷`
* [259](https://github.com/Vanessa219/vditor/issues/259) 分屏预览模式列表项自动完成 `引入特性`
* [580](https://github.com/Vanessa219/vditor/issues/580) 重构 SV 模式 DOM `开发重构`
* [567](https://github.com/Vanessa219/vditor/issues/567) SV 模式块引用嵌套列表、代码块问题 `修复缺陷`
* [563](https://github.com/Vanessa219/vditor/issues/563) SV 模式列表项下的代码块问题 `修复缺陷`
* [579](https://github.com/Vanessa219/vditor/issues/579) 样式调整 `改进功能`
* [575](https://github.com/Vanessa219/vditor/issues/575) 编辑器存在 form 中，情景菜单会出发提交事件 `修复缺陷`
* [577](https://github.com/Vanessa219/vditor/issues/577) 粘贴 XML 代码问题 `修复缺陷`
* [573](https://github.com/Vanessa219/vditor/pull/573) style: 优化分隔符样式 `改进功能`
* [572](https://github.com/Vanessa219/vditor/pull/572) fix: support aliyun oss `改进功能`
* [570](https://github.com/Vanessa219/vditor/issues/570) no placeholder after(SV) `修复缺陷`
* [569](https://github.com/Vanessa219/vditor/issues/569) 预览区域工具栏配置 `引入特性`
* [565](https://github.com/Vanessa219/vditor/issues/565) SV 模式支持缩进代码块 `改进功能`
* [566](https://github.com/Vanessa219/vditor/issues/566) 行级代码解析渲染 `修复缺陷`
* [555](https://github.com/Vanessa219/vditor/issues/555) SV 模式段落块拆分问题 `修复缺陷`
* [556](https://github.com/Vanessa219/vditor/issues/556) options.preview.markdown.setext 默认值修改为 true `改进功能`
* [554](https://github.com/Vanessa219/vditor/issues/554) SV 模式 Ctrl+u 代码块生成光标初始定位优化 `改进功能`
* [558](https://github.com/Vanessa219/vditor/issues/558) [suggestion] shift+enter and end the lists `改进功能`
* [547](https://github.com/Vanessa219/vditor/issues/547) 文件上传 format 第一个参数 files 为空数组 `修复缺陷`
* [562](https://github.com/Vanessa219/vditor/issues/562) 为上传添加 fieldName 选项 `引入特性`
* [553](https://github.com/Vanessa219/vditor/issues/553) 子任务列表回车问题 `改进功能`
* [534](https://github.com/Vanessa219/vditor/issues/534) 支持导出到知乎 `引入特性`
* [552](https://github.com/Vanessa219/vditor/issues/552) blockquote 换行需逐层跳出 `修复缺陷`
* [551](https://github.com/Vanessa219/vditor/issues/551) Tab and ctrl+shift+J (checkbox) `修复缺陷`
* [550](https://github.com/Vanessa219/vditor/issues/550) [Mermaid] State diagram rendering of multiple same node loops `修复缺陷`
* [549](https://github.com/Vanessa219/vditor/issues/549) 粘贴 HTML 内容失败 `修复缺陷`
* [548](https://github.com/Vanessa219/vditor/issues/548) 添加文件上传多选/单选配置 `引入特性`
* [545](https://github.com/Vanessa219/vditor/issues/545) SV 模式列表项下输入代码块问题 `修复缺陷`
* [544](https://github.com/Vanessa219/vditor/issues/544) SV 模式有序列表缩进问题 `修复缺陷`
* [543](https://github.com/Vanessa219/vditor/issues/543) SV 模式删除选择文本问题 `修复缺陷`
* [541](https://github.com/Vanessa219/vditor/issues/541) SV 模式列表和引用快捷键问题 `修复缺陷`
* [546](https://github.com/Vanessa219/vditor/issues/546) SV 模式丢失 headingID `修复缺陷`
* [539](https://github.com/Vanessa219/vditor/pull/539) 即时渲染模式 setValue 后，没有及时渲染 Code 区域 `修复缺陷`
* [536](https://github.com/Vanessa219/vditor/issues/536) 文件上传检查后缀忽略大小写 `改进功能`
* [537](https://github.com/Vanessa219/vditor/issues/537) 添加 destroy 方法 `引入特新`
* [532](https://github.com/Vanessa219/vditor/issues/532) 中文输入过程中不应记录 UndoStack `修复缺陷`
* [519](https://github.com/Vanessa219/vditor/issues/519) 扩展 markdown 主题 `改进功能`
* [533](https://github.com/Vanessa219/vditor/issues/533) 中文字符串中间插入 \ 字符导致乱码 `修复缺陷`
* [528](https://github.com/Vanessa219/vditor/issues/528) wysiwyg & ir 列表中有两个代码块时的错误 `修复缺陷`
* [531](https://github.com/Vanessa219/vditor/issues/531) 移除 options.keymap `改进功能`
* [529](https://github.com/Vanessa219/vditor/issues/529) 移除格式化按钮 `改进功能`
* [526](https://github.com/Vanessa219/vditor/issues/526) 字符串中带有 \ 符号时，从 \ 后面，但不是行尾 Backspace 删除字符到达 \ 时处理异常 `修复缺陷`
* [517](https://github.com/Vanessa219/vditor/issues/517) Duplicate CSS(render.html) `修复缺陷`
* [522](https://github.com/Vanessa219/vditor/issues/522) 从 WPS Office 复制文本，粘贴异常 `修复缺陷`
* [524](https://github.com/Vanessa219/vditor/issues/524) no background-color change(dark mode-abcjs) `修复缺陷`
* [516](https://github.com/Vanessa219/vditor/issues/516) 高亮自动填写功能未生效问题 `修复缺陷`
* [355](https://github.com/Vanessa219/vditor/issues/355) 新增 VditorSVDOM 渲染器 `引入特新`
* [499](https://github.com/Vanessa219/vditor/issues/499) Chrome 浏览器，Up 方向键 光标位置移动异常 `修复缺陷`
* [514](https://github.com/Vanessa219/vditor/issues/514) 只读没有禁用场景菜单 `修复缺陷`
* [501](https://github.com/Vanessa219/vditor/issues/501) 反斜杠 \ 转义问题 `改进功能`
* [508](https://github.com/Vanessa219/vditor/issues/508) 软键盘 bug `修复缺陷`
* [504](https://github.com/Vanessa219/vditor/issues/504) 解决编辑器中 esc 推出 hint 和 options.esc 冲突 `修复缺陷`
* [500](https://github.com/Vanessa219/vditor/issues/500) wysiwyg 模式下打字数学公式会闪 `改进功能`
* [498](https://github.com/Vanessa219/vditor/issues/498) 修复 <summary> <details> 标签编辑问题 `修复缺陷`
* [488](https://github.com/Vanessa219/vditor/pull/488) setValue 增加 clearStack 参数，添加 clearStack 方法 `引入特新`
* [478](https://github.com/Vanessa219/vditor/issues/478) add tip to footnote `改进功能`
* [492](https://github.com/Vanessa219/vditor/issues/492) 列表内含有代码块，修改列表中的文字时，代码块会闪 `修复缺陷`
* [496](https://github.com/Vanessa219/vditor/issues/496) 行级 HTML 空格问题 `修复缺陷`
* [495](https://github.com/Vanessa219/vditor/issues/495) 行级 HTML 退格问题 `修复缺陷`
* [494](https://github.com/Vanessa219/vditor/issues/494) 三种模式支持 list-style 样式 `改进功能`
* [489](https://github.com/Vanessa219/vditor/issues/489) 为 b3log.org/vditor/demo 添加源码 `改进功能`
* [493](https://github.com/Vanessa219/vditor/issues/493) 修复 XSS 过滤 `修复缺陷`
* [486](https://github.com/Vanessa219/vditor/pull/486) getCursorPosition 针对空行会得到错误数据 `修复缺陷`
* [485](https://github.com/Vanessa219/vditor/issues/485) IR 模式下，<details>的编辑问题 `修复缺陷`
* [484](https://github.com/Vanessa219/vditor/issues/484) 添加 TED 视频支持 `改进功能`
* [480](https://github.com/Vanessa219/vditor/issues/480) Mindmap 和 Echarts 内容为空时会报错 `修复缺陷`
* 文档修改
  * `options.markdown.listMarker` 修改为 `options.markdown.listStyle`
  * 为 `setValue` 方法添加 `clearStack` 参数；新增 `clearStack` 方法
  * 移除 `options.keymap`
  * 移除工具栏上的格式化功能
  * `setContentTheme` 参数修改为 `contentTheme: string, path: string`
  * `options.preview.markdow.theme` 修改为 `options.preview.theme`
  * `setTheme` 参数修改为 `theme: "dark" | "classic", contentTheme?: string, codeTheme?: string, contentThemePath?: string`
  * 移除 `setSelection`
  * 添加 `destroy` 方法
  * 添加 `options.upload.multiple`
  * 添加 `options.upload.fieldName`
  * `options.preview.markdown.setext` 默认值修改为 `true`
  * options.mode 默认值修改为 `ir`
  * 支持预览区域工具栏配置及自定义
  * 添加 `options.upload.linkToImgCallback`
  * 添加 `options.icon`
  * 移除 `options.preview.markdown.setext`

### v3.2.12 / 2020-06-07

* [475](https://github.com/Vanessa219/vditor/issues/475) 从网页和其它 md 编辑器中复制的 iframe 和 视频标签 无法粘贴到 Vditor `修复缺陷`
* [455](https://github.com/Vanessa219/vditor/issues/455) HTML 实体在切换编辑模式时的转义问题 `修复缺陷`
* [466](https://github.com/Vanessa219/vditor/issues/466) Tab is not working inside Quote(safari) `修复缺陷`
* [467](https://github.com/Vanessa219/vditor/issues/467) 为表格添加行列增删按钮 `引入特性`
* [472](https://github.com/Vanessa219/vditor/issues/472) Add details preview in ir mode `引入特性`
* [471](https://github.com/Vanessa219/vditor/issues/471) 移动端子工具栏箭头没对齐 `修复缺陷`
* [473](https://github.com/Vanessa219/vditor/issues/473) different between press "Ctrl+b" and click "B" icon. `修复缺陷`
* [463](https://github.com/Vanessa219/vditor/issues/463) 在行内代码中进行粘贴时光标位置不对及报错处理 `修复缺陷`
* [462](https://github.com/Vanessa219/vditor/issues/462) ctrl+z ir 模式没有渲染代码块 `修复缺陷`
* [456](https://github.com/Vanessa219/vditor/pull/456) 根据逗号/制表符生成表格 `引入特性`
* [453](https://github.com/Vanessa219/vditor/issues/453) bold 位于子菜单中无作用 `修复缺陷`
* [449](https://github.com/Vanessa219/vditor/issues/449) table(IR mode) `修复缺陷`
* [443](https://github.com/Vanessa219/vditor/issues/443) 快捷键中文版 `文档相关`
* [438](https://github.com/Vanessa219/vditor/issues/438) one empty line when ctrl+shift+h `改进功能`
* [439](https://github.com/Vanessa219/vditor/issues/439) not working ctrl+shift+x at links `修复缺陷`
* [444](https://github.com/Vanessa219/vditor/pull/444) delete tables when cells are empty `改进功能`
* [447](https://github.com/Vanessa219/vditor/pull/447) run vditor.insertValue('abc') throw error `修复缺陷`
* [435](https://github.com/Vanessa219/vditor/issues/435) task list 合并会添加 p 标签 `修复缺陷`
* [432](https://github.com/Vanessa219/vditor/issues/432) 代码块中输入 &pars 解析问题 `修复缺陷`
* [433](https://github.com/Vanessa219/vditor/issues/433) language position(code block, wysiwyg mode) `修复缺陷`
* [431](https://github.com/Vanessa219/vditor/issues/431) 链接、图片相对路径支持 `引入特性`
* [430](https://github.com/Vanessa219/vditor/issues/430) cursor location when press ctrl+b after checkbox `修复缺陷`
* [429](https://github.com/Vanessa219/vditor/issues/429) localStorage被禁用时，报错 `修复缺陷`
* [427](https://github.com/Vanessa219/vditor/issues/427) headings 大小调整 `改进功能`
* [422](https://github.com/Vanessa219/vditor/issues/422) inserted one line before table block(windows/Firefox) `修复缺陷`
* [425](https://github.com/Vanessa219/vditor/issues/425) 支持 flac 音频格式解析 `改进功能`
* [409](https://github.com/Vanessa219/vditor/issues/409) codeblock(mac safari) `修复缺陷`
* [407](https://github.com/Vanessa219/vditor/issues/407) cursor moving at tables(safari & firefox) `修复缺陷`
* [421](https://github.com/Vanessa219/vditor/issues/421) 添加 bilibili 视频网站解析 `改进功能`
* [420](https://github.com/Vanessa219/vditor/issues/420) 缓存时可以提供一个回调吗，我想同步到服务器上 `改进功能`
* [419](https://github.com/Vanessa219/vditor/issues/419) outline after update at smartphone `改进功能`
* [418](https://github.com/Vanessa219/vditor/issues/418) 点击侧边空白，光标会挪到尾部 `修复缺陷`
* [415](https://github.com/Vanessa219/vditor/issues/415) using local JS file `修复缺陷`
* [406](https://github.com/Vanessa219/vditor/issues/406) 相同标题内容 ID 生成问题 `修复缺陷`
* [412](https://github.com/Vanessa219/vditor/issues/412) 预览界面大纲无法定位 `修复缺陷`
* [411](https://github.com/Vanessa219/vditor/issues/411) 复制到微信公众号后代码块背景丢失 `修复缺陷`
* [410](https://github.com/Vanessa219/vditor/issues/410) not delete inline code(firfox) `修复缺陷`
* [405](https://github.com/Vanessa219/vditor/issues/405) translated mindmap into Korean `文档相关`
* [402](https://github.com/Vanessa219/vditor/issues/402) setValue 后 outline 没有渲染 `修复缺陷`
* [400](https://github.com/Vanessa219/vditor/issues/400) Heading(wysiwyg) windows firefox `修复缺陷`
* [401](https://github.com/Vanessa219/vditor/issues/401) render demo(mobile) `改进功能`
* [397](https://github.com/Vanessa219/vditor/issues/397) link(ctrl+k) at wysiwyg mode `改进功能`
* [399](https://github.com/Vanessa219/vditor/issues/399) When click empty editor pane `修复缺陷`
* [398](https://github.com/Vanessa219/vditor/issues/398) unnecessary line before ctrl+M(tables) at wysiwyg mode `修复缺陷`
* [395](https://github.com/Vanessa219/vditor/pull/395) Demo for reading external markdown text `改进功能`
* [386](https://github.com/Vanessa219/vditor/issues/386) [wysiwyg] 在代码块尾部按 arrowdown 插入空行 `改进功能`
* [396](https://github.com/Vanessa219/vditor/issues/396) click empty, append empty block `改进功能`
* [385](https://github.com/Vanessa219/vditor/issues/385) image title at wysiwyg `修复缺陷`
* [390](https://github.com/Vanessa219/vditor/issues/390) no data-marker(editing mode) `修复缺陷`
* [392](https://github.com/Vanessa219/vditor/issues/392) anchor option `改进功能`
* [389](https://github.com/Vanessa219/vditor/issues/389) marker option at preview `改进功能`
* [388](https://github.com/Vanessa219/vditor/pull/388) changed some korean i18n and demo text `文档相关`
* [383](https://github.com/Vanessa219/vditor/issues/383) 移动端移除侧边提示 `改进功能`
* [384](https://github.com/Vanessa219/vditor/issues/384) ctrl_+, ctrl_- at heading(wysiwyg) `修复缺陷`
* [321](https://github.com/Vanessa219/vditor/issues/321) 移动端如何调用toolbar的方法 `咨询提问`
* [382](https://github.com/Vanessa219/vditor/issues/382) sometimes the keyboard is hidden at smartphone `修复缺陷`
* [378](https://github.com/Vanessa219/vditor/issues/378) hover style in Mobile `修复缺陷`
* [379](https://github.com/Vanessa219/vditor/issues/379) Not sticky at IOS `修复缺陷`
* [381](https://github.com/Vanessa219/vditor/issues/381) 光标在内联数学公式中无法向下移动 `修复缺陷`
* [380](https://github.com/Vanessa219/vditor/issues/380) 修复 XSS 漏洞 `修复缺陷`
* [4](https://github.com/Vanessa219/vditor/issues/4) 添加支持思维导图的功能 `引入特性`
* [376](https://github.com/Vanessa219/vditor/issues/376) 为 markdown 添加 sanitize 设置 `引入特性`
* [375](https://github.com/Vanessa219/vditor/pull/375) upload 配置项添加额外请求参数 `引入特性`
* [372](https://github.com/Vanessa219/vditor/issues/372) 配置lineNumber为true后，代码复制按钮不出现 `修复缺陷`
* [373](https://github.com/Vanessa219/vditor/issues/373) toolbar 缺失 edit-mode 报错 `修复缺陷`
* [371](https://github.com/Vanessa219/vditor/issues/371) 列表项上下移动 `改进功能`
* [367](https://github.com/Vanessa219/vditor/issues/367) cursor up and down inside Table `改进功能`
* [368](https://github.com/Vanessa219/vditor/issues/368) Copy Paste multiline inside table `修复缺陷`
* [369](https://github.com/Vanessa219/vditor/issues/369) when paste, code can not highlight `修复缺陷`
* [370](https://github.com/Vanessa219/vditor/issues/370) Copy Paste multiline at markdown mode `改进功能`
* 文档修改
  * 为 `options.upload` 添加 `extraData` 配置
  * 添加静态方法 `mindmapRender`
  * 为 `IMarkdownConfig` 添加 `sanitize`, `listMarker`, `linkBase` 配置
  * IPreviewOptions.anchor 从 `boolean` 类型修改为 `number` 类型
  * 示例代码地址修改：static-preview.html => preview.html，static.html => b3log.org/vditor/demo/render.html
  * 添加 [Vditor](https://b3log.org/vditor) 官方首页
  * 添加缓存回调 `options.cache.after(markdown:string)`


### v3.1.23 / 2020-05-05

* [365](https://github.com/Vanessa219/vditor/issues/365) Emoji 6️⃣ `修复缺陷`
* [361](https://github.com/Vanessa219/vditor/issues/361) typing korean char. after end of code block at IR `修复缺陷`
* [358](https://github.com/Vanessa219/vditor/issues/358) cursor up and down at IR mode `修复缺陷`
* [363](https://github.com/Vanessa219/vditor/issues/363) Copy Paste (HTML2Markdown) issue `修复缺陷`
* [360](https://github.com/Vanessa219/vditor/issues/360) typing fast(code block) at IR `修复缺陷`
* [364](https://github.com/Vanessa219/vditor/issues/364) 复制粘贴过滤掉 svg 标签 `修复缺陷`
* [362](https://github.com/Vanessa219/vditor/issues/362) Export HeadingID function to JavaScript `改进功能`
* [359](https://github.com/Vanessa219/vditor/issues/359) heading anchor when copy & paste `修复缺陷`
* [357](https://github.com/Vanessa219/vditor/issues/357) 预览区透明 `修复缺陷`
* [349](https://github.com/Vanessa219/vditor/issues/349) 传统中文排版“段落开头空两格” `引入特性`
* [351](https://github.com/Vanessa219/vditor/issues/351) MathJax plugin `修复缺陷`
* [353](https://github.com/Vanessa219/vditor/issues/353) list demo at static-preview.html `文档相关`
* [350](https://github.com/Vanessa219/vditor/issues/350) 自定义渲染的方法 `引入特性`
* [345](https://github.com/Vanessa219/vditor/issues/345) 支持预览区域粘贴到公众号 `引入特性`
* [324](https://github.com/Vanessa219/vditor/issues/324) 支持多款主题预览 `引入特性`
* [325](https://github.com/Vanessa219/vditor/issues/325) 导出功能 `引入特性`
* [344](https://github.com/Vanessa219/vditor/issues/344) outline 渲染 bug `修复缺陷`
* [343](https://github.com/Vanessa219/vditor/issues/343) 添加初始化大纲展现参数 `改进功能`
* [341](https://github.com/Vanessa219/vditor/issues/341) Can not delete the image at IR mode `修复缺陷`
* [339](https://github.com/Vanessa219/vditor/issues/339) 添加静态方法 setCodeTheme, setContentTheme `改进功能`
* [316](https://github.com/Vanessa219/vditor/issues/316) 支持多端预览 `引入特性`
* [337](https://github.com/Vanessa219/vditor/issues/337) insertValue 光标错误 `修复缺陷`
* [333](https://github.com/Vanessa219/vditor/issues/333) 重新设计帮助菜单 `改进功能`
* [334](https://github.com/Vanessa219/vditor/issues/334) 重新设计关于菜单 `改进功能`
* [335](https://github.com/Vanessa219/vditor/issues/335) 块引用嵌套列表跳出问题 `修复缺陷`
* [332](https://github.com/Vanessa219/vditor/issues/332) Not working 3rd menu at smartphone `修复缺陷`
* [329](https://github.com/Vanessa219/vditor/issues/329) preview方法可选参数options.transform提示undefined错误的问题 `修复缺陷`
* [328](https://github.com/Vanessa219/vditor/issues/328) sv 模式高度错误 `修复缺陷`
* [326](https://github.com/Vanessa219/vditor/issues/326) 为工具栏添加2级和3级菜单 `改进功能`
* [323](https://github.com/Vanessa219/vditor/issues/323) setTheme 需支持代码块风格的切换 `改进功能`
* [320](https://github.com/Vanessa219/vditor/issues/320) 代码区点击复制代码时自动去掉行号 `修复缺陷`
* [314](https://github.com/Vanessa219/vditor/issues/314) 添加图片懒加载设置 `引入特性`
* [319](https://github.com/Vanessa219/vditor/issues/319) add ctrl+shift+e button to toolbar for smartphone `改进功能`
* [312](https://github.com/Vanessa219/vditor/issues/312) 支持块级元素上下移动 `引入特性`
* [318](https://github.com/Vanessa219/vditor/issues/318) 工具栏和编辑器区域对齐 `改进功能`
* [313](https://github.com/Vanessa219/vditor/issues/313) html 页面 点击禁用button 引起回调 `修复缺陷`
* [311](https://github.com/Vanessa219/vditor/issues/311) preview demo `改进功能`
* [94](https://github.com/Vanessa219/vditor/issues/94) 获取大纲内容及点击定位功能 `引入特性`
* [309](https://github.com/Vanessa219/vditor/issues/309) 添加 options.upload.setHeaders `引入特性`
* [306](https://github.com/Vanessa219/vditor/issues/306) IR mode ATX heading change `改进功能`
* [303](https://github.com/Vanessa219/vditor/issues/303) Inline HTML parsing issue `修复缺陷`
* [304](https://github.com/Vanessa219/vditor/issues/304) 为 toolbar 添加是否 pin 的配置 `引入特性`
* [296](https://github.com/Vanessa219/vditor/issues/296) 打字机模式下字数统计标签不可见 `改进功能`
* [302](https://github.com/Vanessa219/vditor/issues/302) Editing Heading(IR mode) `修复缺陷`
* [301](https://github.com/Vanessa219/vditor/issues/301) Add README in English `文档相关`
* [299](https://github.com/Vanessa219/vditor/issues/299) 表格解析异常 `修复缺陷`
* [226](https://github.com/Vanessa219/vditor/issues/226) Vulnerable to Self-XSS `修复缺陷`
* [297](https://github.com/Vanessa219/vditor/issues/297) 纯文本字数统计 `引入特性`
* [298](https://github.com/Vanessa219/vditor/pull/298) ✨ 允许开启 counter 而不设置限值 & README 优化 `引入特性`
* [295](https://github.com/Vanessa219/vditor/issues/295) 全屏模式下打字机行为异常 `修复缺陷`
* [294](https://github.com/Vanessa219/vditor/pull/294) 🐛 计算全屏 typewriterMode 位置 `修复缺陷`
* [286](https://github.com/Vanessa219/vditor/issues/286) add indent & outdent button `引入特性`
* [291](https://github.com/Vanessa219/vditor/pull/291) 🎨 改进 Counter `修复缺陷`
* [285](https://github.com/Vanessa219/vditor/issues/285) shift+tab is not working at lists `修复缺陷`
* [292](https://github.com/Vanessa219/vditor/pull/292) 🐛 全屏模式文末空白 `修复缺陷`
* [293](https://github.com/Vanessa219/vditor/issues/293) iOS Safari 快捷键显示为 Windows 版本 `修复缺陷`
* [290](https://github.com/Vanessa219/vditor/pull/290) 🎨 add minHeight `改进功能`
* [71](https://github.com/Vanessa219/vditor/issues/71) 优化移动端体验 `改进功能`
* [283](https://github.com/Vanessa219/vditor/issues/283) 添加 SetSetext 配置 `引入特性`
* [278](https://github.com/Vanessa219/vditor/issues/278) IR 细节修改 `修复缺陷`
* 文档更新
  * 添加 `options.minHeight`, `options.outline`
  * `options.counter` 修改为 `counter?: { enable: boolean; max?: number; type: "markdown" | "text"; }`
  * counter 位置移动到 toolbar 上
  * `options.hideToolbar` 修改为 `toolbarConfig: { hide?: boolean, pin?: boolean }`
  * 添加 `options.upload.setHeaders: { [key: string]: string }`
  * 添加静态方法 `outlineRender`, `setCodeTheme`, `setContentTheme`
  * 添加 lazyLoadImageRender 静态方法
  * insert line 默认快捷键由 `⌘-⇧-D` 修改为 `⌘-⇧-H`，添加下移 `⌘-⇧-D`、上移 `⌘-⇧-U` 快捷键，移除上传、预览、编辑器模式切换快捷键
  * 为 `options.toolbar` 添加 toolbar 参数，最多可进行 3 级菜单
  * 为 `options.toolbar` 添加 outdent，indent, outline, insert-after, insert-before, more，code-theme, content-theme, export
  * `setTheme` 方法添加 `conentTheme`, `codeTheme` 参数
  * `setPreviewMode` 方法移除 `preview`
  * `options.preview` 中 `maxWidth` 默认值改为 800, `mode` 移除 `preview` 选项，`markdonw` 添加 `theme`、`setext` 配置
  * IPreviewOptions 添加 `after`，`lazyLoadImage`, `markdown.theme`, `renderers`, `markdown.paragraphBeginningSpace`，移除 `theme`

### v3.0.12 / 2020-04-06

* [276](https://github.com/Vanessa219/vditor/issues/276) 当设置编辑器宽度后，模式切换导致样式错误 `修复缺陷`
* [266](https://github.com/Vanessa219/vditor/issues/266) linkToImgUrl 图片重复上传 `修复缺陷`
* [208](https://github.com/Vanessa219/vditor/issues/208) hr in Firefox `修复缺陷`
* [274](https://github.com/Vanessa219/vditor/issues/274) Toc demo at Preview `文档相关`
* [269](https://github.com/Vanessa219/vditor/issues/269) 分屏预览支持 list-style-type CSS `引入特性`
* [265](https://github.com/Vanessa219/vditor/issues/265) ir 模式中 toc， 链接引用，脚注 `引入特性`
* [271](https://github.com/Vanessa219/vditor/issues/271) options.toolbar支持自定义绑定class `引入特性`
* [267](https://github.com/Vanessa219/vditor/issues/267) 设置 codeBlockPreview false， esc 后代码块消失 `修复缺陷`
* [270](https://github.com/Vanessa219/vditor/issues/270) 支持捂脸表情 `改进功能`
* [264](https://github.com/Vanessa219/vditor/issues/264) table at IR mdoe `修复缺陷`
* [253](https://github.com/Vanessa219/vditor/issues/253) 所见即所得复制粘贴问题 `修复缺陷`
* [261](https://github.com/Vanessa219/vditor/issues/261) When link with "" and ctrl+k `修复缺陷`
* [262](https://github.com/Vanessa219/vditor/issues/262) ctrl+m... delete, and enter `修复缺陷`
* [260](https://github.com/Vanessa219/vditor/issues/260) Not working typewritermode at code block `修复缺陷`
* [250](https://github.com/Vanessa219/vditor/issues/250) 支持配置是否开启 wysiwyg 模式下代码块渲染 `引入特性`
* [258](https://github.com/Vanessa219/vditor/issues/258) wysiwyg a 元素子导航居右被挤变形 `修复缺陷`
* [212](https://github.com/Vanessa219/vditor/issues/212) Sync XMLHttpRequest Deprecation message `改进功能`
* [251](https://github.com/Vanessa219/vditor/issues/251) 所见即所得模式下，光标后图片工具层会遮挡文字 `改进功能`
* [249](https://github.com/Vanessa219/vditor/issues/249) 代码块语言选择优化 `改进功能`
* [211](https://github.com/Vanessa219/vditor/issues/211) Heading when backspace (Windows Firefox) `修复缺陷`
* [239](https://github.com/Vanessa219/vditor/issues/239) be converted after spaces in FF `修复缺陷`
* [240](https://github.com/Vanessa219/vditor/issues/240) multiple markdown at one line `修复缺陷`
* [241](https://github.com/Vanessa219/vditor/issues/241) When editing the heading, not converted using the cursor key `修复缺陷`
* [242](https://github.com/Vanessa219/vditor/issues/242) combined lists "+" and "-" `修复缺陷`
* [243](https://github.com/Vanessa219/vditor/issues/243) can not delete the table with "backspace" `修复缺陷`
* [246](https://github.com/Vanessa219/vditor/issues/246) 报错index.min.js:27 `修复缺陷`
* [248](https://github.com/Vanessa219/vditor/issues/248) enter after heading `修复缺陷`
* [235](https://github.com/Vanessa219/vditor/pull/235) 修复父元素自定义行高时工具栏垂直不居中 `修复缺陷`
* [210](https://github.com/Vanessa219/vditor/issues/210) inks with korean character(windows chrome & firefox) `修复缺陷`
* [231](https://github.com/Vanessa219/vditor/issues/231) 支持直接传入元素进行初始化 `引入特性`
* [232](https://github.com/Vanessa219/vditor/issues/232) 【IR&WYSIWYG】围栏代码块 info 部分自动完成 `引入特性`
* [230](https://github.com/Vanessa219/vditor/pull/230) 切换 IR 模式后依然展示工具栏 `改进功能`
* [27](https://github.com/Vanessa219/vditor/issues/27) 支持类似 Typora 的及时渲染模式 `引入特性`
* [229](https://github.com/Vanessa219/vditor/issues/229) 初始化时不应该自动获取焦点 `改进功能`
* [228](https://github.com/Vanessa219/vditor/pull/228) menu misplaced when vditor is not first child `改进功能`
* [227](https://github.com/Vanessa219/vditor/pull/227) add jsdoc `引入特性`
* [225](https://github.com/Vanessa219/vditor/pull/225) publish type declaration file `引入特性`
* [224](https://github.com/Vanessa219/vditor/issues/224) md2html 方法报错 `修复缺陷`
* [223](https://github.com/Vanessa219/vditor/issues/223) 下列 a 前输入 ``` b 会消失，且返回无光标 `修复缺陷`
* [222](https://github.com/Vanessa219/vditor/issues/222) The cursor does not enter when added in the middle of the list `修复缺陷`
* [221](https://github.com/Vanessa219/vditor/issues/221) 输入复选框时出现乱码 `修复缺陷`
* [220](https://github.com/Vanessa219/vditor/issues/220) 软换行前进行删除，将会变为 p `修复缺陷`
* 文档更新
  * 修改 `options.mode` 可选值为：'sv', 'wysiwyg', 'ir'
  * toolbar 中的 wysiwyg 修改为 'edit-mode'
  * id 可以传入 element
  * cache 修改为 {enable: boolean, id: string}
  * md2html 改为异步
  * 添加 `options.preview.markdown.codeBlockPreview`
  * 为 `options.toolbar` 添加 `className`
  * 添加 getCurrentMode 方法

### v2.3.0 / 2020-03-12

* [218](https://github.com/Vanessa219/vditor/issues/218) 所见即所得模式下，insertValue渲染*和~的时候似乎不是很正确 `修复缺陷`
* [217](https://github.com/Vanessa219/vditor/issues/217) ToC 添加悬浮菜单及 bug 修复 `修复缺陷`
* [216](https://github.com/Vanessa219/vditor/issues/216) subtoolbar 向下溢出 `修复缺陷`
* [215](https://github.com/Vanessa219/vditor/issues/215) lists when last enter `修复缺陷`

### v2.2.19 / 2020-03-10

* [214](https://github.com/Vanessa219/vditor/issues/214) wysiwyg heading id `引入特性`
* [206](https://github.com/Vanessa219/vditor/issues/206) combined blockquote and lists (windows firefox) `修复缺陷`
* [151](https://github.com/Vanessa219/vditor/issues/151) 支持隐藏编辑器工具栏 `引入特性`
* [121](https://github.com/Vanessa219/vditor/issues/121) 所见即所得模式支持 [ToC] `引入特性`
* [119](https://github.com/Vanessa219/vditor/issues/119) 所见即所得模式支持脚注 `引入特性`
* [55](https://github.com/Vanessa219/vditor/issues/55) 所见即所得模式支持链接引用定义`引入特性`
* [209](https://github.com/Vanessa219/vditor/pull/209) 支持 Graphviz `引入特性`
* [207](https://github.com/Vanessa219/vditor/issues/207) heading at first time(windows firefox) `修复缺陷`
* [205](https://github.com/Vanessa219/vditor/issues/205) not working typewrite mode (windows firefox) `修复缺陷`
* [204](https://github.com/Vanessa219/vditor/issues/204) Empty Enter in Firefox `修复缺陷`
* [203](https://github.com/Vanessa219/vditor/issues/203) when cache:false, use cache `修复缺陷`
* [199](https://github.com/Vanessa219/vditor/issues/199) heading at first time(windows firefox) `修复缺陷`
* [202](https://github.com/Vanessa219/vditor/issues/202) 第一次进入代码块后 ctrl+a 无作用 `修复缺陷`
* [201](https://github.com/Vanessa219/vditor/issues/201) table (windows firefox) `修复缺陷`
* [200](https://github.com/Vanessa219/vditor/issues/200) copy in wysiwyg bug `修复缺陷`
* [197](https://github.com/Vanessa219/vditor/issues/197) 禁用编辑器后，工具栏未被禁用 `修复缺陷`
* [196](https://github.com/Vanessa219/vditor/issues/196) Headings command+alt+1 at safari(Mac) `修复缺陷`
* [195](https://github.com/Vanessa219/vditor/pull/195) added korean i18n `引入特性`
* [194](https://github.com/Vanessa219/vditor/issues/194) Lists (Firefox Compatibility) `修复缺陷`
* [193](https://github.com/Vanessa219/vditor/issues/193) Links (Firefox Compatibility) `修复缺陷`
* [192](https://github.com/Vanessa219/vditor/issues/192) Heading (Firefox Compatibility) `修复缺陷`
* [191](https://github.com/Vanessa219/vditor/issues/191) backspace problem(Firefox Compatibility) `修复缺陷`
* [188](https://github.com/Vanessa219/vditor/issues/188) korean character composition at mac chrome `改进功能`
* [187](https://github.com/Vanessa219/vditor/issues/187) ctrl+b, ctrl+i `修复缺陷`
* [185](https://github.com/Vanessa219/vditor/issues/185) Safari 兼容性修复 `改进功能`
* [137](https://github.com/Vanessa219/vditor/issues/137) [suggestion] ctrl+g behavior `改进功能`
* [182](https://github.com/Vanessa219/vditor/issues/182) 支持 Setext 标题 `改进功能`
* [181](https://github.com/Vanessa219/vditor/issues/181) GFM Example52,54 - Setext 支持 `改进功能`
* [180](https://github.com/Vanessa219/vditor/issues/180) GFM Example 31 `修复缺陷`
* [179](https://github.com/Vanessa219/vditor/issues/179) GFM Example 19, 40, 57 `修复缺陷`
* [178](https://github.com/Vanessa219/vditor/issues/178) 链接文本修改方式改进 `改进功能`
* [177](https://github.com/Vanessa219/vditor/issues/177) can not input alt+ctrl+[number] at first time `修复缺陷`
* [176](https://github.com/Vanessa219/vditor/issues/176) cList+blockquote `修复缺陷`
* [176](https://github.com/Vanessa219/vditor/issues/176) cList+blockquote `修复缺陷`
* [173](https://github.com/Vanessa219/vditor/issues/173) lists start with 1) and enter error `修复缺陷`
* [172](https://github.com/Vanessa219/vditor/issues/172) space between inline codes `修复缺陷`
* [171](https://github.com/Vanessa219/vditor/issues/171) space between inline codes `修复缺陷`
* [170](https://github.com/Vanessa219/vditor/issues/170) ctrl+b with shift+enter `修复缺陷`
* [169](https://github.com/Vanessa219/vditor/issues/169) 五线谱渐强减弱无法显示 `修复缺陷`
* [168](https://github.com/Vanessa219/vditor/issues/168) insertValue 图片解析问题 `修复缺陷`
* [166](https://github.com/Vanessa219/vditor/issues/166) 加粗、强调、删除线合并 `修复缺陷`
* [165](https://github.com/Vanessa219/vditor/issues/165) wysiwyg 内容太长时辅助工具条可以悬浮在顶部 `改进功能`
* [163](https://github.com/Vanessa219/vditor/issues/163) 链接结尾回车不应该复制到下一行 `修复缺陷`
* [162](https://github.com/Vanessa219/vditor/issues/162) 中文标题删除 `修复缺陷`
* [158](https://github.com/Vanessa219/vditor/issues/158) tab key is not working when no text `修复缺陷`
* [156](https://github.com/Vanessa219/vditor/issues/156) li 缩进后没有渲染代码块 `修复缺陷`
* [155](https://github.com/Vanessa219/vditor/issues/155) blockquote 插入光标错误 `修复缺陷`
* [154](https://github.com/Vanessa219/vditor/issues/154) the cursor is disapeared after tab pressed at editor mode `修复缺陷`
* [153](https://github.com/Vanessa219/vditor/issues/153) Heading toolbar is not working `修复缺陷`
* [150](https://github.com/Vanessa219/vditor/issues/150) [suggestion] deleting heading with backspace `改进功能`
* [149](https://github.com/Vanessa219/vditor/issues/149) [suggestion] UI Consistency `改进功能`
* [148](https://github.com/Vanessa219/vditor/issues/148) 任务列表退格删除问题 `修复缺陷`
* [147](https://github.com/Vanessa219/vditor/issues/147) [suggestion] ctrl+l, ctrl+o, ctrl + j add insert line `改进功能`
* [146](https://github.com/Vanessa219/vditor/issues/146) [suggestion] ctrl+k `改进功能`
* [145](https://github.com/Vanessa219/vditor/issues/145) [suggestion] ctrl+shift+j toggle checked `改进功能`
* [144](https://github.com/Vanessa219/vditor/issues/144) ctrl+shift+. 插入 blockquote `改进功能`
* [143](https://github.com/Vanessa219/vditor/issues/143) [suggestion] ctrl+m `改进功能`
* [142](https://github.com/Vanessa219/vditor/issues/142) lists when indented at wysiwyg mode `修复缺陷`
* [141](https://github.com/Vanessa219/vditor/issues/141) toolbar 添加箭头，默认表情修改 `改进功能`
* [140](https://github.com/Vanessa219/vditor/issues/140) *** after shift+enter `修复缺陷`
* [139](https://github.com/Vanessa219/vditor/issues/139) toggle after ===, enter `修复缺陷`
* [138](https://github.com/Vanessa219/vditor/issues/138) ctrl+b, ctrl+i, enter with no text `修复缺陷`
* [136](https://github.com/Vanessa219/vditor/issues/136) ⌘ and Ctrl is different at MacOS `修复缺陷`
* [135](https://github.com/Vanessa219/vditor/issues/135) can not delete the first char. at first field of links `改进功能`
* [134](https://github.com/Vanessa219/vditor/issues/134) 支持 linkToImgUrl `引入特性`
* [133](https://github.com/Vanessa219/vditor/issues/133) MathJax 渲染无法修改 `修复缺陷`
* [132](https://github.com/Vanessa219/vditor/issues/132) 添加 md 配置项 `引入特性`
* [131](https://github.com/Vanessa219/vditor/issues/131) 代码块下输入中文 bug `修复缺陷`
* [130](https://github.com/Vanessa219/vditor/issues/130) 任务列表跳出 `修复缺陷`
* [129](https://github.com/Vanessa219/vditor/issues/129) 分隔线规则问题 `修复缺陷`
* [128](https://github.com/Vanessa219/vditor/issues/128) 在分隔线之间输入的问题 `修复缺陷`
* [127](https://github.com/Vanessa219/vditor/issues/127) more keyboard shortcut after ctrl+h `改进功能`
* [125](https://github.com/Vanessa219/vditor/issues/125) ctrl+l, ** `修复缺陷`
* 文档更新
  * 移除 `IPreviewOptions` 中的 `className`
  * 为 `IPreviewOptions` 添加 `theme` 选项
  * `insertValue` 添加 `render` 参数，以便配置是否需要进行 Markdown 处理
  * 将异步方法变为同步
  * 引用快捷键修改为 <kbd>Ctrl-;</kbd>
  * 移除 index-preview.html, index-preview.js 文件
  * 添加 `graphvizRender` 方法
  * 添加 `option.preview.markdown.toc/footnotes` 配置选项
  * 添加 `option.hideToolbar` 配置选项
  * `options.preview.markdown.autoSpace/chinesePunct/fixTermTypo` 默认值设置为 `false`

### v2.1.15 / 2020-02-09

* [123](https://github.com/Vanessa219/vditor/issues/123) 加粗、强调前导空格问题 `修复缺陷`
* [122](https://github.com/Vanessa219/vditor/issues/122) 在 p 中插入代码块 bug `修复缺陷`
* [118](https://github.com/Vanessa219/vditor/issues/118) Firefox no cursor when ctrl+b pressed `修复缺陷`
* [117](https://github.com/Vanessa219/vditor/issues/117) cursor moving problem near inline code `修复缺陷`
* [115](https://github.com/Vanessa219/vditor/issues/115) codeblock difference between ``` and ctrl+u `修复缺陷`
* [114](https://github.com/Vanessa219/vditor/issues/114) 有序列表合并问题 `修复缺陷`
* [113](https://github.com/Vanessa219/vditor/issues/113) 分隔线、标题在换行时处理 `改进功能`
* [112](https://github.com/Vanessa219/vditor/issues/112) 列表项加代码块问题 `修复缺陷`
* [111](https://github.com/Vanessa219/vditor/issues/111) ctrl+b, ctrl+i, ctrl+s not working at starting and combining `修复缺陷`
* [109](https://github.com/Vanessa219/vditor/issues/109) tab key at list `改进功能`
* [108](https://github.com/Vanessa219/vditor/issues/108) 行级代码问题 `修复缺陷`
* [107](https://github.com/Vanessa219/vditor/issues/107) 删除线解析问题 `修复缺陷`
* [105](https://github.com/Vanessa219/vditor/issues/105) Link(ctrl+k) `改进功能`
* [104](https://github.com/Vanessa219/vditor/issues/104) image tag at wysiwyg mode `修复缺陷`
* [103](https://github.com/Vanessa219/vditor/issues/103) cell alignment `修复缺陷`
* [102](https://github.com/Vanessa219/vditor/issues/102) minus number at table(not important) `修复缺陷`
* [101](https://github.com/Vanessa219/vditor/issues/101) 提供 setTheme(theme: "dark" | "classic") 方法 `引入特性`
* [100](https://github.com/Vanessa219/vditor/issues/100) inline-math `修复缺陷`
* [99](https://github.com/Vanessa219/vditor/issues/99) a 中斜体/粗体时 toolbar 不显示 `修复缺陷`
* [96](https://github.com/Vanessa219/vditor/issues/96) 所见即所得模式下的任务列表Bug `修复缺陷`
* [95](https://github.com/Vanessa219/vditor/issues/95) setVaule 和 初始化时，不触发 input 事件 `改进功能`
* [93](https://github.com/Vanessa219/vditor/issues/93) Headers with = and - `修复缺陷`
* [92](https://github.com/Vanessa219/vditor/issues/92) 空行回车可以逐层跳出引用 `改进功能`
* [89](https://github.com/Vanessa219/vditor/issues/89) 数学公式支持 MathJax `引入特性`
* [88](https://github.com/Vanessa219/vditor/issues/88) Bold `修复缺陷`
* [87](https://github.com/Vanessa219/vditor/issues/87) inside cell `修复缺陷`
* [85](https://github.com/Vanessa219/vditor/issues/85) ctrl-z & 重写缩进 `修复缺陷`
* [84](https://github.com/Vanessa219/vditor/issues/84) 光标在 emoji 后的空格后无法对其进行删除 `修复缺陷`
* [83](https://github.com/Vanessa219/vditor/issues/83) 所见即所得从菜单插入链接用对话框 `改进功能`
* [82](https://github.com/Vanessa219/vditor/issues/82) 文字拖动 `修复缺陷`
* [80](https://github.com/Vanessa219/vditor/issues/80) 第一次 ctrl+z 无法设置光标 `修复缺陷`
* [79](https://github.com/Vanessa219/vditor/issues/79) 链接所见即所得渲染问题 `改进功能`
* [78](https://github.com/Vanessa219/vditor/issues/78) 列表换行处理问题 `修复缺陷`
* [77](https://github.com/Vanessa219/vditor/issues/77) 上传文件处理 `改进功能`
* [75](https://github.com/Vanessa219/vditor/issues/75) 表格输入自动完成优化 `改进功能`
* [74](https://github.com/Vanessa219/vditor/issues/74) anchor 中移除 . `改进功能`
* [73](https://github.com/Vanessa219/vditor/issues/73) 添加链接卡片样式 `引入特性`
* [76](https://github.com/Vanessa219/vditor/issues/76) 菜单选择图片类 Emoji 无法直接显示 `修复缺陷`
* [70](https://github.com/Vanessa219/vditor/issues/70) 所见即所得模式下Table按钮重复点击会导致table嵌套，另外希望标题支持快捷键调整大小 `引入特性`
* [69](https://github.com/Vanessa219/vditor/issues/69) 渲染块按 esc 可以进行退出代码块进行预览 `改进功能`
* [68](https://github.com/Vanessa219/vditor/issues/68) 列表标记符自动优化 `改进功能`
* [67](https://github.com/Vanessa219/vditor/issues/67) code、inline-math、inline-html 优化 `改进功能`
* [66](https://github.com/Vanessa219/vditor/issues/66) 表格优化 `改进功能`
* [65](https://github.com/Vanessa219/vditor/issues/65) 任务列表回车、删除优化 `改进功能`
* [60](https://github.com/Vanessa219/vditor/issues/60) 行内代码删除错误 `修复缺陷`
* 文档更新
  * 添加 options.upload.file 方法
  * options.preview 修改，支持 MathJax 配置
  * 移除 mathRenderByLute 方法
  * 添加 setTheme 方法，classic.scss -> index.scss

### v2.0.15 / 2020-01-11

* [64](https://github.com/Vanessa219/vditor/issues/64) 所见即所得模式代码块 % 问题 `修复缺陷`
* [62](https://github.com/Vanessa219/vditor/issues/62) 任务列表光标位置 `修复缺陷`
* [59](https://github.com/Vanessa219/vditor/issues/59) 任务列表 bug `修复缺陷`
* [58](https://github.com/Vanessa219/vditor/issues/58) 表格内换行处理问题 `修复缺陷`
* [57](https://github.com/Vanessa219/vditor/issues/57) * a*b* 后换行错误 `修复缺陷`
* [56](https://github.com/Vanessa219/vditor/issues/56) 图片 alt 属性不应该带光标位置 `修复缺陷`
* [54](https://github.com/Vanessa219/vditor/issues/54) 代码块优化 `引入特性`
* [53](https://github.com/Vanessa219/vditor/issues/53) 图片 title 丢失问题 `修复缺陷`
* [52](https://github.com/Vanessa219/vditor/issues/52) 下划线强调标记符失效 `修复缺陷`
* [51](https://github.com/Vanessa219/vditor/issues/51) 引用多层嵌套无法一次性回到最外层 `引入特性`
* [50](https://github.com/Vanessa219/vditor/issues/50) 标题前的段落结尾为 `\n` 时，标题的选中和取消会关联到 `\n` `修复缺陷`
* [48](https://github.com/Vanessa219/vditor/issues/48) H6 回车 解析问题 `修复缺陷`
* [47](https://github.com/Vanessa219/vditor/issues/47) <details> 改进 `改进功能`
* [46](https://github.com/Vanessa219/vditor/issues/46) add row 添加快捷键 `引入特性`
* [45](https://github.com/Vanessa219/vditor/issues/45) 为列表 indent 和 outdent 添加快捷键 `引入特性`
* [44](https://github.com/Vanessa219/vditor/issues/44) Unorderlist + Link 会缩进 `修复缺陷`
* [43](https://github.com/Vanessa219/vditor/issues/43) When copy & paste the link `修复缺陷`
* [42](https://github.com/Vanessa219/vditor/issues/42) 在内联数学公式前进行删除操作会删除公式 `修复缺陷`
* [41](https://github.com/Vanessa219/vditor/issues/41) wysiwyg 切换后，列表紧凑模式错误 `修复缺陷`
* [40](https://github.com/Vanessa219/vditor/issues/40) 列表 marker 错误 `修复缺陷`
* [39](https://github.com/Vanessa219/vditor/issues/39) 所见即所得模式录音bug `修复缺陷`
* [38](https://github.com/Vanessa219/vditor/issues/38) 有序列表顺序错误 `修复缺陷`
* [37](https://github.com/Vanessa219/vditor/issues/37) 为 wysiwyg 代码块添加快捷键 `引入特性`
* [36](https://github.com/Vanessa219/vditor/issues/36) two 'enter' at code block `修复缺陷`
* [35](https://github.com/Vanessa219/vditor/issues/35) no cursor after tab `修复缺陷`
* [33](https://github.com/Vanessa219/vditor/issues/33) 插入链接优化 `improvement`
* [32](https://github.com/Vanessa219/vditor/issues/32) 反斜杠转义处理 `修复缺陷`
* [31](https://github.com/Vanessa219/vditor/issues/31) merge list `bug`
* [30](https://github.com/Vanessa219/vditor/issues/30) 添加 option.value `enhancement`
* [29](https://github.com/Vanessa219/vditor/issues/29) 添加 debugger，为开发时显示日志 `enhancement`
* [28](https://github.com/Vanessa219/vditor/issues/28) wysiwyg 时代码块、流程图等直接进行渲染，不展示源码 `enhancement`
* [26](https://github.com/Vanessa219/vditor/issues/26) wysiwyg 性能优化 `enhancement`
* [25](https://github.com/Vanessa219/vditor/issues/25) wysiwyg 表格添加居中居左居右 `enhancement`
* [24](https://github.com/Vanessa219/vditor/issues/24) wysiwyg 块工具栏添加文字说明 `enhancement`
* [23](https://github.com/Vanessa219/vditor/issues/23) When code copied and pasted.... `bug`
* [2](https://github.com/Vanessa219/vditor/issues/2) 所见即所得 `enhancement`
* 文档更新
  * 添加 option.mode?: "wysiwyg-show" | "markdown-show" | "wysiwyg-only" | "markdown-only" 参数
  * 添加 options.debugger
  * 添加 options.value

### v1.10.11 / 2019-12-12

* [20](https://github.com/Vanessa219/vditor/issues/20) 报错:Lute is not defined `bug`
* [19](https://github.com/Vanessa219/vditor/issues/19) CDN 切换优化 `enhancement`
* [18](https://github.com/Vanessa219/vditor/issues/18) 菜单栏上的按钮会触发 form 提交事件 `bug`
* [17](https://github.com/Vanessa219/vditor/issues/17) tip 会遮挡住输入框的上部 `enhancement`
* [16](https://github.com/Vanessa219/vditor/issues/16) 复制代码按钮错误 `bug`
* [14](https://github.com/Vanessa219/vditor/issues/14) Vditor.preview不能渲染 `bug`
* [13](https://github.com/Vanessa219/vditor/issues/13) 编辑到最底部时，回车不会滚动到最下面 `bug`
* [12](https://github.com/Vanessa219/vditor/issues/12) 代码渲染问题，抛出KaTeX的错误信息。 `question`
* [11](https://github.com/Vanessa219/vditor/issues/11) 添加 CDN 配置  `enhancement`
* [10](https://github.com/Vanessa219/vditor/issues/10) block code 拷贝后变为 inline code `bug`
* [9](https://github.com/Vanessa219/vditor/issues/9) 没有预览界面时依旧出现预览耗时提示 `bug`
* [1](https://github.com/Vanessa219/vditor/issues/1) 上传时支持 xhr.setRequestHeader 设置 `enhancement`
* [172](https://github.com/b3log/vditor/issues/172) 上传改进  `enhancement`
* [171](https://github.com/b3log/vditor/issues/171) 编辑器在生成 preview 之前，添加处理函数  `feature`
* [170](https://github.com/b3log/vditor/issues/170) 新增内联数学公式开关 `enhancement`
* [168](https://github.com/b3log/vditor/issues/168) highlightRender报错 `invalid`
* [167](https://github.com/b3log/vditor/issues/167) withCredentials（跨域传递 cookie） `feature`
* [166](https://github.com/b3log/vditor/issues/166) typewriterMode 为 false 时，preview 区域不会同步滚动 `bug`
* 文档更新
  * public static mermaidRender(element: HTMLElement, className?: string)
  * hotkey 和 setSelection 方法不支持 wysiwyg
  * setValue 参数改为 markdown
  * 添加 options.upload.headers
  * 为 options, IPreviewOptions, highlightRender, mathRenderByLute, mathRender, abcRender, chartRender, mermaidRender 添加 cdn

### v1.9.7 / 2019-11-11

* [165](https://github.com/b3log/vditor/issues/165) 1个数学公式支持有问题 `question`
* [164](https://github.com/b3log/vditor/issues/164) 当文本内容过多时，卡顿的问题 `duplicate`
* [163](https://github.com/b3log/vditor/issues/163) 为标题添加锚点 `feature`
* [162](https://github.com/b3log/vditor/issues/162) 没有使用后端渲染时，编辑器卡顿 `bug`
* [160](https://github.com/b3log/vditor/issues/160) 添加 `speechRender` 方法 `feature`
* [159](https://github.com/b3log/vditor/issues/159) Vditor.preview方法在页面中渲染textarea内markdown代码无效 `invalid`
* [157](https://github.com/b3log/vditor/issues/157) 初始化后添加回调方法 `options.after` `feature`
* [156](https://github.com/b3log/vditor/issues/156) 语法高亮添加行号配置 `options.preview.hljs.lineNumber` `feature`
* [155](https://github.com/b3log/vditor/issues/155) preview 方法支持多次渲染 `enhancement`
* [154](https://github.com/b3log/vditor/issues/154) 流程图写代码对新手来说太难了建议 `question`
* [153](https://github.com/b3log/vditor/issues/153) Markdown 渲染空格问题 `bug`
* [152](https://github.com/b3log/vditor/issues/152) 直接调用 getHTML 抛错 `bug`
* [151](https://github.com/b3log/vditor/issues/151) Xcode 复制粘贴后换行增加 `bug`
* [150](https://github.com/b3log/vditor/issues/150) 加粗、斜体、删除线等功能按钮无法对选中的内容进行修改 `bug`

### v1.8.16 / 2019-10-08

* [144](https://github.com/b3log/vditor/issues/144) 编辑器内容为空时，placeholder 不显示 `bug`
* [143](https://github.com/b3log/vditor/issues/143) 为编辑器底部空白添加配置项 `enhancement`
* [142](https://github.com/b3log/vditor/issues/142) setPreviewMode 方法失效 `bug`
* [141](https://github.com/b3log/vditor/issues/141) Safari 中代码块换行 `bug`
* [140](https://github.com/b3log/vditor/issues/140) Scroll to the cursor position after pasting `bug`
* [139](https://github.com/b3log/vditor/issues/139) The cursor position is incorrect when ctrl+z is pressed `bug`
* [138](https://github.com/b3log/vditor/issues/138) markdown 中长表格支持滚动预览 `enhancement`
* [137](https://github.com/b3log/vditor/issues/137) 整理 highlight.js 和 chroma，以便统一 preview.hljs.style 的设置 `enhancement`
* [136](https://github.com/b3log/vditor/issues/136) 添加 AST 展示 `feature`
* [135](https://github.com/b3log/vditor/issues/135) 数学公式错误打印到预览区域 `feature`
* [134](https://github.com/b3log/vditor/issues/134) 数学公式问题 `question`
* [133](https://github.com/b3log/vditor/issues/133) Inline Katex `question`
* [132](https://github.com/b3log/vditor/issues/132) emoji and table `question`
* [131](https://github.com/b3log/vditor/issues/131) 上传失败时，内容没有清空 `bug`
* [130](https://github.com/b3log/vditor/issues/130) 代码部分支持长代码拖动预览 `enhancement`
* [128](https://github.com/b3log/vditor/issues/128) customEmoji 在代码块中不应该被转换 `enhancement`
* [126](https://github.com/b3log/vditor/issues/126) /src/ts/preview/index.ts 29 行报错 `bug`
* [125](https://github.com/b3log/vditor/issues/125) Image 添加最大宽度 `feature`
* [124](https://github.com/b3log/vditor/issues/124) 菜单栏按钮在 iPhone 中无法正常工作 `bug`
* [123](https://github.com/b3log/vditor/issues/123) 添加 format 功能 `feature`
* [122](https://github.com/b3log/vditor/issues/122) 添加 ~~emojiRender~~ 和 highlightRender 接口 `feature`
* [120](https://github.com/b3log/vditor/issues/120) markdown-it 切换为 lute `enhancement`
* [119](https://github.com/b3log/vditor/issues/119) 提供服务端返回数据格式化接口 `feature`
* [117](https://github.com/b3log/vditor/issues/117) 支持站点、视频、音频解析 `feature`
* [112](https://github.com/b3log/vditor/issues/112) :xxx: 需根据对应的 emoji 渲染为 emoji，而非 :xxx: `feature`

### v1.7.25 / 2019-08-29

* [116](https://github.com/b3log/vditor/issues/116) Vditor 解析`&emsp;`等空格相关的内容解析完后,光标会回到头部 `question`
* [115](https://github.com/b3log/vditor/issues/115) 测试 issues 变 0 `invalid`
* [114](https://github.com/b3log/vditor/issues/114) 封装 Preview `enhancement`
* [113](https://github.com/b3log/vditor/issues/113) emoji 整理 `enhancement`
* [111](https://github.com/b3log/vditor/issues/111) emoji problem `bug`
* [110](https://github.com/b3log/vditor/issues/110) 支持 Word 粘贴 `feature`
* [109](https://github.com/b3log/vditor/issues/109) 移除 option.editorName 变量 `bug`
* [108](https://github.com/b3log/vditor/issues/108) hint.emoji 支持自定义 `feature`
* [107](https://github.com/b3log/vditor/issues/107) custom emoji "trollface" & "huaji" is not working at demo mode `bug`
* [106](https://github.com/b3log/vditor/issues/106) 添加 Chroma 样式 `feature`
* [105](https://github.com/b3log/vditor/issues/105) firefox 兼容性 `bug`
* [104](https://github.com/b3log/vditor/issues/104) vs code 粘贴代码问题 `bug`
* [103](https://github.com/b3log/vditor/issues/103) 光标位置应在正中间 `feature`
* [102](https://github.com/b3log/vditor/issues/102) 安装依赖后自动删除已有的依赖 `question`
* [101](https://github.com/b3log/vditor/issues/101) video 标签移动端溢出 `enhancement`
* [100](https://github.com/b3log/vditor/issues/100) esc/选中工具栏中的表情或标题后输入框中的 at 及 emoji 的提示应消失 `bug`
* [98](https://github.com/b3log/vditor/issues/98) 支持 shift + tab `feature`
* [99](https://github.com/b3log/vditor/issues/99) esc/选中工具栏中的表情或标题后输入框中的 at 及 emoji 的提示应消失 `bug`
* [97](https://github.com/b3log/vditor/issues/97) 添加五线谱支持 `feature`
* [96](https://github.com/b3log/vditor/issues/96) 工具栏没有配置 preview, both, redo, undo 在其他操作时会报错 `bug`
* [95](https://github.com/b3log/vditor/issues/95) 1.6.x 细节 bug 修改 `bug`
* [94](https://github.com/b3log/vditor/issues/94) 数学公示支持源码查看 `feature`
* [93](https://github.com/b3log/vditor/issues/93) 新增预览模式设置接口 `feature`
* [92](https://github.com/b3log/vditor/issues/92) 现在toolbar里面有演示的按钮吗 `question`
* [91](https://github.com/b3log/vditor/issues/91) No default jsDelivr CDN file set `development`
* [90](https://github.com/b3log/vditor/issues/90) 编辑区域底部留白且光标所在位置应在可视区域内 `feature`
* [89](https://github.com/b3log/vditor/issues/89) 自定义 toolbar 事件、添加按钮到 toolbar 上 `feature`
* [88](https://github.com/b3log/vditor/issues/88) resize 优化 `enhancement`
* [87](https://github.com/b3log/vditor/issues/87) 获取文本时对 HTML 实体进行转换 `bug`
* [86](https://github.com/b3log/vditor/issues/86) 代码分包优化 `feature`
* [85](https://github.com/b3log/vditor/issues/85) 改善提示且提供提示接口 `feature`
* [84](https://github.com/b3log/vditor/issues/84) 支持全屏预览 `feature`

### v1.6.12 / 2019-08-04

* [83](https://github.com/b3log/vditor/issues/83) 升级 markdown-it `dependencies`
* [82](https://github.com/b3log/vditor/issues/82) textarea 修改为带 contenteditable 属性的 div `development`
* [81](https://github.com/b3log/vditor/issues/81) toolbar.hotkey 添加 shift 可选配置 `feature`
* [80](https://github.com/b3log/vditor/issues/80) 移除第三方依赖库版本号 `enhancement`
* [79](https://github.com/b3log/vditor/issues/79) 重置内容中的 ul 样式 `enhancement`
* [78](https://github.com/b3log/vditor/issues/78) npx webpack出现错误 `bug`
* [77](https://github.com/b3log/vditor/issues/77) 发布一个bower版本 `development`
* [76](https://github.com/b3log/vditor/issues/76) Bump lodash from 4.17.11 to 4.17.14 `dependencies`
* [75](https://github.com/b3log/vditor/issues/75) 增强 emoji 配置的容错性及 UI 细节改进 `enhancement`
* [74](https://github.com/b3log/vditor/issues/74) 上传错误处理文案与性能提示冲突 `bug`
* [68](https://github.com/b3log/vditor/issues/68) 1 high severity vulnerability: vditor > mermaid `development`
* [61](https://github.com/b3log/vditor/issues/61) 支持简单的快捷键 `feature`

### v1.5.12 / 2019-07-09

* [73](https://github.com/b3log/vditor/issues/73) iframe 添加 max-width `enhancement`
* [72](https://github.com/b3log/vditor/issues/72) 当编辑器父元素为 position: fix 时 hit 计算错误 `bug`
* [71](https://github.com/b3log/vditor/issues/71) new 之前应保证该 id 元素在 html 中已经渲染 `question`
* [70](https://github.com/b3log/vditor/issues/70) 建议删除CDN和代码中的Dynamic Import `invalid`
* [69](https://github.com/b3log/vditor/issues/69) Assets 文件夹介绍 `question`
* [67](https://github.com/b3log/vditor/issues/67) 长文本粘贴性能改进 `enhancement`
* [66](https://github.com/b3log/vditor/issues/66) 上传按钮问题  `bug`
* [65](https://github.com/b3log/vditor/issues/65) options.upload.linkToImgUrl 配置错误提示  `enhancement`
* [64](https://github.com/b3log/vditor/issues/64) 表情太多需要滚动条 `enhancement`
* [63](https://github.com/b3log/vditor/issues/63) 粘贴时 html2md 和 md2html 保持一致  `bug`
* [62](https://github.com/b3log/vditor/issues/62) 升级 highlight.js 到 9.15.8 `development`
* [58](https://github.com/b3log/vditor/issues/58) 添加图表支持 `feature`

### v1.4.7 / 2019-06-06

* [60](https://github.com/b3log/vditor/issues/60) type 完善 `development`
* [59](https://github.com/b3log/vditor/issues/59) Bump fstream from 1.0.11 to 1.0.12 `dependencies`
* [57](https://github.com/b3log/vditor/issues/57) ios移动端兼容 `question`
* [56](https://github.com/b3log/vditor/issues/56) 展现样式完善 `enhancement`
* [55](https://github.com/b3log/vditor/issues/55) 如何设置图片上传的路径 `question`
* [54](https://github.com/b3log/vditor/issues/54) 在使用Vditor时，如何做到支持粘贴图片的？ `question`
* [53](https://github.com/b3log/vditor/issues/53) 升级 katex 0.10.1 => 0.10.2 `enhancement`
* [52](https://github.com/b3log/vditor/issues/52) 图片 emoji 对不齐 `enhancement`
* [51](https://github.com/b3log/vditor/issues/51) 剪切板中 text/html 大于 106496 时强制使用 text/plain `enhancement`
* [50](https://github.com/b3log/vditor/issues/50) 鼠标移动到 emoji 上添加变大及提示效果 `enhancement`
* [49](https://github.com/b3log/vditor/issues/49) 添加 md2html 接口 `feature`
* [48](https://github.com/b3log/vditor/issues/48) 修改 emoji 中的 hash 值 `bug`

### v1.3.5 / 2019-05-04

* [47](https://github.com/b3log/vditor/issues/47) Upgrade tar to version 4.4.2 or later `development`
* [46](https://github.com/b3log/vditor/issues/46) 注脚解析的讨论 `question`
* [45](https://github.com/b3log/vditor/issues/45) 上传图片进行容错处理 `enhancement`
* [44](https://github.com/b3log/vditor/issues/44) toolbar将emoji插件去掉之后报错 `bug`
* [43](https://github.com/b3log/vditor/issues/43) ~~支持字体样式~~ `question`
* [42](https://github.com/b3log/vditor/issues/42) 支持 CDN 快速切换 `feature`
* [41](https://github.com/b3log/vditor/issues/41) jsDelivr 证书过期解决方案 `question`
* [40](https://github.com/b3log/vditor/issues/40) 运行命令合并 `development`
* [39](https://github.com/b3log/vditor/issues/39) 拷贝行内代码，外围空格消失 `enhancement`

### v1.2.10 / 2019-04-04

* [38](https://github.com/b3log/vditor/issues/38) firefox 中代码块点击复制会回到顶部 `bug`
* [37](https://github.com/b3log/vditor/issues/37) chrome 地址栏链接复制处理 `enhancement`
* [36](https://github.com/b3log/vditor/issues/36) 和 markdown-http 保持一致，开启软换行 `enhancement`
* [35](https://github.com/b3log/vditor/issues/35) 添加 handshake 🤝 emoji `enhancement`
* [34](https://github.com/b3log/vditor/issues/34) 适配代码高亮黑色系列主题 `enhancement`
* [33](https://github.com/b3log/vditor/issues/33) 添加 options.upload.handler 接口 `feature`
* [32](https://github.com/b3log/vditor/issues/32) 添加 options.upload.validate 接口 `feature`

### v1.1.11 / 2019-03-21

* [31](https://github.com/b3log/vditor/issues/31) 添加 vditor-reset class `feature`
* [30](https://github.com/b3log/vditor/issues/30) 支持 task list `feature`
* [29](https://github.com/b3log/vditor/issues/29) 代码块添加复制 `feature`
* [28](https://github.com/b3log/vditor/issues/28) 编辑器中按下Ctrl+s 会出现字符 `question`
* [27](https://github.com/b3log/vditor/issues/27) 支持时序图渲染和甘特图  `feature`
* [26](https://github.com/b3log/vditor/issues/26) 支持流程图渲染 `feature`
* [25](https://github.com/b3log/vditor/issues/25) 支持数学公式渲染 `feature`
* [24](https://github.com/b3log/vditor/issues/24) markdown 不支持多行公式块 `enhancement`

### v1.0.0 / 2019-03-13

* [15](https://github.com/b3log/vditor/issues/15) 添加测试用例 `development`
* [9](https://github.com/b3log/vditor/issues/9) 支持前端预览 md `enhancement`

### v0.4.0 / 2019-03-06

* [23](https://github.com/b3log/vditor/issues/23) 支持 tab `feature`
* [22](https://github.com/b3log/vditor/issues/22) 全屏默认快捷键修改 `enhancement`
* [21](https://github.com/b3log/vditor/issues/21) API 改进 `feature`
* [20](https://github.com/b3log/vditor/issues/20) 添加 doge 表情 `enhancement`

### v0.2.5 / 2019-02-19

* [19](https://github.com/b3log/vditor/issues/19) emoji 样式修改 `theme`
* [18](https://github.com/b3log/vditor/issues/18) 使用 cdn.jsdelivr.net `development`
* [17](https://github.com/b3log/vditor/issues/17) 添加 emojiPath 选项 `enhancement`
* [16](https://github.com/b3log/vditor/issues/16) 期待添加滑稽表情 `enhancement`
* [14](https://github.com/b3log/vditor/issues/14) 添加 lint `development`
* [13](https://github.com/b3log/vditor/issues/13) any 修改 `development`

### v0.1.8 / 2019-02-14

* [12](https://github.com/b3log/vditor/issues/12") 全屏后，preview tip 位置错误 `bug`
* [11](https://github.com/b3log/vditor/issues/11") npm 中加入源码，以便有需要的可直接进行打包优化 `enhancement`
* [10](https://github.com/b3log/vditor/issues/10") 录音支持 Safari `enhancement`
* [8](https://github.com/b3log/vditor/issues/8") 工具栏浮动问题 `bug`
* [7](https://github.com/b3log/vditor/issues/7") 添加上传文件名安全过滤接口 `enhancement`
* [6](https://github.com/b3log/vditor/issues/6") 添加窗口 resize 回调 `enhancement`
* [5](https://github.com/b3log/vditor/issues/5") 上传改进 `enhancement`
* [4](https://github.com/b3log/vditor/issues/4") api 拼写错误 `bug`
* [3](https://github.com/b3log/vditor/issues/3") hint 添加高亮 `enhancement`

### v0.1.7 / 2019-02-11

* 第一次公开发布
