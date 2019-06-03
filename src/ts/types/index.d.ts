declare module "*.svg";

declare module "*.png";

declare module "highlight.js";

declare module "mermaid";

declare module "katex";
declare module "katex/contrib/auto-render/auto-render";

declare module "turndown";
declare module "turndown-plugin-gfm/lib/turndown-plugin-gfm.es.js";

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

    success?(textarea: HTMLTextAreaElement, msg: string): void;

    error?(msg: string): void;

    filename?(name: string): string;

    validate?(files: File[]): string | boolean;

    handler?(files: File[]): string | null;
}

interface IMenuItem {
    name: string;
    icon?: string;
    tip?: string;
    hotkey?: string;
    suffix?: string;
    prefix?: string;
    tipPosition?: string;
}

interface IPreview {
    delay?: number;
    show?: boolean;
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

interface IOptions {
    height?: number | string;
    width?: number | string;
    placeholder?: string;
    editorName?: string;
    lang?: (keyof II18nLang);
    toolbar?: Array<string | IMenuItem>;
    resize?: IResize;
    counter?: number;
    cache?: boolean;
    preview?: IPreview;
    hint?: IHint;
    upload?: IUpload;
    classes?: IClasses;

    input?(value: string, previewElement?: HTMLElement): void;

    focus?(value: string): void;

    blur?(value: string): void;

    esc?(value: string): void;

    ctrlEnter?(value: string): void;

    select?(value: string): void;

    tab?: string;
}

interface IVditor {
    id: string;
    mdTimeoutId: number;
    options: IOptions;
    originalInnerHTML: string;
    markdownIt?: markdownit;
    toolbar?: {
        elements?: { [key: string]: HTMLElement },
    };
    preview?: {
        element: HTMLElement
        render(vditor: IVditor, value?: string): void,
    };
    editor?: {
        element: HTMLTextAreaElement,
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
        editorElement: HTMLTextAreaElement
        element: HTMLUListElement
        hint: IHint
        render(): void,
    };
    upload?: {
        element: HTMLElement
        isUploading: boolean,
    };
}

declare class IVditorConstructor {
    public readonly version: string;
    public vditor: IVditor;

    constructor(options: IOptions)

    public static mathRender(element: HTMLElement): void;

    public static mermaidRender(element: HTMLElement): void;

    public static codeRender(element: HTMLElement, lang: (keyof II18nLang)): void;

    public static md2html(mdText: string, hljsStyle: string): string;

    public getValue(): string;

    public insertValue(value: string): void;

    public focus(): void;

    public blur(): void;

    public enable(): void;

    public setSelection(start: number, end: number): void;

    public getSelection(): string;

    public setValue(text: string): void;

    public renderPreview(value?: string): void;

    public getCursorPosition(): {
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

    public getHTML(includeHljs?: boolean): string;
}
