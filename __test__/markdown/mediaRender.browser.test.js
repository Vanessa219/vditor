const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const {launchBrowser} = require("../util/launchBrowser");

const compile = (file) => ts.transpileModule(fs.readFileSync(path.resolve(__dirname, file), "utf8"), {
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019},
}).outputText;

describe("media rendering after sanitization", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on("request", (request) => request.abort());
        await page.setContent("<div id='preview'></div>");
        await page.addScriptTag({path: path.resolve(__dirname, "../../src/js/lute/lute.min.js")});
        await page.addScriptTag({content: `(() => {
            const utils = {};
            new Function("exports", ${JSON.stringify(compile("../../src/ts/util/function.ts"))})(utils);
            const media = {};
            new Function("exports", "require", ${JSON.stringify(compile("../../src/ts/markdown/mediaRender.ts"))})(media, () => utils);
            window.renderMedia = media.mediaRender;
        })();`});
    });

    afterAll(async () => {
        if (browser) {
            await browser.close();
        }
    });

    const render = (url) => page.evaluate((url) => {
        window.mediaExecuted = 0;
        const lute = Lute.New();
        lute.SetSanitize(true);
        const preview = document.querySelector("#preview");
        preview.innerHTML = lute.Md2HTML(`<a href='${url}'>media</a>`);
        const href = preview.querySelector("a").getAttribute("href");
        window.renderMedia(preview);
        const media = preview.querySelector("video, audio, iframe");
        if (media) {
            media.dispatchEvent(new Event("error"));
            media.dispatchEvent(new Event("load"));
        }
        return {
            href,
            src: media?.getAttribute("src"),
            tag: media?.tagName,
            controls: media?.hasAttribute("controls"),
            className: media?.className,
            handlers: [...preview.querySelectorAll("*")].flatMap((el) =>
                [...el.attributes].filter((attr) => /^on/i.test(attr.name)).map((attr) => attr.name)),
            executed: window.mediaExecuted,
            mediaCount: preview.querySelectorAll("video, audio, iframe").length,
        };
    }, url);

    it.each(["mp4", "m4v", "ogg", "ogv", "webm", "mp3", "wav", "flac"])(
        "keeps decoded quotes inside the %s source attribute", async (extension) => {
            const url = `x" onerror="window.mediaExecuted++" y="a.${extension}`;
            const result = await render(url);
            expect(result.href).toBe(url);
            expect(result.src).toBe(url);
            expect(result.handlers).toEqual([]);
            expect(result.executed).toBe(0);
            expect(result.mediaCount).toBe(1);
        });

    it.each([
        "https://www.youtube.com/watch?v=abcdefghijk&t=1\"onload=\"window.mediaExecuted++",
        "https://v.qq.com/x/cover/test/x\" onload=\"window.mediaExecuted++\" y=\"x.html",
        "https://www.bilibili.com/video/BV1234567890?bvid=x%22%20onload=%22window.mediaExecuted++",
    ])("does not inject iframe attributes from %s", async (url) => {
        const result = await render(url);
        expect(result.tag).toBe("IFRAME");
        expect(result.handlers).toEqual([]);
        expect(result.executed).toBe(0);
        expect(result.mediaCount).toBe(1);
    });

    it.each([
        ["https://example.com/movie.mp4", "VIDEO"],
        ["/assets/music.mp3", "AUDIO"],
    ])("preserves normal media controls and source: %s", async (url, tag) => {
        expect(await render(url)).toMatchObject({tag, src: url, controls: true});
    });

    it.each([
        ["https://youtu.be/abcdefghijk?t=30", "//www.youtube.com/embed/abcdefghijk?start=30"],
        ["https://v.youku.com/v_show/id_abc.html", "//player.youku.com/embed/abc"],
        ["https://v.qq.com/x/cover/test/abc.html", "https://v.qq.com/txp/iframe/player.html?vid=abc"],
        ["https://coub.com/view/abc", "//coub.com/embed/abc?muted=false&autostart=false&originalSize=true&startWithHD=true"],
        ["https://www.facebook.com/user/videos/123", "https://www.facebook.com/plugins/video.php?href=www.facebook.com%2Fuser%2Fvideos%2F123"],
        ["https://www.dailymotion.com/video/abc?x=1", "https://www.dailymotion.com/embed/video/abc"],
        ["https://www.bilibili.com/video/BV1234567890", "https://player.bilibili.com/player.html?bvid=BV1234567890&page=1&high_quality=1&as_wide=1&allowfullscreen=true&autoplay=0"],
        ["https://www.ted.com/talks/abc", "//embed.ted.com/talks/abc"],
    ])("preserves the provider URL for %s", async (url, src) => {
        expect(await render(url)).toMatchObject({tag: "IFRAME", src, className: "iframe__video"});
    });
});
