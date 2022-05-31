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
                hotkey: "⌘-'",
                name: "fullscreen",
                tipPosition: "nw",
            }, {
                hotkey: "⌘-a",
                name: "preview",
                tipPosition: "nw",
            }],
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
            delay: 1000,
            hljs: {
                enable: true,
                lineNumber: false,
                style: "github",
            },
            markdown: {
                autoSpace: false,
                codeBlockPreview: true,
                fixTermTypo: false,
                footnotes: true,
                linkBase: "",
                listStyle: false,
                sanitize: true,
                setext: false,
                toc: false,
            },
            math: {
                engine: "KaTeX",
                inlineDigit: false,
                macros: {},
            },
            maxWidth: 800,
            mode: "both",
            theme: "light",
            themes: {dark: "", light: "", wechat: ""},
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
