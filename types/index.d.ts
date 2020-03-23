declare module "*.svg";

declare module "*.png";

declare const Lute: ILute;

interface ILuteRender {
    renderLinkDest: (node: {
        TokensStr: () => string;
        __internal_object__: {
            Parent: {
                Type: number,
            },
        }
    }, entering: boolean) => [string, number];
}

interface ILute {
    WalkStop: number;

    New(): ILute;

    SetJSRenderers(options?: {
        renderers: {
            HTML2VditorDOM?: ILuteRender,
            HTML2VditorIRDOM?: ILuteRender,
            HTML2Md?: ILuteRender,
        },
    }): void;

    SetHeadingAnchor(enable: boolean): void;

    SetInlineMathAllowDigitAfterOpenMarker(enable: boolean): void;

    SetToC(enable: boolean): void;

    SetFootnotes(enable: boolean): void;

    SetAutoSpace(enable: boolean): void;

    SetChinesePunct(enable: boolean): void;

    SetFixTermTypo(enable: boolean): void;

    SetEmojiSite(emojiSite: string): void;

    PutEmojis(emojis: { [key: string]: string }): void;

    GetEmojis(): { [key: string]: string };

    FormatMd(markdown: string): string;

    // debugger md
    RenderEChartsJSON(text: string): string;

    // md 转换为 html
    Md2HTML(markdown: string): string;

    // 粘贴时将 html 转换为 md
    HTML2Md(html: string): string;

    // wysiwyg 转换为 html
    VditorDOM2HTML(vhtml: string): string;

    // wysiwyg 输入渲染
    SpinVditorDOM(html: string): string;

    // 粘贴时将 html 转换为 wysiwyg
    HTML2VditorDOM(html: string): string;

    // 将 wysiwyg 转换为 md
    VditorDOM2Md(html: string): string;

    // 将 md 转换为 wysiwyg
    Md2VditorDOM(markdown: string): string;

    // ir 输入渲染
    SpinVditorIRDOM(markdown: string): string;

    // ir 获取 md
    VditorIRDOM2Md(html: string): string;

    // md 转换为 ir
    Md2VditorIRDOM(html: string): string;

    // 获取 HTML
    VditorIRDOM2HTML(html: string): string;

    HTML2VditorIRDOM(html: string): string;
}

declare const webkitAudioContext: {
    prototype: AudioContext
    new(contextOptions?: AudioContextOptions): AudioContext,
};

interface II18nLang {
    en_US: string;
    ko_KR: string;
    zh_CN: string;
}

interface II18n {
    en_US: { [key: string]: string };
    ko_KR: { [key: string]: string };
    zh_CN: { [key: string]: string };
}

interface IClasses {
    preview?: string;
}

/** @link https://hacpai.com/article/1549638745630#options-upload */
interface IUpload {
    /** 上传 url */
    url?: string;
    /** 上传文件最大 Byte */
    max?: number;
    /** 剪切板中包含图片地址时，使用此 url 重新上传 */
    linkToImgUrl?: string;
    /** CORS 上传验证，头为 X-Upload-Token */
    token?: string;
    /** 文件上传类型，同 [input accept](https://www.w3schools.com/tags/att_input_accept.asp) */
    accept?: string;
    /** 跨站点访问控制。默认值: false */
    withCredentials?: boolean;
    /** 请求头设置 */
    headers?: { [key: string]: string };

    /** 上传成功回调 */
    success?(editor: HTMLPreElement, msg: string): void;

    /** 上传失败回调 */
    error?(msg: string): void;

    /** 文件名安全处理。 默认值: name => name.replace(/\W/g, '') */
    filename?(name: string): string;

    /** 校验，成功时返回 true 否则返回错误信息 */
    validate?(files: File[]): string | boolean;

    /** 自定义上传，当发生错误时返回错误信息 */
    handler?(files: File[]): string | null;

    /** 对服务端返回的数据进行转换，以满足内置的数据结构 */
    format?(files: File[], responseText: string): string;

    /** 将上传的文件处理后再返回  */
    file?(files: File[]): File[];
}

/** @link https://hacpai.com/article/1549638745630#options-toolbar */
interface IMenuItem {
    /** 唯一标示 */
    name: string;
    /** svg 图标 HTML */
    icon?: string;
    /** 提示 */
    tip?: string;
    /** 快捷键，支持⌘/ctrl-key 或 ⌘/ctrl-⇧/shif-key 格式的配置，不支持 wysiwyg 模式 */
    hotkey?: string;
    /** 插入编辑器中的后缀 */
    suffix?: string;
    /** 插入编辑器中的前缀 */
    prefix?: string;
    /** 提示位置：ne, nw */
    tipPosition?: string;
    panelElement?: HTMLElement;

