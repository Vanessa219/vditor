import VditorMethod from "./method";
import {Constants, VDITOR_VERSION} from "./ts/constants";
import {DevTools} from "./ts/devtools";
import {Hint} from "./ts/hint/index";
import {i18n} from "./ts/i18n";
import {IR} from "./ts/ir";
import {input as irInput} from "./ts/ir/input";
import {processAfterRender} from "./ts/ir/process";
import {getHTML} from "./ts/markdown/getHTML";
import {getMarkdown} from "./ts/markdown/getMarkdown";
import {setLute} from "./ts/markdown/setLute";
import {Outline} from "./ts/outline";
import {Preview} from "./ts/preview/index";
import {Resize} from "./ts/resize/index";
import {Editor} from "./ts/sv/index";
import {inputEvent} from "./ts/sv/inputEvent";
import {processAfterRender as processSVAfterRender} from "./ts/sv/process";
import {Tip} from "./ts/tip";
import {Toolbar} from "./ts/toolbar/index";
import {disableToolbar, hidePanel} from "./ts/toolbar/setToolbar";
import {enableToolbar} from "./ts/toolbar/setToolbar";
import {initUI} from "./ts/ui/initUI";
import {setCodeTheme} from "./ts/ui/setCodeTheme";
import {setContentTheme} from "./ts/ui/setContentTheme";
import {setPreviewMode} from "./ts/ui/setPreviewMode";
import {setTheme} from "./ts/ui/setTheme";
import {Undo} from "./ts/undo";
import {Upload} from "./ts/upload/index";
import {addScript} from "./ts/util/addScript";
import {getSelectText} from "./ts/util/getSelectText";
import {Options} from "./ts/util/Options";
import {processCodeRender} from "./ts/util/processCode";
import {getCursorPosition, getEditorRange} from "./ts/util/selection";
import {WYSIWYG} from "./ts/wysiwyg";
import {input} from "./ts/wysiwyg/input";
import {renderDomByMd} from "./ts/wysiwyg/renderDomByMd";

class Vditor extends VditorMethod {

    public readonly version: string;
    public vditor: IVditor;

    /**
     * @param id 要挂载 Vditor 的元素或者元素 ID。
     * @param options Vditor 参数
     */
    constructor(id: string | HTMLElement, options?: IOptions) {
        super();
        this.version = VDITOR_VERSION;

        if (typeof id === "string") {
            if (!options) {
                options = {
                    cache: {
                        id: `vditor${id}`,
                    },
                };
            } else if (!options.cache) {
                options.cache = {id: `vditor${id}`};
            } else if (!options.cache.id) {
                options.cache.id = `vditor${id}`;
            }
            id = document.getElementById(id);
        }

        const getOptions = new Options(options);
        const mergedOptions = getOptions.merge();

        if (!["en_US", "ja_JP", "ko_KR", "zh_CN"].includes(mergedOptions.lang)) {
            throw new Error("options.lang error, see https://hacpai.com/article/1549638745630#options");
        }

        this.vditor = {
            currentMode: mergedOptions.mode,
            element: id,
            hint: new Hint(),
            lute: undefined,
            options: mergedOptions,
            originalInnerHTML: id.innerHTML,
            outline: new Outline(i18n[mergedOptions.lang].outline),
            tip: new Tip(),
        };

        this.vditor.sv = new Editor(this.vditor);
        this.vditor.undo = new Undo();
        this.vditor.wysiwyg = new WYSIWYG(this.vditor);
        this.vditor.ir = new IR(this.vditor);
        this.vditor.toolbar = new Toolbar(this.vditor);

        if (mergedOptions.resize.enable) {
            this.vditor.resize = new Resize(this.vditor);
        }

        if (this.vditor.toolbar.elements.devtools) {
            this.vditor.devtools = new DevTools();
        }

        if (mergedOptions.upload.url || mergedOptions.upload.handler) {
            this.vditor.upload = new Upload();
        }

        addScript(options._lutePath || `${mergedOptions.cdn}/dist/js/lute/lute.min.js`, "vditorLuteScript")
            .then(() => {
                this.vditor.lute = setLute({
                    autoSpace: this.vditor.options.preview.markdown.autoSpace,
                    chinesePunct: this.vditor.options.preview.markdown.chinesePunct,
                    codeBlockPreview: this.vditor.options.preview.markdown.codeBlockPreview,
                    emojiSite: this.vditor.options.hint.emojiPath,
                    emojis: this.vditor.options.hint.emoji,
                    fixTermTypo: this.vditor.options.preview.markdown.fixTermTypo,
                    footnotes: this.vditor.options.preview.markdown.footnotes,
                    headingAnchor: false,
                    inlineMathDigit: this.vditor.options.preview.math.inlineDigit,
                    linkBase: this.vditor.options.preview.markdown.linkBase,
                    listStyle: this.vditor.options.preview.markdown.listStyle,
                    paragraphBeginningSpace: this.vditor.options.preview.markdown.paragraphBeginningSpace,
                    sanitize: this.vditor.options.preview.markdown.sanitize,
                    toc: this.vditor.options.preview.markdown.toc,
                });

                this.vditor.preview = new Preview(this.vditor);

                initUI(this.vditor);

                if (mergedOptions.after) {
                    mergedOptions.after();
                }
            });
        addScript(`${mergedOptions.cdn}/dist/js/icons/${mergedOptions.icon}.js`, "vditorIconScript");
    }

