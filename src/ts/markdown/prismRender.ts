import {Constants} from "../constants";

// Prism Code Editor 编辑器实例映射（代码块元素 -> 编辑器实例）
const prismEditorMap = new WeakMap<HTMLElement, IPrismEditor>();

// 主题映射：从 highlight.js 主题映射到 Prism Code Editor 主题
const themeMap: { [key: string]: string } = {
    "github": "github-light",
    "github-dark": "github-dark",
    "github-dark-dimmed": "github-dark-dimmed",
    // 可以添加更多主题映射
};

/**
 * 获取 Prism 编辑器实例
 */
export const getPrismEditor = (element: HTMLElement): IPrismEditor | null => {
    return prismEditorMap.get(element) || null;
};

/**
 * 销毁 Prism 编辑器实例
 */
export const destroyPrismEditor = (element: HTMLElement): void => {
    const editor = prismEditorMap.get(element);
    if (editor && typeof editor.remove === "function")
        editor.remove();
    prismEditorMap.delete(element);
};

/**
 * 使用 Prism Code Editor 渲染代码块
 */
export const prismRender = (
    hljsOption?: IHljs,
    element: HTMLElement | Document = document,
    cdn = Constants.CDN,
    vditor?: IVditor
) => {
    // 只在 WYSIWYG 模式下使用 Prism Code Editor
    if (!vditor || vditor.currentMode !== "wysiwyg")
        return;

    // 获取主题
    let style = hljsOption?.style || "github";
    if (!Constants.CODE_THEME.includes(style))
        style = "github";
    const prismTheme = themeMap[style] || "github-light";

    // 如果没有设置cdn, 使用 jsdelivr CDN
    cdn = cdn || "https://cdn.jsdelivr.net/npm/prism-code-editor@5.0.0/dist";
    let prismCdn = cdn.includes("prism-code-editor")? cdn: `${cdn}/dist/js/prism-code-editor`;

    // 加载 Prism Code Editor 样式（主题样式会在编辑器初始化时自动加载）
    // 这里不需要手动加载主题 CSS，因为 setups 会自动处理

    if (hljsOption?.enable === false)
        return;

    // element 可能是预览区域元素本身，也可能是包含多个预览区域的容器
    let previewElements: NodeListOf<HTMLElement>;
    if (element instanceof HTMLElement && element.classList.contains("vditor-wysiwyg__preview"))
        previewElements = [element] as any;
    else // 查找所有预览区域（不限制 data-render 的值）
        previewElements = (element as HTMLElement | Document).querySelectorAll(".vditor-wysiwyg__preview");
    if (previewElements.length === 0)
        return;

    // 加载 Prism Code Editor 库
    const loadPrismCodeEditor = async (): Promise<void> => {
        if (window.PrismCodeEditor)
            return;

        try {
            // 先导入 Prism 语言语法定义（必须在 languages 之前导入）
            // 注意：这些路径是运行时动态确定的，webpack 无法静态分析，警告是预期的
            await import(/* webpackIgnore: true */ `${prismCdn}/prism/languages/index.js`);
            
            // 然后并行加载其他模块
            const [setups, Prism] = await Promise.all([
                import(/* webpackIgnore: true */ `${prismCdn}/setups/index.js`),
                import(/* webpackIgnore: true */ `${prismCdn}/prism/index.js`),
                // import(/* webpackIgnore: true */ `${prismCdn}/languages/index.js`) // 这个文件里包括了所有支持的语言信息，暂不加载而是按需加载需要的文件
            ]);

            // 将 Prism 设置到全局作用域
            const PrismModule = Prism as any;
            if (!PrismModule.languages)
                PrismModule.languages = {};
            window.Prism = PrismModule;
            window.PrismCodeEditor = {
                Prism: PrismModule,
                basicEditor: setups.basicEditor,
                minimalEditor: setups.minimalEditor
            };
        } catch (err) {
            console.error("Failed to load Prism Code Editor via dynamic import:", err);
            throw err;
        }
    };
    
    loadPrismCodeEditor().then(() => {
        previewElements.forEach((previewElement: HTMLElement) => {
            // 如果已经有编辑器实例，先销毁
            const existingEditor = prismEditorMap.get(previewElement);
            if (existingEditor && typeof existingEditor.remove === "function")
                existingEditor.remove();

            // 获取代码内容
            let codeElement = previewElement.querySelector("code");
            let codeText = "";
            let language = "";

            // 从隐藏的原始代码区域获取内容
            const previousElement = previewElement.previousElementSibling as HTMLElement;
            if (previousElement && previousElement.classList.contains("vditor-wysiwyg__pre")) {
                const prevCodeElement = previousElement.querySelector("code");
                if (prevCodeElement) {
                    language = prevCodeElement.className.replace("language-", "").split(" ")[0];
                    codeText = prevCodeElement.textContent || "";
                }
            } else if (codeElement) {
                language = codeElement.className.replace("language-", "").split(" ")[0];
                codeText = codeElement.textContent || "";
            } else {
                codeText = previewElement.textContent || "";
                // 尝试从 class 中获取语言
                const classList = previewElement.classList;
                for (let i = 0; i < classList.length; i++) {
                    if (classList[i].startsWith("language-")) {
                        language = classList[i].replace("language-", "");
                        break;
                    }
                }
            }

            // 跳过特殊类型
            if (language === "mermaid" || language === "flowchart" ||
                language === "echarts" || language === "mindmap" ||
                language === "plantuml" || language === "smiles" ||
                language === "abc" || language === "graphviz" ||
                language === "math" || language === "markmap") {
                return;
            }

            // 确定语言
            let editorLanguage = language || hljsOption?.defaultLang || "";
            if (editorLanguage === "" || editorLanguage === "hljs") {
                editorLanguage = "text"; // 空字符串表示使用默认语言（text）
            }

            // 标准化语言名称
            const langMap: Record<string, string> = {
                "js": "javascript",
                "ts": "typescript",
                "c++": "cpp",
                "md": "markdown",
            };
            const normalizedLang = editorLanguage ? (langMap[editorLanguage.toLowerCase()] || editorLanguage.toLowerCase()) : "text";

            loadLanguage(normalizedLang, prismCdn).then((loaded: boolean) => {
                initializePrismEditor(previewElement, codeText, loaded? normalizedLang: "text", prismTheme, hljsOption);
            });
        });
    });
};

