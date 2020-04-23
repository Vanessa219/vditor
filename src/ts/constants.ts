declare const VDITOR_VERSION: string;

const _VDITOR_VERSION = VDITOR_VERSION;

export {_VDITOR_VERSION as VDITOR_VERSION};

export abstract class Constants {
    public static readonly ZWSP: string = "\u200b";
    public static readonly CLASS_MENU_DISABLED: string = "vditor-menu--disabled";
    public static readonly EDIT_TOOLBARS: string[] = ["emoji", "headings", "bold", "italic", "strike", "link", "list",
        "ordered-list", "outdent", "indent", "check", "line", "quote", "code", "inline-code", "insert-after", "insert-before", "upload", "record", "table"];
    public static readonly CONTENT_THEME: string[] = ["dark", "light"];
    public static readonly CODE_THEME: string[] = ["abap", "algol", "algol_nu", "arduino", "autumn", "borland", "bw", "colorful", "dracula",
        "emacs", "friendly", "fruity", "github", "igor", "lovelace", "manni", "monokai", "monokailight", "murphy",
        "native", "paraiso-dark", "paraiso-light", "pastie", "perldoc", "pygments", "rainbow_dash", "rrt",
        "solarized-dark", "solarized-dark256", "solarized-light", "swapoff", "tango", "trac", "vim", "vs", "xcode"];
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
