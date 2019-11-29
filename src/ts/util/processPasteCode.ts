export const processPasteCode = (html: string, text: string, type: string = "markdown") => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    let isCode = false;
    if (tempElement.childElementCount === 1 &&
        (tempElement.lastElementChild as HTMLElement).style.fontFamily.indexOf("monospace") > -1) {
        // VS Code
        isCode = true;
    }
    const pres = tempElement.querySelectorAll("pre");
    if (tempElement.childElementCount === 1 && pres.length === 1 && pres[0].className !== "vditor-textarea") {
        // IDE
        isCode = true;
    }
    if (html.indexOf('\n<p class="p1">') === 0) {
        // Xcode
        isCode = true;
    }

    if (isCode) {
        const code = text || html;
        if (type === "wysiwyg") {
            return `${code}`;
        }
        if (/\n/.test(code)) {
            return "```\n" + code + "\n```";
        } else {
            return `\`${code}\``;
        }
    }
    return false;
};
