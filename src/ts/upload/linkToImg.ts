import {setHeaders} from "./setHeaders";

const getDisplayURLs = (vditor: IVditor, urls: string[]) => {
    if (!vditor.options.preview.markdown.linkBase && !vditor.options.preview.markdown.linkPrefix) {
        return urls;
    }
    const lute = Lute.New();
    const image = document.createElement("img");
    const markdown = urls.map(url => {
        image.setAttribute("src", url);
        return lute.HTML2Md(image.outerHTML);
    });
    lute.SetLinkBase(vditor.options.preview.markdown.linkBase);
    lute.SetLinkPrefix(vditor.options.preview.markdown.linkPrefix);
    const content = document.createElement("div");
    return markdown.map((value, index) => {
        content.innerHTML = lute.Md2HTML(value);
        return content.querySelector("img")?.getAttribute("src") || urls[index];
    });
};

const replaceImageURL = (vditor: IVditor, original: string, url: string, afterRender: () => void) => {
    if (!original || !url) {
        return;
    }
    if (vditor.currentMode === "sv") {
        const element = vditor.sv.element;
        const start = element.selectionStart;
        const end = element.selectionEnd;
        element.value = element.value.split(original).join(url);
        element.setSelectionRange(start, end);
    } else {
        const [originalDisplay, display] = getDisplayURLs(vditor, [original, url]);
        vditor[vditor.currentMode].element.querySelectorAll("img").forEach(img => {
            if (img.getAttribute("src") !== original && img.getAttribute("src") !== originalDisplay) {
                return;
            }
            img.setAttribute("src", display);
            if (vditor.currentMode === "ir") {
                const marker = img.closest('[data-type="img"]')?.querySelector(".vditor-ir__marker--link");
                if (marker) {
                    marker.textContent = url;
                }
            }
        });
    }
    afterRender();
};

export const uploadLinkToImg = (vditor: IVditor, src: string, afterRender: () => void) => {
    const upload = vditor.options.upload;
    if (upload.linkToImgHandler) {
        Promise.resolve().then(() => upload.linkToImgHandler(src)).then(url => {
            replaceImageURL(vditor, src, url, afterRender);
        }).catch(error => vditor.tip.show(error instanceof Error ? error.message : String(error)));
        return;
    }
    const xhr = new XMLHttpRequest();
    xhr.open("POST", upload.linkToImgUrl);
    if (upload.token) {
        xhr.setRequestHeader("X-Upload-Token", upload.token);
    }
    if (upload.withCredentials) {
        xhr.withCredentials = true;
    }
    setHeaders(vditor, xhr);
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status === 200) {
            let responseText = xhr.responseText;
            if (upload.linkToImgFormat) {
                responseText = upload.linkToImgFormat(responseText);
            }
            const response = JSON.parse(responseText);
            if (response.code !== 0) {
                vditor.tip.show(response.msg);
                return;
            }
            replaceImageURL(vditor, response.data.originalURL, response.data.url, afterRender);
        } else {
            vditor.tip.show(xhr.responseText);
        }
        upload.linkToImgCallback?.(xhr.responseText);
    };
    const extraData = Object.fromEntries(Object.entries(upload.extraData || {})
        .filter(([, value]) => typeof value === "string"));
    xhr.send(JSON.stringify({...extraData, url: src}));
};
