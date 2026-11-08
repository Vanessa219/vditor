import {setHeaders} from "./setHeaders";

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
        vditor[vditor.currentMode].element.querySelectorAll("img").forEach(img => {
            if (img.getAttribute("src") !== original) {
                return;
            }
            img.setAttribute("src", url);
            if (vditor.currentMode === "ir") {
                img.previousElementSibling.previousElementSibling.textContent = url;
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
    xhr.send(JSON.stringify({url: src}));
};
