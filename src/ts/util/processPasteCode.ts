
export const processPasteCode = (html: string, text: string, type = "sv") => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    let isCode = false;
    if (tempElement.childElementCount === 1 &&
        (tempElement.lastElementChild as HTMLElement).style.fontFamily.indexOf("monospace") > -1) {
        // VS Code
        isCode = true;
    }
    const pres = tempElement.querySelectorAll("pre");
    if (tempElement.childElementCount === 1 && pres.length === 1
        && pres[0].className !== "vditor-wysiwyg"
        && pres[0].className !== "vditor-textarea") {
        // IDE
        isCode = true;
    }
    if (html.indexOf('\n<p class="p1">') === 0) {
        // Xcode
        isCode = true;
    }

    if (isCode) {
        const code = text || html;
        if (/\n/.test(code) || pres.length === 1) {
            if (type === "wysiwyg") {
                return `<div class="vditor-wysiwyg__block" data-block="0" data-type="code-block"><pre><code>${
                    code.replace(/&/g, "&amp;").replace(/</g, "&lt;")}<wbr></code></pre></div>`;
            }
            return "```\n" + code + "\n```";
        } else {
            if (type === "wysiwyg") {
                return `<code>${code.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</code><wbr>`;
            }
            return `\`${code}\``;
        }
    }
    return false;
};
