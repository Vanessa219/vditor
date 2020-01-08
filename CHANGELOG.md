## Vditor change log

### 升级

* v2.0
  * 默认为 WYSIWYG 模式，可根据需要修改 option.mode 参数
  * 添加 options.debugger 
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
  
### TODO

* [3](https://github.com/Vanessa219/vditor/issues/3) 编辑预览同步滚动改进 `enhancement`
* [4](https://github.com/Vanessa219/vditor/issues/4) 添加支持思维导图的功能 `enhancement`

### v2.0.14 / 2020-01-08

* [48](https://github.com/Vanessa219/vditor/issues/48) H6 回车 解析问题 `修复缺陷`
* [47](https://github.com/Vanessa219/vditor/issues/47) <details> 改进 `功能改进`
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
