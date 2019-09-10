declare module "*.svg";

declare module "*.png";

declare module "echarts";

declare module "highlight.js";

declare module "mermaid";

declare module "abcjs/src/api/abc_tunebook_svg";

declare module "katex";
declare module "katex/contrib/auto-render/auto-render";

declare module "turndown";

interface ITurndown {
    addRule(key: string, rule: ITurndownRule): ITurndown;
}

interface ITurndownRule {
    filter: string | string[] | ((node: HTMLInputElement) => boolean);

    replacement(content: string, node?: HTMLElement): string;
}

interface ILute {
    New(): ILute;

    PutEmojis(emojis: { [key: string]: string }): void;

    SetEmojiSite(emojiSite: string): void;

    MarkdownStr(error: string, text: string): string[];

    GetEmojis(): { [key: string]: string };

    FormatStr(error: string, text: string): string[];
}

declare var webkitAudioContext: {
    prototype: AudioContext
    new(contextOptions?: AudioContextOptions): AudioContext,
};

interface IHTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

interface II18nLang {
    en_US: string;
    zh_CN: string;
}

interface II18n {
    en_US: { [key: string]: string };
    zh_CN: { [key: string]: string };
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

    success?(editor: HTMLPreElement, msg: string): void;

    error?(msg: string): void;

    filename?(name: string): string;

    validate?(files: File[]): string | boolean;

    handler?(files: File[]): string | null;

    format?(files: File[], responseText: string): string;
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

interface IPreview {
    delay?: number;
    maxWidth?: number;
    mode?: string; // "both" | "preview" | "editor"
    url?: string;
    hljs?: {
        style?: string,
        enable?: boolean,
    };

    parse?(element: HTMLElement): void;
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

interface IPreviewOptions {
    hljsStyle?: string;
    enableHighlight?: boolean;
    customEmoji?: { [key: string]: string };
    lang?: (keyof II18nLang);
    emojiPath?: string;
}

interface IOptions {
    keymap?: { [key: string]: string };
    height?: number | string;
    width?: number | string;
    placeholder?: string;
    lang?: (keyof II18nLang);
    toolbar?: Array<string | IMenuItem>;
    resize?: IResize;
    counter?: number;
    cache?: boolean;
    mode?: string; // wysiwyg-show, markdown-show, wysisyg-only, markdown-only
    preview?: IPreview;
    hint?: IHint;
    upload?: IUpload;
    classes?: IClasses;

    tab?: string;

    input?(value: string, previewElement?: HTMLElement): void;

    focus?(value: string): void;

    blur?(value: string): void;

    esc?(value: string): void;

    ctrlEnter?(value: string): void;

    select?(value: string): void;
}

interface IVditor {
    id: string;
    options: IOptions;
    originalInnerHTML: string;
    lute: ILute;
    toolbar?: {
        elements?: { [key: string]: HTMLElement },
    };
    preview?: {
        element: HTMLElement
        render(vditor: IVditor, value?: string): void,
    };
    editor?: {
        element: HTMLPreElement,
        range: Range,
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
        element: HTMLUListElement
        fillEmoji(element: HTMLElement): void
        render(): void,
    };
    tip: {
        element: HTMLElement
        show(text: string, time?: number): void
        hide(): void,
    };
    upload?: {
        element: HTMLElement
        isUploading: boolean
    };
    undo: {
        redo(vditor: IVditor): void
        undo(vditor: IVditor): void
        addToUndoStack(vditor: IVditor): void,
    };
    wysiwyg: {
        element: HTMLElement
        range: Range
    }
}

declare class IVditorConstructor {

    public static codeRender(element: HTMLElement, lang?: (keyof II18nLang)): void;

    public static highlightRender(hljsStyle: string, enableHighlight: boolean, element?: HTMLElement | Document): void;

    public static mathRender(element: HTMLElement, lang?: (keyof II18nLang)): void;

    public static mermaidRender(element: HTMLElement): void;

    public static chartRender(element?: HTMLElement | Document): void;

    public static abcRender(element?: HTMLElement | Document): void;

    public static mediaRender(element: HTMLElement): void;

    public static md2html(mdText: string, options?: IPreviewOptions): string;

    public static preview(element: HTMLTextAreaElement, options?: IPreviewOptions): void;

    public readonly version: string;
    public vditor: IVditor;

    constructor(options: IOptions)

    public getValue(): string;

    public insertValue(value: string): void;

    public focus(): void;

    public blur(): void;

    public disabled(): void;

    public enable(): void;

    public setSelection(start: number, end: number): void;

    public getSelection(): string;

    public setValue(text: string): void;

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
