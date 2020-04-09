declare const VDITOR_VERSION: string;

const _VDITOR_VERSION = VDITOR_VERSION;

export {_VDITOR_VERSION as VDITOR_VERSION};

export abstract class Constants {
    public static readonly ZWSP: string = "\u200b";
    public static readonly CLASS_MENU_DISABLED: string = "vditor-menu--disabled";
    public static readonly TOOLBARS: string[] = ["emoji", "headings", "bold", "italic", "strike", "link", "list",
        "ordered-list", "outdent", "indent", "check", "line", "quote", "code", "inline-code", "upload", "record", "table"]
    public static readonly CODE_LANGUAGES: string[] = [
        "abc",
        "mermaid",
        "echarts",
        "graphviz",
        "apache",
        "bash",
        "cs",
        "cpp",
        "css",
        "coffeescript",
        "diff",
        "xml",
        "http",
        "ini",
        "json",
        "java",
        "javascript",
        "makefile",
        "markdown",
        "nginx",
        "objectivec",
        "php",
        "perl",
        "properties",
        "python",
        "ruby",
        "sql",
        "shell",
        "dart",
        "erb",
        "go",
        "gradle",
        "julia",
        "kotlin",
        "less",
        "lua",
        "matlab",
        "rust",
        "scss",
        "typescript",
        "yaml",
    ];
}