    /** 设置主题 */
    public setTheme(theme: "dark" | "classic", contentTheme?: string, codeTheme?: string, contentThemePath?: string) {
        this.vditor.options.theme = theme;
        setTheme(this.vditor);
        if (contentTheme) {
            this.vditor.options.preview.theme.current = contentTheme;
            setContentTheme(contentTheme, contentThemePath || this.vditor.options.preview.theme.path);
        }
        if (codeTheme) {
            this.vditor.options.preview.hljs.style = codeTheme;
            setCodeTheme(codeTheme, this.vditor.options.cdn);
        }
    }

    /** 获取 Markdown 内容 */
    public getValue() {
        return getMarkdown(this.vditor);
    }

    /** 获取编辑器当前编辑模式 */
    public getCurrentMode() {
        return this.vditor.currentMode;
    }

    /** 聚焦到编辑器 */
    public focus() {
        if (this.vditor.currentMode === "sv") {
            this.vditor.sv.element.focus();
        } else if (this.vditor.currentMode === "wysiwyg") {
            this.vditor.wysiwyg.element.focus();
        } else if (this.vditor.currentMode === "ir") {
            this.vditor.ir.element.focus();
        }
    }

    /** 让编辑器失焦 */
    public blur() {
        if (this.vditor.currentMode === "sv") {
            this.vditor.sv.element.blur();
        } else if (this.vditor.currentMode === "wysiwyg") {
            this.vditor.wysiwyg.element.blur();
        } else if (this.vditor.currentMode === "ir") {
            this.vditor.ir.element.blur();
        }
    }

    /** 禁用编辑器 */
    public disabled() {
        hidePanel(this.vditor, ["subToolbar", "hint", "popover"]);
        disableToolbar(this.vditor.toolbar.elements, Constants.EDIT_TOOLBARS.concat(["undo", "redo", "fullscreen",
            "edit-mode"]));
        this.vditor[this.vditor.currentMode].element.setAttribute("contenteditable", "false");
    }

    /** 解除编辑器禁用 */
    public enable() {
        enableToolbar(this.vditor.toolbar.elements, Constants.EDIT_TOOLBARS.concat(["undo", "redo", "fullscreen",
            "edit-mode"]));
        this.vditor.undo.resetIcon(this.vditor);
        this.vditor[this.vditor.currentMode].element.setAttribute("contenteditable", "true");
    }

    /** 返回选中的字符串 */
    public getSelection() {
        if (this.vditor.currentMode === "wysiwyg") {
            return getSelectText(this.vditor.wysiwyg.element);
        } else if (this.vditor.currentMode === "sv") {
            return getSelectText(this.vditor.sv.element);
        } else if (this.vditor.currentMode === "ir") {
            return getSelectText(this.vditor.ir.element);
        }
    }

    /** 设置预览区域内容 */
    public renderPreview(value?: string) {
        this.vditor.preview.render(this.vditor, value);
    }

    /** 获取焦点位置 */
    public getCursorPosition() {
        return getCursorPosition(this.vditor[this.vditor.currentMode].element);
    }

