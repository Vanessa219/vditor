declare module "*.svg" {
    const content: string
    export default content
}

declare module '*.png'

interface Classes {
    previewContent: string
}

interface Upload {
    imgPath: string
    max: number
    LinkToImgPath: string
}

interface MenuItem {
    name: string
    icon?: string
    tip?: string
    hotkey?: string
    suffix?: string
    prefix?: string
    tail?: string
}

interface Options {
    height?: number
    width?: number | string
    theme?: string
    placeholder?: string
    lang?: string
    draggable?: boolean
    previewShow?: boolean
    counter?: number
    upload?: Upload
    classes?: Classes
    staticServePath?: string
    atUserCallback?: object | string
    commonEmoji?: any
    toolbar?: Array<string | MenuItem>
    change?: ChangeFunction
}

interface ChangeFunction {
    (value: string, previewElement?: HTMLElement): void
}

interface Vditor {
    id: string
    options: Options
    timeId: number
    toolbar?: any
    markdown?: any
    editor?: any
}