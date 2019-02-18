import {insertText} from "../editor/index";
import {i18n} from "../i18n/index";

class Upload {
    public element: HTMLElement;
    public isUploading: boolean;

    constructor() {
        this.isUploading = false;
        this.element = document.createElement("div");
        this.element.className = "vditor-upload";
        this.element.innerHTML = '<div class="vditor-upload__progress"></div><div class="vditor-upload__close">x</div>';

        this.element.children[1].addEventListener("click", function() {
            this.parentElement.style.opacity = 0;
            this.parentElement.className = "vditor-upload";
        });
    }
}

const genUploadingLabel = (vditor: IVditor, files: DataTransferItemList | FileList | File[]): string => {
    let uploadingStr = "";
    for (let iMax = files.length, i = 0; i < iMax; i++) {
        let file = files[i];
        if (file instanceof DataTransferItem) {
            file = file.getAsFile();
        }

        const tag = file.type.indexOf("image") === -1 ? "" : "!";
        if (!file.name) {
            return "";
        }
        const lastIndex = file.name.lastIndexOf(".");
        const filename = vditor.options.upload.filename(file.name.substr(0, lastIndex)) + file.name.substr(lastIndex);
        const lang: (keyof II18nLang) = vditor.options.lang;
        if (file.size > vditor.options.upload.max) {
            vditor.upload.element.className = "vditor-upload vditor-upload--tip";
            vditor.upload.element.children[0].innerHTML =
                `${file.name} ${i18n[lang].over} ${vditor.options.upload.max / 1024 / 1024}M`;
        } else {
            uploadingStr += `${tag}[${filename}](${i18n[lang].uploading})\n`;
        }
    }
    return uploadingStr;
};

const genUploadedLabel =
    (editorElement: HTMLTextAreaElement, responseText: string, options: IOptions, uploadElement: HTMLElement) => {
    editorElement.focus();
    const response = JSON.parse(responseText);

    if (response.code === 1) {
        uploadElement.className = "vditor-upload vditor-upload--tip";
        uploadElement.children[0].innerHTML = response.msg;
    }

    response.data.errFiles.forEach((data: string) => {
        const lastIndex = data.lastIndexOf(".");
        const filename = options.upload.filename(data.substr(0, lastIndex)) + data.substr(lastIndex);
        const original = `[${filename}](${i18n[options.lang].uploading})`;
        editorElement.selectionStart = editorElement.value.split(original)[0].length;
        editorElement.selectionEnd = editorElement.selectionStart + original.length;
        insertText(editorElement, "", "", true);
    });

    Object.keys(response.data.succMap).forEach((key) => {
        const path = response.data.succMap[key];
        if (path.indexOf(".wav") === path.length - 4) {
            insertText(editorElement, `<audio controls="controls" src="${path}"></audio>\n`, "");
            return;
        }
        const lastIndex = key.lastIndexOf(".");
        const filename = options.upload.filename(key.substr(0, lastIndex)) + key.substr(lastIndex);
        const original = `[${filename}](${i18n[options.lang].uploading})`;
        editorElement.selectionStart = editorElement.value.split(original)[0].length;
        editorElement.selectionEnd = editorElement.selectionStart + original.length;
        insertText(editorElement, `[${filename}](${path})`, "", true);
    });
};

const uploadFiles = (vditor: IVditor, files: FileList | DataTransferItemList | File[], element?: HTMLInputElement) => {
    const formData = new FormData();
    const uploadFileList = []; files;
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        if (file instanceof DataTransferItem) {
            file = file.getAsFile();
        }
        if (file.size <= vditor.options.upload.max) {
            formData.append("file[]", file);
            uploadFileList.push(file);
        }
    }

    vditor.upload.element.className = "vditor-upload";
    vditor.upload.element.children[0].innerHTML = "";

    insertText(vditor.editor.element, genUploadingLabel(vditor, files), "");

    if (uploadFileList.length === 0) {
        element ? element.value = "" : "";
        return;
    }

    if (!vditor.options.upload.url || !vditor.upload) {
        element ? element.value = "" : "";
        alert("please config: options.upload.url");
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", vditor.options.upload.url);
    if (vditor.options.upload.token) {
        xhr.setRequestHeader("X-Upload-Token", vditor.options.upload.token);
    }
    vditor.upload.isUploading = true;
    vditor.editor.element.setAttribute("disabled", "disabled");

    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            vditor.upload.isUploading = false;
            element ? element.value = "" : "";
            vditor.editor.element.removeAttribute("disabled");

            if (xhr.status === 200) {
                if (vditor.options.upload.success) {
                    vditor.options.upload.success(vditor.editor.element, xhr.responseText);
                } else {
                    genUploadedLabel(vditor.editor.element, xhr.responseText, vditor.options, vditor.upload.element);
                }

                vditor.upload.element.style.opacity = "0";
            } else {
                if (vditor.options.upload.error) {
                    vditor.options.upload.error(xhr.responseText);
                } else {
                    vditor.upload.element.className = "vditor-upload vditor-upload--tip";
                    vditor.upload.element.children[0].innerHTML = xhr.responseText || "401";
                }
            }
        }
    };
    xhr.upload.onprogress = (event: ProgressEvent) => {
        if (!event.lengthComputable) {
            return;
        }
        const progress = event.loaded / event.total * 100;
        vditor.upload.element.style.opacity = "1";
        const progressBar = vditor.upload.element.children[0] as HTMLElement;
        progressBar.style.width = progress + "%";
    };
    xhr.send(formData);
};

export {Upload, uploadFiles};
