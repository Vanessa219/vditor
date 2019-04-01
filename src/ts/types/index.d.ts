declare module "*.svg" {
    const content: string;
    export default content;
}

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

declare interface IMarkdownItOptions {
    html: boolean;
    linkify: boolean;
    breaks: boolean;

    highlight?(str: string, lang: string): string;
}

declare interface ITurndown {
    prototype: {
        escape(name: string): string,
    };

    new(): {
        addRule(name: string, options: {}): void
        use(plugin: ITurndown): void
        turndown(text: string): string,
    };
}

interface IMarkdownIt {
    render?: (md: string) => string | undefined;
    core?: {
        ruler: {
            after: (type: string, name: string, process: (state: IMarkdownItState) => void) => void,
        },
    };
}

interface IMarkdownItState {
    tokens: IMarkdownItToken[];
    Token: any;
}

interface IMarkdownItToken {
    type: string;
    attrIndex: (name: string) => number;
    attrPush: (name: string[]) => void;
    attrs: string[][];
    content: string;
    children: IMarkdownItToken[];
}

interface IHTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

interface IDocument extends Document {
    onselectstart: string | null;
    selection: { empty(): void };
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
    success?: (textarea: HTMLTextAreaElement, msg: string) => void;
    error?: (msg: string) => void;
    token?: string;
    filename?: (name: string) => string;
    accept?: string;
    validate?: (files: File[]) => string | boolean;
    handler?: (files: File[]) => string | null;
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
    parse?: (element: HTMLElement) => void;
    url?: string;
    hljs?: {
        style?: string,
        enable?: boolean,
    };
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
    at?: (value: string) => IHintData[];
}

interface IResize {
    position?: string;
    enable?: boolean;
    after?: (height: number) => void;
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
    input?: (value: string, previewElement?: HTMLElement) => void;
    focus?: (value: string) => void;
    blur?: (value: string) => void;
    esc?: (value: string) => void;
    ctrlEnter?: (value: string) => void;
    select?: (value: string) => void;
    tab?: string;
}

interface IVditor {
    id: string;
    mdTimeoutId: number;
    options: IOptions;
    originalInnerHTML: string;
    markdownIt?: IMarkdownIt;
    toolbar?: {
        elements?: { [key: string]: HTMLElement },
    };
    preview?: {
        element: HTMLElement
        render: (vditor: IVditor, value?: string) => void,
    };
    editor?: {
        element: HTMLTextAreaElement,
    };
    counter?: {
        element: HTMLElement
        render: (length: number, counter: number) => void,
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
