import {Constants} from "../constants";
import {setContentTheme} from "../ui/setContentTheme";
import {addScript} from "../util/addScript";
import {hasClosestByClassName, hasClosestByMatchTag} from "../util/hasClosest";
import {merge} from "../util/merge";
import {abcRender} from "./abcRender";
import {anchorRender} from "./anchorRender";
import {chartRender} from "./chartRender";
import {codeRender} from "./codeRender";
import {flowchartRender} from "./flowchartRender";
import {graphvizRender} from "./graphvizRender";
import {highlightRender} from "./highlightRender";
import {lazyLoadImageRender} from "./lazyLoadImageRender";
import {mathRender} from "./mathRender";
import {mediaRender} from "./mediaRender";
import {mermaidRender} from "./mermaidRender";
import {mindmapRender} from "./mindmapRender";
import {plantumlRender} from "./plantumlRender";
import {setLute} from "./setLute";
import {speechRender} from "./speechRender";

const mergeOptions = (options?: IPreviewOptions) => {
    const defaultOption: IPreviewOptions = {
        anchor: 0,
        cdn: Constants.CDN,
        customEmoji: {},
        emojiPath: `${
            (options && options.emojiPath) || Constants.CDN
        }/dist/images/emoji`,
        hljs: Constants.HLJS_OPTIONS,
        icon: "ant",
        lang: "zh_CN",
        i18n: {
            alignCenter: "居中",
            alignLeft: "居左",
            alignRight: "居右",
            alternateText: "替代文本",
            bold: "粗体",
            both: "编辑 & 预览",
            check: "任务列表",
            close: "关闭",
            code: "代码块",
            "code-theme": "代码块主题预览",
            column: "列",
            comment: "评论",
            confirm: "确定",
            "content-theme": "内容主题预览",
            copied: "已复制",
            copy: "复制",
            "delete-column": "删除列",
            "delete-row": "删除行",
            devtools: "开发者工具",
            down: "下",
            downloadTip: "该浏览器不支持下载功能",
            edit: "编辑",
            "edit-mode": "切换编辑模式",
            emoji: "表情",
            export: "导出",
            fileTypeError: "文件类型不允许上传",
            footnoteRef: "脚注标识",
            fullscreen: "全屏切换",
            generate: "生成中",
            headings: "标题",
            help: "帮助",
            imageURL: "图片地址",
            indent: "列表缩进",
            info: "关于",
            "inline-code": "行内代码",
            "insert-after": "末尾插入行",
            "insert-before": "起始插入行",
            insertColumnLeft: "在左边插入一列",
            insertColumnRight: "在右边插入一列",
            insertRowAbove: "在上方插入一行",
            insertRowBelow: "在下方插入一行",
            instantRendering: "即时渲染",
            italic: "斜体",
            language: "语言",
            line: "分隔线",
            link: "链接",
            linkRef: "引用标识",
            list: "无序列表",
            more: "更多",
            nameEmpty: "文件名不能为空",
            "ordered-list": "有序列表",
            outdent: "列表反向缩进",
            outline: "大纲",
            over: "超过",
            performanceTip: "实时预览需 ${x}ms，可点击编辑 & 预览按钮进行关闭",
            preview: "预览",
            quote: "引用",
            record: "开始录音/结束录音",
            "record-tip": "该设备不支持录音功能",
            recording: "录音中...",
            redo: "重做",
            remove: "删除",
            row: "行",
            spin: "旋转",
            splitView: "分屏预览",
            strike: "删除线",
            table: "表格",
            textIsNotEmpty: "文本（不能为空）",
            title: "标题",
            tooltipText: "提示文本",
            undo: "撤销",
            up: "上",
            update: "更新",
            upload: "上传图片或文件",
            uploadError: "上传错误",
            uploading: "上传中...",
            wysiwyg: "所见即所得",
        },
        markdown: Constants.MARKDOWN_OPTIONS,
        math: Constants.MATH_OPTIONS,
        mode: "light",
        speech: {
            enable: false,
        },
        theme: Constants.THEME_OPTIONS,
    };
    return merge(defaultOption, options);
};

