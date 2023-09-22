declare const VDITOR_VERSION: string;

const _VDITOR_VERSION = VDITOR_VERSION;

export {_VDITOR_VERSION as VDITOR_VERSION};

export abstract class Constants {
  public static readonly ZWSP: string = "\u200b";
  public static readonly DROP_EDITOR: string = "application/editor";
  public static readonly MOBILE_WIDTH: number = 520;
  public static readonly CLASS_MENU_DISABLED: string = "vditor-menu--disabled";
  public static readonly EDIT_TOOLBARS: string[] = ["emoji", "headings", "bold", "italic", "strike", "link", "list",
    "ordered-list", "outdent", "indent", "check", "line", "quote", "code", "inline-code", "insert-after",
    "insert-before", "upload", "record", "table"];
  public static readonly CODE_THEME: string[] = ["abap", "algol", "algol_nu", "arduino", "autumn", "borland", "bw",
    "colorful", "dracula", "emacs", "friendly", "fruity", "github", "igor", "lovelace", "manni", "monokai",
    "monokailight", "murphy", "native", "paraiso-dark", "paraiso-light", "pastie", "perldoc", "pygments",
    "rainbow_dash", "rrt", "solarized-dark", "solarized-dark256", "solarized-light", "swapoff", "tango", "trac",
    "vim", "vs", "xcode", "ant-design"];
  public static readonly CODE_LANGUAGES: string[] = ["mermaid", "echarts", "mindmap", "plantuml", "abc", "graphviz", "flowchart", "apache",
    "js", "ts", "html","markmap",
    // common
    "properties", "apache", "bash", "c", "csharp", "cpp", "css", "coffeescript", "diff", "go", "xml", "http",
    "json", "java", "javascript", "kotlin", "less", "lua", "makefile", "markdown", "nginx", "objectivec", "php",
    "php-template", "perl", "plaintext", "python", "python-repl", "r", "ruby", "rust", "scss", "sql", "shell",
    "swift", "ini", "typescript", "vbnet", "yaml",
    "ada", "clojure", "dart", "erb", "fortran", "gradle", "haskell", "julia", "julia-repl", "lisp", "matlab",
    "pgsql", "powershell", "sql_more", "stata", "cmake", "mathematica",
    // ext
    "solidity", "yul"
  ];
  public static readonly CDN = `https://unpkg.com/vditor@${VDITOR_VERSION}`;
  public static readonly DIST = "dist";
  public static readonly BASE_URL = `${Constants.CDN}/${Constants.DIST}`;
  public static readonly _STATIC_PATH = {
    logo: "images/logo.png",
    method: "method.min.js",
    style: "index.css",

    emoji: "images/emoji",
    i18n: "js/i18n",
    icons: "js/icons",
    theme: "css/content-theme",

    abc: "js/abcjs/abcjs_basic.min.js",
    echarts: "js/echarts/echarts.min.js",
    flowchart: "js/flowchart.js/flowchart.min.js",
    graphviz: "js/graphviz/viz.js",
    lute: "js/lute/lute.min.js",
    markmap: "js/markmap/markmap.min.js",
    mermaid: "js/mermaid/mermaid.min.js",
    plantuml: "js/plantuml/plantuml-encoder.min.js",

    highlight: "js/highlight.js",
    katex: "js/katex",
    mathjax: "js/mathjax",
  } as const;
  public static readonly STATIC_PATH = {
    logo: `${Constants.BASE_URL}/${Constants._STATIC_PATH.logo}`,
    method: `${Constants.BASE_URL}/${Constants._STATIC_PATH.method}`,
    style: `${Constants.BASE_URL}/${Constants._STATIC_PATH.style}`,

    emoji: `${Constants.BASE_URL}/${Constants._STATIC_PATH.emoji}`,
    i18n: `${Constants.BASE_URL}/${Constants._STATIC_PATH.i18n}`,
    icons: `${Constants.BASE_URL}/${Constants._STATIC_PATH.icons}`,
    theme: `${Constants.BASE_URL}/${Constants._STATIC_PATH.theme}`,

    abc: `${Constants.BASE_URL}/${Constants._STATIC_PATH.abc}`,
    echarts: `${Constants.BASE_URL}/${Constants._STATIC_PATH.echarts}`,
    flowchart: `${Constants.BASE_URL}/${Constants._STATIC_PATH.flowchart}`,
    graphviz: `${Constants.BASE_URL}/${Constants._STATIC_PATH.graphviz}`,
    lute: `${Constants.BASE_URL}/${Constants._STATIC_PATH.lute}`,
    markmap: `${Constants.BASE_URL}/${Constants._STATIC_PATH.markmap}`,
    mermaid: `${Constants.BASE_URL}/${Constants._STATIC_PATH.mermaid}`,
    plantuml: `${Constants.BASE_URL}/${Constants._STATIC_PATH.plantuml}`,

    highlight: `${Constants.BASE_URL}/${Constants._STATIC_PATH.highlight}`,
    katex: `${Constants.BASE_URL}/${Constants._STATIC_PATH.katex}`,
    mathjax: `${Constants.BASE_URL}/${Constants._STATIC_PATH.mathjax}`,
  } as const;
  public static readonly MARKDOWN_OPTIONS = {
    autoSpace: false,
    gfmAutoLink: true,
    codeBlockPreview: true,
    fixTermTypo: false,
    footnotes: true,
    linkBase: "",
    linkPrefix: "",
    listStyle: false,
    mark: false,
    mathBlockPreview: true,
    paragraphBeginningSpace: false,
    sanitize: true,
    toc: false,
  } as const;
  public static readonly HLJS_OPTIONS = {
    enable: true,
    lineNumber: false,
    defaultLang: "",
    style: "github",
  } as const;
  public static readonly MATH_OPTIONS: IMath = {
    engine: "KaTeX",
    inlineDigit: false,
    macros: {},
  } as const;
  public static readonly THEME_OPTIONS = {
    current: "light",
    list: {
      "ant-design": "Ant Design",
      "dark": "Dark",
      "light": "Light",
      "wechat": "WeChat",
    } as const,
    path: Constants.STATIC_PATH.theme,
  } as const;
}
