import {hasClosestByHeadings} from "../util/hasClosestByHEadings";

export const outlineRender = (contentElement: HTMLElement, targetElement: Element) => {
    let tocHTML = "";
    const isIR = contentElement.parentElement.classList.contains("vditor-ir");
    Array.from(contentElement.children).forEach((item: HTMLElement) => {
        if (hasClosestByHeadings(item)) {
            const headingNo = parseInt(item.tagName.substring(1), 10);
            const space = new Array((headingNo - 1) * 2).fill("&emsp;").join("");
            if (isIR) {
                tocHTML += `${space}<span data-type="toc-h">${item.textContent.substring(headingNo + 1).trim()}</span><br>`;
            } else {
                tocHTML += `${space}<span data-type="toc-h">${item.textContent.trim()}</span><br>`;
            }
        }
    });
    targetElement.innerHTML = tocHTML || 'Outline';
};