    /** 自定义按钮点击时触发的事件 */
    click?(status?: boolean): void;
}

interface IPreviewMode {
    both: string;
    preview: string;
    editor: string;
}

/** @link https://hacpai.com/article/1549638745630#options-preview-hljs */
interface IHljs {
    /** 是否启用行号。默认值: false */
    lineNumber?: boolean;
    /** 可选值参见 [Chroma](https://xyproto.github.io/splash/docs/longer/all.html)。 默认值: 'github' */
    style?: string;
    /** 是否启用代码高亮。默认值: true */
    enable?: boolean;
}

/** @link https://hacpai.com/article/1549638745630#options-preview-math */
interface IMath {
    /** 内联数学公式起始 $ 后是否允许数字。默认值: false */
    inlineDigit: boolean;
    /** 使用 MathJax 渲染时传入的宏定义。默认值: {} */
    macros: object;
    /** 数学公式渲染引擎。默认值: 'KaTeX' */
    engine: "KaTeX" | "MathJax";
}

/** @link https://hacpai.com/article/1549638745630#options-preview-markdown */
interface IMarkdownConfig {
    /** 自动空格。默认值: false */
    autoSpace?: boolean;
    /** 自动矫正术语。默认值: false */
    fixTermTypo?: boolean;
    /** 自动矫正标点。默认值: false */
    chinesePunct?: boolean;
    /** 插入目录。默认值: false */
    toc?: boolean;
    /** 脚注。默认值: true */
    footnotes?: boolean;
}

/** @link https://hacpai.com/article/1549638745630#options-preview */
interface IPreview {
    /** 预览 debounce 毫秒间隔。默认值: 1000 */
    delay?: number;
    /** 预览区域最大宽度。默认值: 768 */
    maxWidth?: number;
    /** 显示模式。默认值: 'both' */
    mode?: keyof IPreviewMode;
    /** md 解析请求 */
    url?: string;
    /** @link https://hacpai.com/article/1549638745630#options-preview-hljs */
    hljs?: IHljs;
    /** @link https://hacpai.com/article/1549638745630#options-preview-math */
    math?: IMath;
    /** @link https://hacpai.com/article/1549638745630#options-preview-markdown */
    markdown?: IMarkdownConfig;

    /** 预览回调 */
    parse?(element: HTMLElement): void;

    /** 渲染之前回调 */
    transform?(html: string): string;
}

interface IPreviewOptions {
    theme?: "classic" | "dark";
    customEmoji?: { [key: string]: string };
    lang?: (keyof II18nLang);
    emojiPath?: string;
    hljs?: IHljs;
    speech?: {
        enable?: boolean,
    };
    anchor?: boolean;
    math?: IMath;
    cdn?: string;
    markdown?: IMarkdownConfig;

    transform?(html: string): string;
}

interface IHintData {
    html: string;
    value: string;
}

/** @link https://hacpai.com/article/1549638745630#options-hint */
interface IHint {
    /** 常用表情提示 HTML */
    emojiTail?: string;
    /** 提示 debounce 毫秒间隔。默认值: 200 */
    delay?: number;
    /** 默认表情，可从 [lute/emoji_map](https://github.com/88250/lute/blob/master/parse/emoji_map.go#L32) 中选取，也可自定义 */
    emoji?: { [key: string]: string };
    /** 表情图片地址。默认值: 'https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}/dist/images/emoji' */
    emojiPath?: string;

    /** `@`用户回调 */
    at?(value: string): IHintData[];
}

interface IResize {
    position?: string;
    enable?: boolean;

    after?(height: number): void;
}

