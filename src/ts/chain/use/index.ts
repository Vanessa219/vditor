import { addStyle } from "../../util/addStyle"

/**
 * Vditor 注册插件类型
 * TODO: ILuteRenderCallback 类型重写, 现有类型不利于插件开发
 */
export interface IVditorPlugin {
    id: string
    renderers?: Map<keyof ILuteRender, ILuteRenderCallback>
    styles?: Map<string, string>
}

// 插件实例
// const plugin_example: IVditorPlugin = {
// 	id: "vditor-plugin-test",
//     renderers: new Map([
//         [
//             "renderDocument",
//             function () {
//                 return ["", 1]
//             },
//         ],
//     ]),
// }

/***
 * TODO: Vditor Use 链式调用方法, 用于插件注册
 * 1. 引入 Vditor 的自定义渲染器
 * 2. 引入自定义样式渲染 (样式作用域隔离)
 *
 * 统一插件化开发
 * 灵感来源于 Vdok: https://github.com/HerbertHe/vdok/blob/main/packages/shared/src/renderers.ts
 */
export function UsePlugins(
    vditor: IVditor,
    plugins: Array<IVditorPlugin> | IVditorPlugin
) {
    /**
     * 插件规范命名验证
     * vditor-plugin-xxx
     * xxx 为 字母、数字、或者下划线
     */
    const ValidVditorPluginIDRegExp = /vditor-plugin-([a-zA-Z0-9_]+)/

    if (!Array.isArray(plugins)) {
        // 单个插件时, 直接注册加载
        if (!ValidVditorPluginIDRegExp.test(plugins.id)) {
            throw new Error(
                `Invalid Vditor Plugin ID: ${plugins.id}, please use valid Vditor Plugin!`
            )
        }

        const { renderers, styles } = plugins

        // 注册样式表
        if (!!styles && styles.size !== 0) {
            for (let id in styles) {
                const url = styles.get(id)
                if (!!url && !!id) {
                    addStyle(url, `${plugins.id}-style-${id}`)
                } else {
                    throw new Error(
                        `Invalid Vditor Plugin Style: ${plugins.id} -> ${id}: ${url}`
                    )
                }
            }
        }

        // 注册自定义渲染器
        if (!!renderers && renderers.size !== 0) {
            for (let render in renderers) {
                // TODO 在此覆盖 Vditor 的默认渲染器
            }
        }
    }

    // 多个插件时, 根据优先级顺序进行排序
}
