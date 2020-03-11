export const isHrMD = (text: string) => {
    // - _ *
    const marker = text.trimRight().split("\n").pop();
    if (marker === "") {
        return false;
    }
    if (marker.replace(/ |-/g, "") === ""
        || marker.replace(/ |_/g, "") === ""
        || marker.replace(/ |\*/g, "") === "") {
        if (marker.replace(/ /g, "").length > 2) {
            if (marker.indexOf("-") > -1 && marker.trimLeft().indexOf(" ") === -1
                && text.trimRight().split("\n").length > 1) {
                // 满足 heading
                return false;
            }
            if (marker.indexOf("    ") === 0 || marker.indexOf("\t") === 0) {
                // 代码块
                return false;
            }
            return true;
        }
        return false;
    }
    return false;
};

export const isHeadingMD = (text: string) => {
    // - =
    const textArray = text.trimRight().split("\n");
    text = textArray.pop();

    if (text.indexOf("    ") === 0 || text.indexOf("\t") === 0) {
        return false;
    }

    text = text.trimLeft();
    if (text === "" || textArray.length === 0) {
        return false;
    }
    if (text.replace(/-/g, "") === ""
        || text.replace(/=/g, "") === "") {
        return true;
    }
    return false;
};

export const isToC = (text: string) => {
    return text.trim().toLowerCase() === "[toc]";
};

export const renderToc = (editorElement: HTMLPreElement) => {
    const tocElement = editorElement.querySelector('[data-type="toc-block"]');
    if (!tocElement) {
        return;
    }
    let tocHTML = "";
    Array.from(editorElement.children).forEach((item: HTMLElement) => {
        if (item.tagName.indexOf("H") === 0 && item.tagName.length === 2 && item.textContent.trim() !== "") {
            const space = new Array((parseInt(item.tagName.substring(1), 10) - 1) * 2).fill("&emsp;").join("");
            tocHTML += `${space}<span data-type="toc-h">${item.textContent.trim()}</span><br>`;
        }
    });
    tocElement.innerHTML = tocHTML || "[ToC]";
};
