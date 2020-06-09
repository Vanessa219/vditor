import {hasClosestByHeadings} from "../util/hasClosestByHeadings";

export const outlineRender = (contentElement: HTMLElement, targetElement: Element, vditor?: IVditor) => {
    // let tocHTML = "";
    // Array.from(contentElement.children).forEach((item: HTMLElement, index) => {
    //     if (hasClosestByHeadings(item)) {
    //         const headingNo = parseInt(item.tagName.substring(1), 10);
    //         const space = new Array((headingNo - 1) * 2).fill("&emsp;").join("");
    //         let text = "";
    //         if (vditor && vditor.currentMode === "ir") {
    //             text = item.textContent.substring(headingNo + 1).trim();
    //         } else {
    //             text = item.textContent.trim();
    //         }
    //         const lastIndex = item.id.lastIndexOf("_");
    //         const lastId = item.id.substring(0, lastIndex === -1 ? undefined : lastIndex);
    //         item.id = lastId + "_" + index;
    //         tocHTML += `<div data-id="${item.id}" class="vditor-outline__item">${space}${text}</div>`;
    //     }
    // });

    let tocHTML = `<nav id="toc" data-toggle="toc">`;
    let preHeading = 0;
    Array.from(contentElement.children).forEach((item: HTMLElement, index) => {
        if (hasClosestByHeadings(item)) {
            const headingNo = parseInt(item.tagName.substring(1), 10);
            let text = "";
            text = item.textContent.trim();
            const lastIndex = item.id.lastIndexOf("_");
            const lastId = item.id.substring(0, lastIndex === -1 ? undefined : lastIndex);
            item.id = lastId + "_" + index;
            if( headingNo > preHeading) {         // 헤딩이 변경되는 시점에 ul과 li 태그를 넣어줌.  처음 시작은 0과 다른 숫자라 무조건 ul이 들어감.
                let count = headingNo - preHeading;
                for( let i=0; i<count; i++) {
                    tocHTML += `<ul class="nav navbar-nav">`
                }
                tocHTML += `<li><a class="nav-link" href="#${item.id}" >${text}</a>`
            } else if (headingNo < preHeading) {  
                let count = preHeading - headingNo + 1;
                for( let i=0; i<count-1; i++) {
                    tocHTML += `</li></ul>`
                }
                // tocHTML += `<ul class="nav navbar-nav"><li><a class="nav-link" href="#${item.id}" >${text}</a>`
                tocHTML += `<li><a class="nav-link" href="#${item.id}" >${text}</a>`
            } else { // headingNo == preHeading 같을 때에는 li만 넣어줌  그 앞에 있던 레벨에 대해서는 
                tocHTML += `</li><li><a class="nav-link" href="#${item.id}" >${text}</a>`
            }
            // tocHTML += `<div data-id="${item.id}" class="vditor-outline__item">${headingNo}${preHeading}${text}</div>`;
            preHeading = headingNo;
        }
    });
    for( let i=0; i<preHeading; i++) {
        tocHTML += `</li></ul></nav>`
    }

    targetElement.innerHTML = tocHTML;
    targetElement.querySelectorAll(".vditor-outline__item").forEach((item) => {
        item.addEventListener("click", (event: Event & { target: HTMLElement }) => {
            const id = item.getAttribute("data-id");
            if (vditor) {
                if (vditor.options.height === "auto") {
                    let windowScrollY = document.getElementById(id).offsetTop + vditor.element.offsetTop;
                    if (!vditor.options.toolbarConfig.pin) {
                        windowScrollY += vditor.toolbar.element.offsetHeight;
                    }
                    window.scrollTo(window.scrollX, windowScrollY);
                } else {
                    if (vditor.element.offsetTop < window.scrollY) {
                        window.scrollTo(window.scrollX, vditor.element.offsetTop);
                    }
                    if (vditor.preview.element.contains(contentElement)) {
                        contentElement.parentElement.scrollTop = document.getElementById(id).offsetTop;
                    } else {
                        contentElement.scrollTop = document.getElementById(id).offsetTop;
                    }
                }
            } else {
                window.scrollTo(window.scrollX, document.getElementById(id).offsetTop);
            }
            targetElement.querySelectorAll(".vditor-outline__item").forEach((subItem) => {
                subItem.classList.remove("vditor-outline__item--current");
            });
            item.classList.add("vditor-outline__item--current");
        });
    });
};
