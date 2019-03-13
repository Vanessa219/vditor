import {Options} from '../../src/ts/util/Options';

describe('Options', () => {
    test('Options toolbar', () => {
        const options = new Options({
            toolbar: ['br', 'fullscreen', {
                hotkey: "⌘-a",
                name: "preview",
            }]
        });
        expect(options.merge()).toMatchObject({
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
        })
    });

    test('Options upload', () => {
        const options = new Options({
            upload: {
                accept: '.jpg'
            }
        });
        expect(options.merge()).toMatchObject({
            upload: {
                filename: expect.anything(),
                linkToImgUrl: "",
                max: 10 * 1024 * 1024,
                url: "",
                accept: '.jpg'
            },
        })
    })

    test('Options classes', () => {
        const options = new Options({
            classes: {
                preview: "content-reset",
            },
        });
        expect(options.merge()).toMatchObject({
            classes: {
                preview: "content-reset",
            },
        })
    });


    test('Options preview', () => {
        const options = new Options({
            preview: {
                url: 'https://hacpai.com/md',
                show: true,
            },
        });
        expect(options.merge()).toMatchObject({
            preview: {
                url: 'https://hacpai.com/md',
                delay: 1000,
                show: true,
            },
        })
    });

    test('Options preview hljs', () => {
        const options = new Options({
            preview: {
                show: true,
                hljs: {
                    style: 'github'
                }
            },
        });
        expect(options.merge().preview).toEqual({
            delay: 1000,
            show: true,
            hljs: {
                style: 'github',
                "enable": true,
            }
        })
    });

    test('Options hint', () => {
        const options = new Options({
            hint: {
                emojiTail: '前往设置',
                emoji: {
                    "+1": "👍",
                },
            },
        });
        expect(options.merge()).toMatchObject({
            hint: {
                delay: 200,
                emojiTail: '前往设置',
                emoji: {
                    "+1": "👍",
                },
                emojiPath: "https://cdn.jsdelivr.net/npm/vditor/src/assets/emoji",
            },
        })
    });

    test('Options resize', () => {
        const options = new Options({
            resize: {
                enable: true,
            },
        })
        expect(options.merge()).toMatchObject({
            resize: {
                enable: true,
                position: "bottom",
            },
        })
    });
})