/** @link https://hacpai.com/article/1549638745630#options */
interface IOptions {
    /** 编辑器初始化值。默认值: '' */
    value?: string;
    /** 是否显示日志。默认值: false */
    debugger?: boolean;
    /** 编辑器异步渲染完成后的回调方法 */
    after?: () => void;
    /** 是否启用打字机模式。默认值: false */
    typewriterMode?: boolean;
    keymap?: { [key: string]: string };
    /** 编辑器总高度。默认值: 'auto' */
    height?: number | string;
    /** 编辑器总宽度，支持 %。默认值: 'auto' */
    width?: number | string;
    /** 输入区域为空时的提示。默认值: '' */
    placeholder?: string;
    /** 多语言。默认值: 'zh_CN' */
    lang?: (keyof II18nLang);
    /** @link https://hacpai.com/article/1549638745630#options-toolbar */
    toolbar?: Array<string | IMenuItem>;
    resize?: IResize;
    /** 计数器。默认值: '0' */
    counter?: number;
    /** 是否使用 localStorage 进行缓存。默认值: 'auto' */
    cache?: boolean;
    /** 编辑模式。默认值: 'wysiwyg' */
    mode?: "wysiwyg" | "sv" | "ir";
    /** @link https://hacpai.com/article/1549638745630#options-preview */
    preview?: IPreview;
    /** @link https://hacpai.com/article/1549638745630#options-hint */
    hint?: IHint;
    /** 是否隐藏工具栏。默认值: false */
    hideToolbar?: boolean;
    /** 主题。默认值: 'classic' */
    theme?: "classic" | "dark";
    /** @link https://hacpai.com/article/1549638745630#options-upload */
    upload?: IUpload;
    classes?: IClasses;
    /** 配置自建 CDN 地址。默认值: 'https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}' */
    cdn?: string;
    /** tab 键操作字符串，支持 \t 及任意字符串 */
    tab?: string;

    /** 输入后触发 */
    input?(value: string, previewElement?: HTMLElement): void;

    /** 聚焦后触发  */
    focus?(value: string): void;

    /** 失焦后触发 */
    blur?(value: string): void;

    /** `esc` 按下后触发 */
    esc?(value: string): void;

    /** `⌘/ctrl+enter` 按下后触发 */
    ctrlEnter?(value: string): void;

    /** 编辑器中选中文字后触发 */
    select?(value: string): void;
}

interface IEChart {
    setOption(option: any): void;

    resize(): void;
}

interface IVditor {
    id: string;
    options: IOptions;
    originalInnerHTML: string;
    lute: ILute;
    currentMode: "sv" | "wysiwyg" | "ir";
    currentPreviewMode: keyof IPreviewMode;
    devtools?: {
        element: HTMLDivElement,
        renderEchart(vditor: IVditor): void,
    };
    toolbar?: {
        elements?: { [key: string]: HTMLElement },
        element?: HTMLElement,
        editModePanelElement?: HTMLElement;
        headingPanelElement?: HTMLElement;
        emojiPanelElement?: HTMLElement;
    };
    preview?: {
        element: HTMLElement
        render(vditor: IVditor, value?: string): void,
    };
    sv?: {
        element: HTMLPreElement,
    };
    counter?: {
        element: HTMLElement
        render(length: number, counter: number): void,
    };
    resize?: {
        element: HTMLElement,
    };
    hint?: {
        timeId: number
        element: HTMLDivElement
        fillEmoji(element: HTMLElement, vditor: IVditor): void
        render(vditor: IVditor): void,
        genHTML(data: IHintData[], key: string, vditor: IVditor): void
        select(event: KeyboardEvent, vditor: IVditor): boolean
    };
    tip: {
        element: HTMLElement
        show(text: string, time?: number): void
        hide(): void,
    };
    upload?: {
        element: HTMLElement
        isUploading: boolean
        range: Range,
    };
    undo?: {
        redo(vditor: IVditor): void
        undo(vditor: IVditor): void
        addToUndoStack(vditor: IVditor): void
        recordFirstPosition(vditor: IVditor): void,
        resetIcon(vditor: IVditor): void,
    };
    wysiwygUndo?: {
        redo(vditor: IVditor): void
        undo(vditor: IVditor): void
        addToUndoStack(vditor: IVditor): void
        recordFirstWbr(vditor: IVditor, event: KeyboardEvent): void,
        resetIcon(vditor: IVditor): void,
    };
    irUndo?: {
        redo(vditor: IVditor): void
        undo(vditor: IVditor): void
        addToUndoStack(vditor: IVditor): void
        recordFirstWbr(vditor: IVditor, event: KeyboardEvent): void,
        resetIcon(vditor: IVditor): void,
    };
    wysiwyg?: {
        element: HTMLPreElement,
        popover: HTMLDivElement,
        afterRenderTimeoutId: number,
        hlToolbarTimeoutId: number,
        preventInput: boolean,
        composingLock: boolean,
    };
    ir?: {
        element: HTMLPreElement,
        composingLock: boolean,
        preventInput: boolean,
        processTimeoutId: number,
    };
}
