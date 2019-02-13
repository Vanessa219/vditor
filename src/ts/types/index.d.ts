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

interface Hint {
    emojiTail?: string
    delay?: number
    emoji?: any
    at?: { (value: string): Array<any> }
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
    lang?: string
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
    timeId: number
    toolbar?: any
    preview?: any
    editor?: any
    counter?: any
    resize?: any
    hint?: any
    upload?: any
}