export const md2html = (mdText: string, options?: IPreviewOptions) => {
    const mergedOptions = mergeOptions(options);
    return addScript(`${mergedOptions.cdn}/dist/js/lute/lute.min.js`, "vditorLuteScript").then(() => {
        const lute = setLute({
            autoSpace: mergedOptions.markdown.autoSpace,
            codeBlockPreview: mergedOptions.markdown.codeBlockPreview,
            emojiSite: mergedOptions.emojiPath,
            emojis: mergedOptions.customEmoji,
            fixTermTypo: mergedOptions.markdown.fixTermTypo,
            footnotes: mergedOptions.markdown.footnotes,
            headingAnchor: mergedOptions.anchor !== 0,
            inlineMathDigit: mergedOptions.math.inlineDigit,
            lazyLoadImage: mergedOptions.lazyLoadImage,
            linkBase: mergedOptions.markdown.linkBase,
            linkPrefix: mergedOptions.markdown.linkPrefix,
            listStyle: mergedOptions.markdown.listStyle,
            mark: mergedOptions.markdown.mark,
            mathBlockPreview: mergedOptions.markdown.mathBlockPreview,
            paragraphBeginningSpace: mergedOptions.markdown.paragraphBeginningSpace,
            sanitize: mergedOptions.markdown.sanitize,
            toc: mergedOptions.markdown.toc,
        });
        if (options?.renderers) {
            lute.SetJSRenderers({
                renderers: {
                    Md2HTML: options.renderers,
                },
            });
        }
        lute.SetHeadingID(true);
        return lute.Md2HTML(mdText);
    });
};

export const previewRender = async (previewElement: HTMLDivElement, markdown: string, options?: IPreviewOptions) => {
    const mergedOptions: IPreviewOptions = mergeOptions(options);
    let html = await md2html(markdown, mergedOptions);
    if (mergedOptions.transform) {
        html = mergedOptions.transform(html);
    }
    previewElement.innerHTML = html;
    previewElement.classList.add("vditor-reset");
    setContentTheme(mergedOptions.theme.current, mergedOptions.theme.path);
    if (mergedOptions.anchor === 1) {
        previewElement.classList.add("vditor-reset--anchor");
    }
    codeRender(previewElement, mergedOptions, mergedOptions.lang);
    highlightRender(mergedOptions.hljs, previewElement, mergedOptions.cdn);
    mathRender(previewElement, {
        cdn: mergedOptions.cdn,
        math: mergedOptions.math,
    });
    mermaidRender(previewElement, mergedOptions.cdn, mergedOptions.mode);
    flowchartRender(previewElement, mergedOptions.cdn);
    graphvizRender(previewElement, mergedOptions.cdn);
    chartRender(previewElement, mergedOptions.cdn, mergedOptions.mode);
    mindmapRender(previewElement, mergedOptions.cdn, mergedOptions.mode);
    plantumlRender(previewElement, mergedOptions.cdn);
    abcRender(previewElement, mergedOptions.cdn);
    mediaRender(previewElement);
    if (mergedOptions.speech.enable) {
        speechRender(previewElement, mergedOptions.lang);
    }
    if (mergedOptions.anchor !== 0) {
        anchorRender(mergedOptions.anchor);
    }
    if (mergedOptions.after) {
        mergedOptions.after();
    }
    if (mergedOptions.lazyLoadImage) {
        lazyLoadImageRender(previewElement);
    }
    if (mergedOptions.icon) {
        addScript(`${mergedOptions.cdn}/dist/js/icons/${mergedOptions.icon}.js`, "vditorIconScript");
    }
    previewElement.addEventListener("click", (event: MouseEvent & { target: HTMLElement }) => {
        const spanElement = hasClosestByMatchTag(event.target, "SPAN");
        if (spanElement && hasClosestByClassName(spanElement, "vditor-toc")) {
            const headingElement =
                previewElement.querySelector("#" + spanElement.getAttribute("data-target-id")) as HTMLElement;
            if (headingElement) {
                window.scrollTo(window.scrollX, headingElement.offsetTop);
            }
            return;
        }
    });
};
