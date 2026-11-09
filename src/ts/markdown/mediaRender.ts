import {getSearch} from "../util/function";

const replaceMedia = (element: HTMLElement, tag: "video" | "audio" | "iframe", url: string) => {
    const media = element.ownerDocument.createElement(tag);
    if (tag === "iframe") {
        media.className = "iframe__video";
    } else {
        media.setAttribute("controls", "controls");
    }
    // 链接属性经 DOM 解码后可能包含引号，直接设置属性以保留 URL 的数据语义。
    media.setAttribute("src", url);
    element.replaceWith(media);
};

const iframeRender = (element: HTMLElement, url: string) => {
    const youtubeMatch = url.match(/\/\/(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w|-]{11})(?:(?:[\?&]t=)(\S+))?/);
    const youkuMatch = url.match(/\/\/v\.youku\.com\/v_show\/id_(\w+)=*\.html/);
    const qqMatch = url.match(/\/\/v\.qq\.com\/x\/cover\/.*\/([^\/]+)\.html\??.*/);
    const coubMatch = url.match(/(?:www\.|\/\/)coub\.com\/view\/(\w+)/);
    const facebookMatch = url.match(/(?:www\.|\/\/)facebook\.com\/([^\/]+)\/videos\/([0-9]+)/);
    const dailymotionMatch = url.match(/.+dailymotion.com\/(video|hub)\/(\w+)\?/);
    const bilibiliMatch = url.match(/(?:www\.|\/\/)bilibili\.com\/video\/(\w+)/);
    const tedMatch = url.match(/(?:www\.|\/\/)ted\.com\/talks\/(\w+)/);

    if (youtubeMatch && youtubeMatch[1].length === 11) {
        replaceMedia(element, "iframe", `//www.youtube.com/embed/${youtubeMatch[1] +
            (youtubeMatch[2] ? "?start=" + youtubeMatch[2] : "")}`);
    } else if (youkuMatch && youkuMatch[1]) {
        replaceMedia(element, "iframe", `//player.youku.com/embed/${youkuMatch[1]}`);
    } else if (qqMatch && qqMatch[1]) {
        replaceMedia(element, "iframe", `https://v.qq.com/txp/iframe/player.html?vid=${qqMatch[1]}`);
    } else if (coubMatch && coubMatch[1]) {
        replaceMedia(element, "iframe",
            `//coub.com/embed/${coubMatch[1]}?muted=false&autostart=false&originalSize=true&startWithHD=true`);
    } else if (facebookMatch && facebookMatch[0]) {
        replaceMedia(element, "iframe",
            `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(facebookMatch[0])}`);
    } else if (dailymotionMatch && dailymotionMatch[2]) {
        replaceMedia(element, "iframe", `https://www.dailymotion.com/embed/video/${dailymotionMatch[2]}`);
    } else if (url.indexOf("bilibili.com") > -1 && (url.indexOf("bvid=") > -1 || (bilibiliMatch && bilibiliMatch[1]))) {
        const params: IObject = {
            bvid:  getSearch("bvid", url) || (bilibiliMatch && bilibiliMatch[1]),
            page: "1",
            high_quality: "1",
            as_wide: "1",
            allowfullscreen: "true",
            autoplay: "0"
        };
        new URL(url.startsWith("http") ? url : "https:" + url).search.split("&").forEach((item, index) => {
            if (!item) {
                return;
            }
            if (index === 0) {
                item = item.substr(1);
            }
            const keyValue = item.split("=");
            params[keyValue[0]] = keyValue[1];
        });
        let src = "https://player.bilibili.com/player.html?";
        const keys = Object.keys(params);
        keys.forEach((key, index) => {
            src += `${key}=${params[key]}`;
            if (index < keys.length - 1) {
                src += "&";
            }
        });
        replaceMedia(element, "iframe", src);
    } else if (tedMatch && tedMatch[1]) {
        replaceMedia(element, "iframe", `//embed.ted.com/talks/${tedMatch[1]}`);
    }
};

export const mediaRender = (element: HTMLElement) => {
    if (!element) {
        return;
    }
    element.querySelectorAll("a").forEach((aElement) => {
        const url = aElement.getAttribute("href");
        if (!url) {
            return;
        }
        if (url.match(/^.+.(mp4|m4v|ogg|ogv|webm)$/)) {
            replaceMedia(aElement, "video", url);
        } else if (url.match(/^.+.(mp3|wav|flac)$/)) {
            replaceMedia(aElement, "audio", url);
        } else {
            iframeRender(aElement, url);
        }
    });
};
