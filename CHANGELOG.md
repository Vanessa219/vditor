## Vditor change log

### 升级

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
  
### TODO

* [open issues](https://github.com/Vanessa219/vditor/issues)

### v3.0.4 / 未发布

* [232](https://github.com/Vanessa219/vditor/issues/232) 【IR&WYSIWYG】围栏代码块 info 部分自动完成 `引入特性`
* [230](https://github.com/Vanessa219/vditor/pull/230) 切换 IR 模式后依然展示工具栏 `改进功能`

### v3.0.3 / 2020-03-20

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
