const globalAny: any = global;
globalAny.VDITOR_VERSION = "version";
import {Options} from "../../src/ts/util/Options";

describe("Options", () => {
    const cache = {
        enable: true,
        id: "vditorTest",
    };
    test("Options toolbar", () => {
        const options = new Options({
            cache,
            toolbar: ["br", "fullscreen", {
                hotkey: "⌘-a",
                name: "preview",
            }],
        });
        expect(options.merge()).toMatchObject({
            cache,
            toolbar: [{
                name: "br",
            }, {
                hotkey: "⌘'",
                name: "fullscreen",
                tipPosition: "nw",
            }, {
                hotkey: "⌘-a",
                name: "preview",
                tipPosition: "nw",
            }],
        });
    });

    test("Options line marker", () => {
        const options = new Options({
            cache,
            toolbar: ["line"],
        });
        expect(options.merge().toolbar[0]).toMatchObject({
            name: "line",
            prefix: "***",
        });
    });

    test("Options upload", () => {
        const options = new Options({
            cache,
            upload: {
                accept: ".jpg",
            },
        });
        expect(options.merge()).toMatchObject({
            cache,
            upload: {
                accept: ".jpg",
                filename: expect.anything(),
                linkToImgUrl: "",
                max: 10 * 1024 * 1024,
                url: "",
            },
        });
    });

    test("Options classes", () => {
        const options = new Options({
            cache,
            classes: {
                preview: "content-reset",
            },
        });
        expect(options.merge()).toMatchObject({
            cache,
            classes: {
                preview: "content-reset",
            },
        });
    });

    test("Options preview", () => {
        const options = new Options({
            cache,
            preview: {
                mode: "both",
                url: "https://ld246.com/md",
            },
        });
        expect(options.merge()).toMatchObject({
            cache,
            preview: {
                delay: 1000,
                mode: "both",
                url: "https://ld246.com/md",
            },
        });
    });

    test("Options preview hljs", () => {
        const options = new Options({
            cache,
            preview: {
                hljs: {
                    style: "github",
                },
                mode: "both",
            },
        });
        expect(options.merge().preview).toEqual({
            actions: ["desktop", "tablet", "mobile", "mp-wechat", "zhihu"],
            delay: 1000,
            hljs: {
                defaultLang: "",
                enable: true,
                lineNumber: false,
                style: "github",
            },
            markdown: {
                autoSpace: false,
                callout: true,
                codeBlockPreview: true,
                fixTermTypo: false,
                footnotes: true,
                gfmAutoLink: true,
                imageCaption: false,
                linkBase: "",
                linkPrefix: "",
                listStyle: false,
                mark: false,
                mathBlockPreview: true,
                paragraphBeginningSpace: false,
                sanitize: true,
                sub: false,
                sup: false,
                toc: false,
            },
            math: {
                engine: "KaTeX",
                inlineDigit: false,
                macros: {},
            },
            maxWidth: 800,
            mode: "both",
            render: {
                media: {
                    enable: true,
                },
            },
            theme: {
                current: "light",
                list: {
                    "ant-design": "Ant Design",
                    dark: "Dark",
                    light: "Light",
                    wechat: "WeChat",
                },
                path: "https://unpkg.com/vditor@version/dist/css/content-theme",
            },
        });
    });

    test("Options hint", () => {
        const options = new Options({
            cache,
            hint: {
                emoji: {
                    "+1": "👍",
                },
                emojiTail: "前往设置",
            },
        });
        expect(options.merge()).toMatchObject({
            cache,
            hint: {
                delay: 200,
                emoji: {
                    "+1": "👍",
                },
                emojiPath: "https://unpkg.com/vditor@version/dist/images/emoji",
                emojiTail: "前往设置",
            },
        });
    });

    test("Options resize", () => {
        const options = new Options({
            cache,
            resize: {
                enable: true,
            },
        });
        expect(options.merge()).toMatchObject({
            cache,
            resize: {
                enable: true,
                position: "bottom",
            },
        });
    });
});
