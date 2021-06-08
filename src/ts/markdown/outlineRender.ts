import {hasClosestByHeadings} from "../util/hasClosestByHeadings";
import {mathRender} from "./mathRender";

export const outlineRender = (contentElement: HTMLElement, targetElement: Element, vditor?: IVditor, scrollElement?: HTMLElement) => {
    let tocHTML = "";
    const ids: string[] = [];
    Array.from(contentElement.children).forEach((item: HTMLElement, index: number) => {
        if (hasClosestByHeadings(item)) {
            if (vditor) {
                const lastIndex = item.id.lastIndexOf("_");
                item.id = item.id.substring(0, lastIndex === -1 ? undefined : lastIndex) + "_" + index;
            }
            ids.push(item.id);
            tocHTML += item.outerHTML.replace("<wbr>", "");
        }
    });
    if (tocHTML === "") {
        targetElement.innerHTML = "";
        return "";
    }
    const tempElement = document.createElement("div");
    if (vditor) {
        vditor.lute.SetToC(true);
        if (vditor.currentMode === "wysiwyg" && !vditor.preview.element.contains(contentElement)) {
            tempElement.innerHTML = vditor.lute.SpinVditorDOM("<p>[ToC]</p>" + tocHTML);
        } else if (vditor.currentMode === "ir" && !vditor.preview.element.contains(contentElement)) {
            tempElement.innerHTML = vditor.lute.SpinVditorIRDOM("<p>[ToC]</p>" + tocHTML);
        } else {
            tempElement.innerHTML = vditor.lute.HTML2VditorDOM("<p>[ToC]</p>" + tocHTML);
        }
        vditor.lute.SetToC(vditor.options.preview.markdown.toc);
    } else {
        targetElement.classList.add("vditor-outline");
        const lute = Lute.New();
        lute.SetToC(true);
        tempElement.innerHTML = lute.HTML2VditorDOM("<p>[ToC]</p>" + tocHTML);
    }
    const headingsElement = tempElement.firstElementChild.querySelectorAll("li > span[data-target-id]");
    headingsElement.forEach((item, index) => {
        if (item.nextElementSibling && item.nextElementSibling.tagName === "UL") {
            item.innerHTML = `<span class='vditor-outline__action'></span><span class='vditor-outline__item'>${item.innerHTML}</span>`;
        } else {
            item.innerHTML = `<span class='vditor-outline__item'>${item.innerHTML}</span>`;
        }
        item.setAttribute("data-target-id", ids[index]);
    });
    tocHTML = tempElement.firstElementChild.innerHTML;
    if (headingsElement.length === 0) {
        targetElement.innerHTML = "";
        return tocHTML;
    }
    targetElement.innerHTML = tocHTML;
    if (vditor) {
        mathRender(targetElement as HTMLElement, {
            cdn: vditor.options.cdn,
            math: vditor.options.preview.math,
        });
    }
    targetElement.firstElementChild.addEventListener("click", (event: Event) => {
        let target = event.target as HTMLElement;
        while (target && !target.isEqualNode(targetElement)) {
            if (target.classList.contains("vditor-outline__action")) {
                if (target.classList.contains("vditor-outline__action--close")) {
                    target.classList.remove("vditor-outline__action--close");
                    target.parentElement.nextElementSibling.setAttribute("style", "display:block");
                } else {
                    target.classList.add("vditor-outline__action--close");
                    target.parentElement.nextElementSibling.setAttribute("style", "display:none");
                }
                event.preventDefault();
                event.stopPropagation();
                break;
            } else if (target.getAttribute("data-target-id")) {
                event.preventDefault();
                event.stopPropagation();
                const idElement = document.getElementById(target.getAttribute("data-target-id"));
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
                    if (scrollElement) {
                        scrollElement.scrollTo(window.scrollX, idElement.offsetTop - scrollElement.offsetTop);
                    } else {
                        window.scrollTo(window.scrollX, idElement.offsetTop);
                    }
                }
                break;
            }
            target = target.parentElement;
        }
    });
    // 目录加上 active
    const handleScrollEvent = () => {
        const offsetTop = scrollElement && scrollElement.offsetTop || 0;
        const scrollY = scrollElement ? scrollElement.scrollTop : window.scrollY;
        const totalHeight = scrollY + 30 + offsetTop;
        const navs = document.querySelectorAll('.vditor-outline__item'); // 大纲
        const titles: NodeListOf<HTMLElement> = document.querySelectorAll('.vditor__heading'); // 内容
        for(let i = 0; i < titles.length; i++){
                if(titles[i].offsetTop <= totalHeight && titles[i+1] && titles[i+1].offsetTop > totalHeight){
                    navs[i] && navs[i].classList.add("active");
                } else {
                    navs[i].classList.remove("active");
                }
        }
    };
    (scrollElement || window).addEventListener('scroll', handleScrollEvent);

    return tocHTML;
};
