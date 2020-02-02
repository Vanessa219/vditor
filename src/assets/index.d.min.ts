interface II18nLang {
    en_US: string;
    zh_CN: string;
}

interface IClasses {
    preview?: string;
}

interface IUpload {
    url?: string;
    max?: number;
    linkToImgUrl?: string;
    token?: string;
    accept?: string;
    withCredentials?: boolean;
    headers?: { [key: string]: string };

    success?(editor: HTMLPreElement, msg: string): void;

    error?(msg: string): void;

    filename?(name: string): string;

    validate?(files: File[]): string | boolean;

    handler?(files: File[]): string | null;

    format?(files: File[], responseText: string): string;

    file?(files: File[]): File[];
}

interface IMenuItem {
    name: string;
    icon?: string;
    tip?: string;
    hotkey?: string;
    suffix?: string;
    prefix?: string;
    tipPosition?: string;

    click?(): void;
}

interface IPreviewMode {
    both: string;
    preview: string;
    editor: string;
}

interface IHljs {
    lineNumber?: boolean;
    style?: string;
    enable?: boolean;
}

interface IMath {
    inlineDigit: boolean;
    engine: "KaTeX" | "MathJax";
    config?: object;
}

interface IPreview {
    delay?: number;
    maxWidth?: number;
    mode?: keyof IPreviewMode;
    url?: string;
    hljs?: IHljs;
    math?: IMath;

    parse?(element: HTMLElement): void;

    transform?(html: string): string;
}

interface IPreviewOptions {
    className?: string;
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

    transform?(html: string): string;
}

interface IHintData {
    html: string;
    value: string;
}

interface IHint {
    emojiTail?: string;
    delay?: number;
    emoji?: { [key: string]: string };
    emojiPath?: string;

    at?(value: string): IHintData[];
}

interface IResize {
    position?: string;
    enable?: boolean;

    after?(height: number): void;
}

interface IOptions {
    value?: string;
    debugger?: boolean;
    after?: () => void;
    typewriterMode?: boolean;
    keymap?: { [key: string]: string };
    height?: number | string;
    width?: number | string;
    placeholder?: string;
    lang?: (keyof II18nLang);
    toolbar?: Array<string | IMenuItem>;
    resize?: IResize;
    counter?: number;
    cache?: boolean;
    mode?: "wysiwyg-show" | "markdown-show" | "wysiwyg-only" | "markdown-only";
    preview?: IPreview;
    hint?: IHint;
    upload?: IUpload;
    classes?: IClasses;
    cdn?: string;
    tab?: string;

    input?(value: string, previewElement?: HTMLElement): void;

    focus?(value: string): void;

    blur?(value: string): void;

    esc?(value: string): void;

    ctrlEnter?(value: string): void;

    select?(value: string): void;
}

declare class Vditor {

    public static codeRender(element: HTMLElement, lang?: (keyof II18nLang)): void;

    public static highlightRender(hljsOption?: IHljs, element?: HTMLElement | Document, cdn?: string): void;

    public static mathRender(element: HTMLElement, options?: { cdn?: string, math?: IMath }): void;

    public static mermaidRender(element: HTMLElement, className?: string, cdn?: string): void;

    public static chartRender(element?: HTMLElement | Document, cdn?: string): void;

    public static abcRender(element?: HTMLElement | Document, cdn?: string): void;

    public static mediaRender(element: HTMLElement): void;

    public static speechRender(element: HTMLElement, lang?: (keyof II18nLang)): void;

    public static md2html(mdText: string, options?: IPreviewOptions): string;

    public static preview(previewElement: HTMLDivElement, markdown: string, options?: IPreviewOptions): void;

    public readonly version: string;

    constructor(id: string, options?: IOptions)

    public getValue(): string;

    public insertValue(value: string): void;

    public focus(): void;

    public blur(): void;

    public disabled(): void;

    public enable(): void;

    public setSelection(start: number, end: number): void;

    public getSelection(): string;

    public setValue(markdown: string): void;

    public renderPreview(value?: string): void;

    public getCursorPosition(editor: HTMLPreElement): {
        left: number,
        top: number,
    };

    public deleteValue(): void;

    public updateValue(): string;

    public isUploading(): boolean;

    public clearCache(): void;

    public disabledCache(): void;

    public enableCache(): void;

    public html2md(value: string): string;

    public getHTML(): string;

    public tip(text: string, time?: number): void;

    public setPreviewMode(mode: string): void;
}

export default Vditor;