const loadLanguage = async (lang: string, prismCdn: string) => {
    if (lang === 'text') return true; // 纯文本不需要加载
    if (!lang) return false;
    if (window.PrismCodeEditor?.Prism?.languages?.[lang]) return true;

    try {
        // 加载“增强版”语言包（包含缩进、闭合逻辑）
        await import(/* webpackIgnore: true */ `${prismCdn}/languages/${lang}.js`);
        return true;
    } catch (e) {
        // 如果增强版不存在，加载“纯语法”定义包
        try {
            await import(/* webpackIgnore: true */ `${prismCdn}/prism/languages/${lang}.js`);
            return true;
        } catch (e2) {
            console.warn(`Language ${lang} not found in any directory.`);
        }
    }
    return false;
};

/**
 * 初始化 Prism Code Editor
 */
function initializePrismEditor(
    previewElement: HTMLElement,
    codeText: string,
    language: string,
    theme: string,
    hljsOption?: IHljs
) {
    try {
        // 清空预览元素
        previewElement.innerHTML = "";
        
        // 创建一个 div 容器用于 Prism Code Editor
        // Prism Code Editor 会在容器上创建 Shadow DOM
        const container = document.createElement("div");
        container.style.width = "100%";
        container.style.height = "100%";
        container.style.minHeight = "1em";
        previewElement.appendChild(container);

        // 使用 basicEditor 初始化（包含 editHistory 扩展，支持 undo/redo）
        // 根据 hljsOption.lineNumber 控制是否显示行号
        const editorOptions: any = {
            theme: theme,
            language: language || "text",
            value: codeText || "",
            lineNumbers: hljsOption?.lineNumber === true, // 只有当 lineNumber 明确设置为 true 时才显示行号
        };
        
        const editor = window.PrismCodeEditor.basicEditor(container, editorOptions);

        // 保存编辑器实例
        if (editor)
            prismEditorMap.set(previewElement, editor);
        else
            console.error("Failed to create Prism Code Editor instance");
    } catch (e) {
        console.error("Failed to initialize Prism Code Editor:", e);
        // 如果初始化失败，至少显示原始代码
        previewElement.textContent = codeText;
    }
}