    /** 上传是否还在进行中 */
    public isUploading() {
        return this.vditor.upload.isUploading;
    }

    /** 清除缓存 */
    public clearCache() {
        localStorage.removeItem(this.vditor.options.cache.id);
    }

    /** 禁用缓存 */
    public disabledCache() {
        this.vditor.options.cache.enable = false;
    }

    /** 启用缓存 */
    public enableCache() {
        if (!this.vditor.options.cache.id) {
            throw new Error("need options.cache.id, see https://hacpai.com/article/1549638745630#options");
            return;
        }
        this.vditor.options.cache.enable = true;
    }

    /** HTML 转 md */
    public html2md(value: string) {
        return this.vditor.lute.HTML2Md(value);
    }

    /** 获取 HTML */
    public getHTML() {
        return getHTML(this.vditor);
    }

    /** 消息提示。time 为 0 将一直显示 */
    public tip(text: string, time?: number) {
        this.vditor.tip.show(text, time);
    }

    /** 设置预览模式 */
    public setPreviewMode(mode: "both" | "editor") {
        setPreviewMode(mode, this.vditor);
    }

    /** 删除选中内容 */
    public deleteValue() {
        if (window.getSelection().isCollapsed) {
            return;
        }
        document.execCommand("delete", false);
    }

    /** 更新选中内容 */
    public updateValue(value: string) {
        document.execCommand("insertHTML", false, value);
    }

    /** 在焦点处插入内容，并默认进行 Markdown 渲染 */
    public insertValue(value: string, render = true) {
        const range = getEditorRange(this.vditor[this.vditor.currentMode].element);
        range.collapse(true);
        if (this.vditor.currentMode === "sv") {
            this.vditor.sv.preventInput = true;
            document.execCommand("insertHTML", false, value);
            if (render) {
                inputEvent(this.vditor);
            }
        } else if (this.vditor.currentMode === "wysiwyg") {
            this.vditor.wysiwyg.preventInput = true;
            document.execCommand("insertHTML", false, value);
            if (render) {
                input(this.vditor, getSelection().getRangeAt(0));
            }
        } else if (this.vditor.currentMode === "ir") {
            this.vditor.ir.preventInput = true;
            document.execCommand("insertHTML", false, value);
            if (render) {
                irInput(this.vditor, getSelection().getRangeAt(0), true);
            }
        }
    }

    /** 设置编辑器内容 */
    public setValue(markdown: string, clearStack = false) {
        if (this.vditor.currentMode === "sv") {
            this.vditor.sv.element.innerHTML = this.vditor.lute.SpinVditorSVDOM(markdown);
            processSVAfterRender(this.vditor, {
                enableAddUndoStack: clearStack,
                enableHint: false,
                enableInput: false,
            });
        } else if (this.vditor.currentMode === "wysiwyg") {
            renderDomByMd(this.vditor, markdown, {
                enableAddUndoStack: clearStack,
                enableHint: false,
                enableInput: false,
            });
        } else {
            this.vditor.ir.element.innerHTML = this.vditor.lute.Md2VditorIRDOM(markdown);
            this.vditor.ir.element.querySelectorAll(".vditor-ir__preview[data-render='2']").forEach(
                (item: HTMLElement) => {
                    processCodeRender(item, this.vditor);
                });
            processAfterRender(this.vditor, {
                enableAddUndoStack: clearStack,
                enableHint: false,
                enableInput: false,
            });
        }

        this.vditor.outline.render(this.vditor);

        if (!markdown) {
            hidePanel(this.vditor, ["emoji", "headings", "submenu", "hint"]);
            if (this.vditor.wysiwyg.popover) {
                this.vditor.wysiwyg.popover.style.display = "none";
            }
            this.clearCache();
        }
        if (clearStack) {
            this.clearStack();
        }
    }

    /** 清空 undo & redo 栈 */
    public clearStack() {
        this.vditor.undo.clearStack(this.vditor);
        this.vditor.undo.addToUndoStack(this.vditor);
    }

    /** 销毁编辑器 */
    public destroy() {
        this.vditor.element.innerHTML = this.vditor.originalInnerHTML;
        this.vditor.element.classList.remove("vditor");
        this.vditor.element.removeAttribute("style");
        document.getElementById("vditorIconScript").remove();
        this.clearCache();
    }
}

export default Vditor;
