declare module "*.svg" {
    const content: string
    export default content
}

declare module '*.png'

declare module 'turndown'

declare module 'turndown-plugin-gfm/lib/turndown-plugin-gfm.es.js'

declare var webkitAudioContext: {
    prototype: AudioContext;
    new(contextOptions?: AudioContextOptions): AudioContext;
};

interface I18nLang {
    en_US:   string;
    zh_CN:  string;
}

interface I18n {
    en_US: { [key: string]: string }
    zh_CN: { [key: string]: string }
}

interface Classes {
    preview?: string
}

interface Upload {
    url: string
    max?: number
    linkToImgUrl?: string
    success?: { (textarea: HTMLTextAreaElement, msg: string): void }
    error?: { (msg: string): void }
    token?: string
    filename?: { (name: string): string }
}

interface MenuItem {
    name: string
    icon?: string
    tip?: string
    hotkey?: string
    suffix?: string
    prefix?: string
    tipPosition?: string
}

interface Preview {
    delay?: number
    show?: boolean
    parse?: { (element: HTMLElement): void }
    url?: string
}

interface HintData {
    html: string,
    value: string
}

interface Hint {
    emojiTail?: string
    delay?: number
    emoji?: { [key: string]: string }
    at?: { (value: string): Array<HintData> }
}

interface Resize {
    position?: string
    enable?: boolean
    after?: { (height: number): void }
}

interface Options {
    height?: number | string
    width?: number | string
    placeholder?: string
    lang?: (keyof I18nLang)
    toolbar?: Array<string | MenuItem>
    resize?: Resize
    counter?: number
    cache?: boolean
    preview?: Preview
    hint?: Hint
    upload?: Upload
    classes?: Classes
    input?: { (value: string, previewElement?: HTMLElement): void }
    focus?: { (value: string): void }
    blur?: { (value: string): void }
    esc?: { (value: string): void }
    ctrlEnter?: { (value: string): void }
    select?: { (value: string): void }
}

interface Vditor {
    id: string
    mdTimeoutId: number
    options: Options
    toolbar?: {
        elements?: { [key: string]: HTMLDivElement }
    }
    preview?: {
        element: HTMLElement
        render: { (vditor: Vditor, value?: string): void }
    },
    editor?: {
        element: HTMLTextAreaElement
    },
    counter?: {
        element: HTMLElement
        render: { (length: number, counter: number): void }
    },
    resize?: {
        element: HTMLElement
    },
    hint?: {
        timeId: number
        editorElement: HTMLTextAreaElement
        element: HTMLUListElement
        atUser: { (value: string): Array<HintData> }
        commonEmoji: { [key: string]: string }
        hintDelay: number
        render: { (): void }
    }
    upload?: {
        element: HTMLElement
        isUploading: boolean
    }
}