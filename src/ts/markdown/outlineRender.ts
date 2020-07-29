import {hasClosestByHeadings} from "../util/hasClosestByHeadings";

export const outlineRender = (contentElement: HTMLElement, targetElement: Element, vditor?: IVditor) => {
    let tocHTML = "";
    Array.from(contentElement.children).forEach((item: HTMLElement, index) => {
        if (hasClosestByHeadings(item)) {
            const headingNo = parseInt(item.tagName.substring(1), 10);
            const space = new Array((headingNo - 1) * 2).fill("&emsp;").join("");
            let text = "";
            if (vditor && vditor.currentMode === "ir") {
                const markerElement = item.querySelector('[data-type="heading-marker"]');
                if (markerElement.getAttribute("data-render") === "2") {
                    text = item.textContent.replace(markerElement.textContent, "").trim();
                } else {
                    text = item.textContent.substring(headingNo + 1).trim();
                }
            } else {
                text = item.textContent.trim();
            }
            const lastIndex = item.id.lastIndexOf("_");
            const lastId = item.id.substring(0, lastIndex === -1 ? undefined : lastIndex);
            item.id = lastId + "_" + index;
            tocHTML += `<div data-id="${item.id}" class="vditor-outline__item">${space}${text}</div>`;
        }
    });
    targetElement.innerHTML = tocHTML;
    targetElement.querySelectorAll(".vditor-outline__item").forEach((item) => {
        item.addEventListener("click", (event: Event & { target: HTMLElement }) => {
            const idElement = document.getElementById(item.getAttribute("data-id"));
            if (!idElement) {
                return;
            }
            if (vditor) {
                if (vditor.options.height === "auto") {
                    let windowScrollY = idElement.offsetTop + vditor.element.offsetTop;
                    if (!vditor.options.toolbarConfig.pin) {
                        windowScrollY += vditor.toolbar.element.offsetHeight;
                    }
                    window.scrollTo(window.scrollX, windowScrollY);
                } else {
                    if (vditor.element.offsetTop < window.scrollY) {
                        window.scrollTo(window.scrollX, vditor.element.offsetTop);
                    }
                    if (vditor.preview.element.contains(contentElement)) {
                        contentElement.parentElement.scrollTop = idElement.offsetTop;
                    } else {
                        contentElement.scrollTop = idElement.offsetTop;
                    }
                }
            } else {
                window.scrollTo(window.scrollX, idElement.offsetTop);
            }
            targetElement.querySelectorAll(".vditor-outline__item").forEach((subItem) => {
                subItem.classList.remove("vditor-outline__item--current");
            });
            item.classList.add("vditor-outline__item--current");
        });
    });
};
