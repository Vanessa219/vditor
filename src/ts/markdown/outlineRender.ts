import {hasClosestByHeadings} from "../util/hasClosestByHeadings";
import {mathRender} from "./mathRender";

export const outlineRender = (contentElement: HTMLElement, targetElement: Element, vditor?: IVditor) => {
    let tocHTML = "";
    const ids: string[] = []
    Array.from(contentElement.children).forEach((item: HTMLElement, index: number) => {
        if (hasClosestByHeadings(item)) {
            const lastIndex = item.id.lastIndexOf("_");
            item.id = item.id.substring(0, lastIndex === -1 ? undefined : lastIndex) + "_" + index;
            ids.push(item.id);
            tocHTML += item.outerHTML.replace("<wbr>", "");
        }
    });
    if (tocHTML !== "") {
        const tempElement = document.createElement("div");
        if (vditor) {
            if (vditor.currentMode === "wysiwyg") {
                tempElement.innerHTML = vditor.lute.SpinVditorDOM("<p>[ToC]</p>" + tocHTML);
            } else if (vditor.currentMode === "ir") {
                tempElement.innerHTML = vditor.lute.SpinVditorIRDOM("<p>[ToC]</p>" + tocHTML);
            }
        } else {
            const lute = Lute.New();
            lute.SetToC(true);
            tempElement.innerHTML = lute.HTML2VditorDOM("<p>[ToC]</p>" + tocHTML);
        }
        tempElement.firstElementChild.querySelectorAll("li > span[data-target-id]").forEach((item, index) => {
            item.setAttribute("data-target-id", ids[index]);
        });
        tocHTML = tempElement.firstElementChild.innerHTML;
        targetElement.innerHTML = tocHTML;
        if (vditor) {
            mathRender(targetElement as HTMLElement, {
                cdn: vditor.options.cdn,
                math: vditor.options.preview.math,
            });
        }
        targetElement.querySelectorAll("li > span").forEach((item) => {
            item.addEventListener("click", (event: Event & { target: HTMLElement }) => {
                const idElement = document.getElementById(item.getAttribute("data-target-id"));
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
            });
        });
    }
    return tocHTML;
};
