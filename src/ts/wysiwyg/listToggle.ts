import {hasClosestByAttribute, hasClosestByMatchTag} from "../util/hasClosest";
import {setRangeByWbr} from "./setRangeByWbr";

export const listToggle = (vditor: IVditor, range: Range, type: string, cancel = true) => {
    const itemElement = hasClosestByMatchTag(range.startContainer, "LI");
    vditor.wysiwyg.element.querySelectorAll("wbr").forEach((wbr) => {
        wbr.remove();
    });
    range.insertNode(document.createElement("wbr"));

    if (cancel && itemElement) {
        // 取消
        list2p(itemElement.parentElement);
    } else {
        if (!itemElement) {
            // 添加
            let blockElement = hasClosestByAttribute(range.startContainer, "data-block", "0");
            if (!blockElement) {
                vditor.wysiwyg.element.querySelector("wbr").remove();
                blockElement = vditor.wysiwyg.element.querySelector("p");
                blockElement.innerHTML = "<wbr>";
            }
            if (type === "check") {
                blockElement.insertAdjacentHTML("beforebegin",
                    `<ul data-block="0"><li class="vditor-task"><input type="checkbox" /> ${blockElement.innerHTML}</li></ul>`);
                blockElement.remove();
            } else if (type === "list") {
                blockElement.insertAdjacentHTML("beforebegin",
                    `<ul data-block="0"><li>${blockElement.innerHTML}</li></ul>`);
                blockElement.remove();
            } else if (type === "ordered-list") {
                blockElement.insertAdjacentHTML("beforebegin",
                    `<ol data-block="0"><li>${blockElement.innerHTML}</li></ol>`);
                blockElement.remove();
            }
        } else {
            // 切换
            if (type === "check") {
                itemElement.parentElement.querySelectorAll("li").forEach((item) => {
                    item.insertAdjacentHTML("afterbegin", '<input type="checkbox" />');
                    item.classList.add("vditor-task");
                });
            } else {
                if (itemElement.querySelector("input")) {
                    itemElement.parentElement.querySelectorAll("li").forEach((item) => {
                        item.querySelector("input").remove();
                        item.classList.remove("vditor-task");
                    });
                }
                let element;
                if (type === "list") {
                    element = document.createElement("ul");
                } else {
                    element = document.createElement("ol");
                }
                element.innerHTML = itemElement.parentElement.innerHTML;
                itemElement.parentElement.parentNode.replaceChild(element, itemElement.parentElement);
            }
        }
    }
    setRangeByWbr(vditor.wysiwyg.element, range);
};

const list2p = (listElement: HTMLElement) => {
    let pHTML = "";
    for (let i = 0; i < listElement.childElementCount; i++) {
        const inputElement = listElement.children[i].querySelector("input");
        if (inputElement) {
            inputElement.remove();
        }
        pHTML += `<p data-block="0">${listElement.children[i].innerHTML.trimLeft()}</p>`;
    }
    listElement.insertAdjacentHTML("beforebegin", pHTML);
    listElement.remove();
};
