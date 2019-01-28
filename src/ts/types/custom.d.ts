declare module "*.svg" {
    const content: string
    export default content
}

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
    i18n?: string
    draggable?: boolean
    previewShow?: boolean
    counter?: number
    upload?: Upload
    classes?: Classes
    staticServePath?: string
    atUserCallback?: object | string
    commonEmoji?: object
    toolbar?: Array<string | MenuItem>
}
