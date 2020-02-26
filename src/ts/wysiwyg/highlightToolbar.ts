import afterSVG from "../../assets/icons/after.svg";
import alignCenterSVG from "../../assets/icons/align-center.svg";
import beforeSVG from "../../assets/icons/before.svg";
import indentSVG from "../../assets/icons/indent.svg";
import outdentSVG from "../../assets/icons/outdent.svg";
import trashcanSVG from "../../assets/icons/trashcan.svg";
import {Constants} from "../constants";
import {setSelectionFocus} from "../editor/setSelection";
import {i18n} from "../i18n";
import {disableToolbar} from "../toolbar/disableToolbar";
import {enableToolbar} from "../toolbar/enableToolbar";
import {removeCurrentToolbar} from "../toolbar/removeCurrentToolbar";
import {setCurrentToolbar} from "../toolbar/setCurrentToolbar";
import {isCtrl, updateHotkeyTip} from "../util/compatibility";
import {
    getTopList,
    hasClosestByAttribute,
    hasClosestByClassName,
    hasClosestByMatchTag,
    hasClosestByTag,
    hasTopClosestByTag,
} from "../util/hasClosest";
import {addP2Li} from "./addP2Li";
import {afterRenderEvent} from "./afterRenderEvent";
import {nextIsImg} from "./inlineTag";
import {processCodeRender} from "./processCodeRender";
import {setRangeByWbr} from "./setRangeByWbr";

export const highlightToolbar = (vditor: IVditor) => {
    clearTimeout(vditor.wysiwyg.hlToolbarTimeoutId);
    vditor.wysiwyg.hlToolbarTimeoutId = window.setTimeout(() => {
        if (getSelection().rangeCount === 0) {
            return;
        }

        const allToolbar = ["headings", "bold", "italic", "strike", "line", "quote",
            "list", "ordered-list", "check", "code", "inline-code", "upload", "link", "table", "record"];
        removeCurrentToolbar(vditor.toolbar.elements, allToolbar);
        enableToolbar(vditor.toolbar.elements, allToolbar);

        const range = getSelection().getRangeAt(0);
        let typeElement = range.startContainer as HTMLElement;
        if (range.startContainer.nodeType === 3) {
            typeElement = range.startContainer.parentElement;
        }
        if (typeElement.classList.contains("vditor-reset")) {
            typeElement = typeElement.childNodes[range.startOffset] as HTMLElement;
        }

        // 工具栏高亮和禁用
        const liElement = hasClosestByMatchTag(typeElement, "LI");
        if (hasClosestByClassName(typeElement, "vditor-task")) {
            setCurrentToolbar(vditor.toolbar.elements, ["check"]);
        } else {
            if (liElement && liElement.parentElement.tagName === "OL") {
                setCurrentToolbar(vditor.toolbar.elements, ["ordered-list"]);
            }
            if (liElement && liElement.parentElement.tagName === "UL") {
                setCurrentToolbar(vditor.toolbar.elements, ["list"]);
            }
        }

        if (hasClosestByMatchTag(typeElement, "BLOCKQUOTE")) {
            setCurrentToolbar(vditor.toolbar.elements, ["quote"]);
        }

        if (hasClosestByMatchTag(typeElement, "B") || hasClosestByMatchTag(typeElement, "STRONG")) {
            setCurrentToolbar(vditor.toolbar.elements, ["bold"]);
        }

        if (hasClosestByMatchTag(typeElement, "I") || hasClosestByMatchTag(typeElement, "EM")) {
            setCurrentToolbar(vditor.toolbar.elements, ["italic"]);
        }

        if (hasClosestByMatchTag(typeElement, "STRIKE") || hasClosestByMatchTag(typeElement, "S")) {
            setCurrentToolbar(vditor.toolbar.elements, ["strike"]);
        }

        const aElement = hasClosestByMatchTag(typeElement, "A");
        if (aElement) {
            setCurrentToolbar(vditor.toolbar.elements, ["link"]);
        }
        const tableElement = hasClosestByMatchTag(typeElement, "TABLE") as HTMLTableElement;
        if (hasClosestByMatchTag(typeElement, "CODE")) {
            if (hasClosestByMatchTag(typeElement, "PRE")) {
                disableToolbar(vditor.toolbar.elements, ["headings", "bold", "italic", "strike", "line", "quote",
                    "list", "ordered-list", "check", "code", "inline-code", "upload", "link", "table", "record"]);
                setCurrentToolbar(vditor.toolbar.elements, ["code"]);
            } else {
                disableToolbar(vditor.toolbar.elements, ["headings", "bold", "italic", "strike", "line", "quote",
                    "list", "ordered-list", "check", "code", "upload", "link", "table", "record"]);
                setCurrentToolbar(vditor.toolbar.elements, ["inline-code"]);
            }
        } else if (hasClosestByTag(typeElement, "H")) {
            disableToolbar(vditor.toolbar.elements, ["bold"]);
            setCurrentToolbar(vditor.toolbar.elements, ["headings"]);
        } else if (tableElement) {
            disableToolbar(vditor.toolbar.elements, ["table"]);
        }

        // list popover
        const topOlElement = hasTopClosestByTag(typeElement, "OL");
        const topUlElement = hasTopClosestByTag(typeElement, "UL");
        let topListElement = topUlElement as HTMLElement;
        if (topOlElement && (!topUlElement || (topUlElement && topOlElement.contains(topUlElement)))) {
            topListElement = topOlElement;
        }
        if (topListElement) {
            vditor.wysiwyg.popover.innerHTML = "";
            const outdent = document.createElement("button");
            outdent.innerHTML = outdentSVG;
            outdent.setAttribute("data-type", "outdent");
            outdent.setAttribute("aria-label", i18n[vditor.options.lang].unindent +
                "<" + updateHotkeyTip("⌘-⇧-s") + ">");
            outdent.className = "vditor-icon vditor-tooltipped vditor-tooltipped__n";
            outdent.onclick = () => {
                if (!liElement) {
                    return;
                }
                listOutdent(vditor, liElement, range, topListElement);
            };

            const indent = document.createElement("button");
            indent.innerHTML = indentSVG;
            indent.setAttribute("data-type", "indent");
            indent.setAttribute("aria-label", i18n[vditor.options.lang].indent +
                "<" + updateHotkeyTip("⌘-⇧-e") + ">");
            indent.className = "vditor-icon vditor-tooltipped vditor-tooltipped__n";
            indent.onclick = () => {
                if (liElement && liElement.previousElementSibling) {
                    vditor.wysiwyg.element.querySelectorAll("wbr").forEach((wbr) => {
                        wbr.remove();
                    });
                    range.insertNode(document.createElement("wbr"));
                    const parentTagName = liElement.parentElement.tagName;
                    let marker = liElement.getAttribute("data-marker");
                    if (marker.length !== 1) {
                        marker = `1${marker.slice(-1)}`;
                    }
                    liElement.previousElementSibling.insertAdjacentHTML("beforeend",
                        `<${parentTagName} data-block="0"><li data-marker="${marker}">${liElement.innerHTML}</li></${parentTagName}>`);
                    liElement.remove();

                    // D 说需要调用 2 次，方可没有 p
                    addP2Li(topListElement);
                    const tempELement = document.createElement("div");
                    tempELement.innerHTML = vditor.lute.SpinVditorDOM(topListElement.outerHTML);
                    addP2Li(tempELement);
                    topListElement.outerHTML = vditor.lute.SpinVditorDOM(tempELement.innerHTML);

                    setRangeByWbr(vditor.wysiwyg.element, range);
                    const tempTopListElement = getTopList(range.startContainer);
                    if (tempTopListElement) {
                        tempTopListElement.querySelectorAll(".vditor-wysiwyg__block")
                            .forEach((blockElement: HTMLElement) => {
                                processCodeRender(blockElement, vditor);
                                blockElement.firstElementChild.setAttribute("style", "display:none");
                            });
                    }
                    afterRenderEvent(vditor);
                    highlightToolbar(vditor);
                } else {
                    vditor.wysiwyg.element.focus();
                }
            };

            const insertBefore = genInsertBefore(range, topListElement, vditor);
            const insertAfter = genInsertAfter(range, topListElement, vditor);

            vditor.wysiwyg.popover.insertAdjacentElement("beforeend", insertBefore);
            vditor.wysiwyg.popover.insertAdjacentElement("beforeend", insertAfter);
            vditor.wysiwyg.popover.insertAdjacentElement("beforeend", outdent);
            vditor.wysiwyg.popover.insertAdjacentElement("beforeend", indent);

            setPopoverPosition(vditor, topListElement);
        }

        // quote popover
        let blockquoteElement = hasClosestByTag(typeElement, "BLOCKQUOTE") as HTMLTableElement;
        if (blockquoteElement && !(topUlElement && blockquoteElement.contains(topUlElement))) {
            vditor.wysiwyg.popover.innerHTML = "";
            const insertBefore = genInsertBefore(range, blockquoteElement, vditor);
            const insertAfter = genInsertAfter(range, blockquoteElement, vditor);
            const close = genClose(vditor.wysiwyg.popover, blockquoteElement, vditor);
            vditor.wysiwyg.popover.insertAdjacentElement("beforeend", close);
            vditor.wysiwyg.popover.insertAdjacentElement("beforeend", insertBefore);
            vditor.wysiwyg.popover.insertAdjacentElement("beforeend", insertAfter);
            setPopoverPosition(vditor, blockquoteElement);
        } else {
            blockquoteElement = undefined;
        }

        // table popover
        if (tableElement) {
            vditor.wysiwyg.popover.innerHTML = "";
            const updateTable = () => {
                const oldRow = tableElement.rows.length;
                const oldColumn = tableElement.rows[0].cells.length;
                const row = parseInt(input.value, 10) || oldRow;
                const column = parseInt(input2.value, 10) || oldColumn;

                if (row === oldRow && oldColumn === column) {
                    return;
                }

                if (oldColumn !== column) {
                    const columnDiff = column - oldColumn;
                    for (let i = 0; i < tableElement.rows.length; i++) {
                        if (columnDiff > 0) {
                            for (let j = 0; j < columnDiff; j++) {
                                if (i === 0) {
                                    tableElement.rows[i].lastElementChild.insertAdjacentHTML("afterend", "<th></th>");
                                } else {
                                    tableElement.rows[i].insertCell();
                                }
                            }
                        } else {
                            for (let k = oldColumn - 1; k >= column; k--) {
                                tableElement.rows[i].cells[k].remove();
                            }
                        }
                    }
                }

                if (oldRow !== row) {
                    const rowDiff = row - oldRow;
                    if (rowDiff > 0) {
                        let rowHTML = "<tr>";
                        for (let m = 0; m < column; m++) {
                            rowHTML += "<td></td>";
                        }
                        for (let l = 0; l < rowDiff; l++) {
                            if (tableElement.querySelector("tbody")) {
                                tableElement.querySelector("tbody").insertAdjacentHTML("beforeend", rowHTML);
                            } else {
                                tableElement.querySelector("thead").insertAdjacentHTML("afterend", rowHTML + "</tr>");
                            }
                        }
                    } else {
                        for (let m = oldRow - 1; m >= row; m--) {
                            tableElement.rows[m].remove();
                            if (tableElement.rows.length === 1) {
                                tableElement.querySelector("tbody").remove();
                            }
                        }
                    }
                }
            };

            const close = genClose(vditor.wysiwyg.popover, tableElement, vditor);

            const setAlign = (type: string) => {
                const cell = getSelection().getRangeAt(0).startContainer.parentElement;

                const columnCnt = tableElement.rows[0].cells.length;
                const rowCnt = tableElement.rows.length;
                let currentColumn = 0;

                for (let i = 0; i < rowCnt; i++) {
                    for (let j = 0; j < columnCnt; j++) {
                        if (tableElement.rows[i].cells[j].isEqualNode(cell)) {
                            currentColumn = j;
                            break;
                        }
                    }
                }
                for (let k = 0; k < rowCnt; k++) {
                    tableElement.rows[k].cells[currentColumn].setAttribute("align", type);
                }

                if (type === "right") {
                    left.classList.remove("vditor-icon--current");
                    center.classList.remove("vditor-icon--current");
                    right.classList.add("vditor-icon--current");
                } else if (type === "center") {
                    left.classList.remove("vditor-icon--current");
                    right.classList.remove("vditor-icon--current");
                    center.classList.add("vditor-icon--current");
                } else {
                    center.classList.remove("vditor-icon--current");
                    right.classList.remove("vditor-icon--current");
                    left.classList.add("vditor-icon--current");
                }

                afterRenderEvent(vditor);
            };

            const td = hasClosestByMatchTag(typeElement, "TD");
            const th = hasClosestByMatchTag(typeElement, "TH");
            let alignType = "left";
            if (td) {
                alignType = td.getAttribute("align") || "left";
            } else if (th) {
                alignType = th.getAttribute("align") || "center";
            }

            const left = document.createElement("button");
            left.setAttribute("aria-label", i18n[vditor.options.lang].alignLeft);
            left.innerHTML = outdentSVG;
            left.className = "vditor-icon vditor-tooltipped vditor-tooltipped__n" +
                (alignType === "left" ? " vditor-icon--current" : "");
            left.onclick = () => {
                setAlign("left");
            };

            const center = document.createElement("button");
            center.setAttribute("aria-label", i18n[vditor.options.lang].alignCenter);
            center.innerHTML = alignCenterSVG;
            center.className = "vditor-icon vditor-tooltipped vditor-tooltipped__n" +
                (alignType === "center" ? " vditor-icon--current" : "");
            center.onclick = () => {
                setAlign("center");
            };

            const right = document.createElement("button");
            right.setAttribute("aria-label", i18n[vditor.options.lang].alignRight);
            right.innerHTML = indentSVG;
            right.className = "vditor-icon vditor-tooltipped vditor-tooltipped__n" +
                (alignType === "right" ? " vditor-icon--current" : "");
            right.onclick = () => {
                setAlign("right");
            };

            const inputWrap = document.createElement("span");
            inputWrap.setAttribute("aria-label", i18n[vditor.options.lang].row);
            inputWrap.className = "vditor-tooltipped vditor-tooltipped__n";
            const input = document.createElement("input");
            inputWrap.appendChild(input);
            input.type = "number";
            input.min = "1";
            input.className = "vditor-input";
            input.style.width = "42px";
            input.style.textAlign = "center";
            input.setAttribute("placeholder", i18n[vditor.options.lang].row);
            input.value = tableElement.rows.length.toString();
            input.onblur = updateTable;
            input.oninput = () => {
                updateTable();
            };
            const input2Wrap = document.createElement("span");
            input2Wrap.setAttribute("aria-label", i18n[vditor.options.lang].column);
            input2Wrap.className = "vditor-tooltipped vditor-tooltipped__n";
            const input2 = document.createElement("input");
            input2Wrap.appendChild(input2);
            input2.type = "number";
            input2.min = "1";
            input2.className = "vditor-input";
            input2.style.width = "42px";
            input2.style.textAlign = "center";
            input2.setAttribute("placeholder", i18n[vditor.options.lang].column);
            input2.value = tableElement.rows[0].cells.length.toString();
            input2.onblur = updateTable;
            input2.oninput = () => {
                updateTable();
            };

            const insertBefore = genInsertBefore(range, tableElement, vditor);
            const insertAfter = genInsertAfter(range, tableElement, vditor);
            vditor.wysiwyg.popover.insertAdjacentElement("beforeend", close);
            vditor.wysiwyg.popover.insertAdjacentElement("beforeend", insertBefore);
            vditor.wysiwyg.popover.insertAdjacentElement("beforeend", insertAfter);
            vditor.wysiwyg.popover.insertAdjacentElement("beforeend", left);
            vditor.wysiwyg.popover.insertAdjacentElement("beforeend", center);
            vditor.wysiwyg.popover.insertAdjacentElement("beforeend", right);
            vditor.wysiwyg.popover.insertAdjacentElement("beforeend", inputWrap);
            vditor.wysiwyg.popover.insertAdjacentHTML("beforeend", " x ");
            vditor.wysiwyg.popover.insertAdjacentElement("beforeend", input2Wrap);
            setPopoverPosition(vditor, tableElement);
        }

        // a popover
        if (aElement) {
            genAPopover(vditor, aElement);
        }

        // img popover
        let imgElement = nextIsImg(range) as HTMLElement;
        if ((range.startContainer.nodeType !== 3 && range.startContainer.childNodes.length > range.startOffset &&
            range.startContainer.childNodes[range.startOffset].nodeName === "IMG") || imgElement) {
            // 光标在图片前面，或在文字后面
            if (!imgElement) {
                imgElement = range.startContainer.childNodes[range.startOffset] as HTMLElement;
            }
            vditor.wysiwyg.popover.innerHTML = "";
            const updateImg = () => {
                imgElement.setAttribute("src", input.value);
                imgElement.setAttribute("alt", alt.value);
                if (aHref.value === "") {
                    if (imgElement.parentElement.nodeName === "A") {
                        imgElement.parentElement.replaceWith(imgElement);
                    }
                } else {
                    if (imgElement.parentElement.nodeName === "A") {
                        imgElement.parentElement.setAttribute("href", aHref.value);
                    } else {
                        const link = document.createElement("a");
                        link.innerHTML = imgElement.outerHTML;
                        link.setAttribute("href", aHref.value);

                        const linkElement = imgElement.parentNode.insertBefore(link, imgElement);
                        imgElement.remove();
                        imgElement = linkElement.querySelector("img");
                    }
                }
            };

            const inputWrap = document.createElement("span");
            inputWrap.setAttribute("aria-label", i18n[vditor.options.lang].imageURL);
            inputWrap.className = "vditor-tooltipped vditor-tooltipped__n";
            const input = document.createElement("input");
            inputWrap.appendChild(input);
            input.className = "vditor-input";
            input.setAttribute("placeholder", i18n[vditor.options.lang].imageURL);
            input.value = imgElement.getAttribute("src") || "";
            input.onblur = updateImg;
            input.oninput = () => {
                updateImg();
            };
            const altWrap = document.createElement("span");
            altWrap.setAttribute("aria-label", i18n[vditor.options.lang].alternateText);
            altWrap.className = "vditor-tooltipped vditor-tooltipped__n";
            const alt = document.createElement("input");
            altWrap.appendChild(alt);
            alt.className = "vditor-input";
            alt.setAttribute("placeholder", i18n[vditor.options.lang].alternateText);
            alt.style.width = "52px";
            alt.value = imgElement.getAttribute("alt") || "";
            alt.onblur = updateImg;
            alt.oninput = () => {
                updateImg();
            };

            const aHrefWrap = document.createElement("span");
            aHrefWrap.setAttribute("aria-label", i18n[vditor.options.lang].link);
            aHrefWrap.className = "vditor-tooltipped vditor-tooltipped__n";
            const aHref = document.createElement("input");
            aHrefWrap.appendChild(aHref);
            aHref.className = "vditor-input";
            aHref.setAttribute("placeholder", i18n[vditor.options.lang].link);
            aHref.value =
                imgElement.parentElement.nodeName === "A" ? imgElement.parentElement.getAttribute("href") : "";
            aHref.onblur = updateImg;
            aHref.oninput = () => {
                updateImg();
            };
            vditor.wysiwyg.popover.insertAdjacentElement("beforeend", inputWrap);
            vditor.wysiwyg.popover.insertAdjacentElement("beforeend", altWrap);
            vditor.wysiwyg.popover.insertAdjacentElement("beforeend", aHrefWrap);

            setPopoverPosition(vditor, imgElement);
        }

        const blockRenderElement = hasClosestByClassName(typeElement, "vditor-wysiwyg__block");
        if (blockRenderElement) {
            // block popover: math-inline, math-block, html-block, html-inline, code-block
            const blockType = blockRenderElement.getAttribute("data-type");
            vditor.wysiwyg.popover.innerHTML = "";

            const languageWrap = document.createElement("span");
            languageWrap.setAttribute("aria-label", i18n[vditor.options.lang].language +
                "<" + updateHotkeyTip("⌥-Enter") + ">");
            languageWrap.className = "vditor-tooltipped vditor-tooltipped__n";
            const language = document.createElement("input");
            languageWrap.appendChild(language);
            if (blockType.indexOf("block") > -1) {
                const insertBefore = genInsertBefore(range, blockRenderElement, vditor);
                const insertAfter = genInsertAfter(range, blockRenderElement, vditor);
                const close = genClose(vditor.wysiwyg.popover, blockRenderElement, vditor);
                vditor.wysiwyg.popover.insertAdjacentElement("beforeend", close);
                vditor.wysiwyg.popover.insertAdjacentElement("beforeend", insertBefore);
                vditor.wysiwyg.popover.insertAdjacentElement("beforeend", insertAfter);

                if (blockType === "code-block") {
                    const codeElement = blockRenderElement.firstElementChild.firstElementChild;

                    const updateLanguage = () => {
                        codeElement.className = `language-${language.value}`;
                    };
                    language.className = "vditor-input";
                    language.setAttribute("placeholder", i18n[vditor.options.lang].language);
                    language.value = codeElement.className.indexOf("language-") > -1 ?
                        codeElement.className.split("-")[1].split(" ")[0] : "";
                    language.onblur = updateLanguage;
                    language.oninput = () => {
                        updateLanguage();
                        processCodeRender(blockRenderElement, vditor);
                        afterRenderEvent(vditor);
                    };
                    language.onkeydown = (event: KeyboardEvent) => {
                        if (!isCtrl(event) && !event.shiftKey && event.altKey && event.key === "Enter") {
                            range.setStart(codeElement.firstChild, 0);
                            range.collapse(true);
                            setSelectionFocus(range);
                        }
                    };
                    vditor.wysiwyg.popover.insertAdjacentElement("beforeend", languageWrap);
                }
            }
            setPopoverPosition(vditor, blockRenderElement);
        } else {
            vditor.wysiwyg.element.querySelectorAll(".vditor-wysiwyg__block").forEach((itemElement) => {
                (itemElement.firstElementChild as HTMLElement).style.display = "none";
            });
        }

        if (!blockquoteElement && !imgElement && !topListElement && !tableElement && !blockRenderElement && !aElement) {
            vditor.wysiwyg.popover.style.display = "none";
        }

        // 反斜杠特殊处理
        vditor.wysiwyg.element.querySelectorAll('span[data-type="backslash"] > span').forEach((item: HTMLElement) => {
            item.style.display = "none";
        });
        const backslashElement = hasClosestByAttribute(range.startContainer, "data-type", "backslash");
        if (backslashElement) {
            backslashElement.querySelector("span").style.display = "inline";
        }

    }, 200);
};

const setPopoverPosition = (vditor: IVditor, element: HTMLElement) => {
    vditor.wysiwyg.popover.style.top = Math.max(-11, element.offsetTop - 21 - vditor.wysiwyg.element.scrollTop) + "px";
    vditor.wysiwyg.popover.style.left = element.offsetLeft + "px";
    vditor.wysiwyg.popover.setAttribute("data-top", (element.offsetTop - 21).toString());
    vditor.wysiwyg.popover.style.display = "block";
};

const genInsertBefore = (range: Range, element: HTMLElement, vditor: IVditor) => {
    const insertBefore = document.createElement("span");
    insertBefore.setAttribute("data-type", "insert-before");
    insertBefore.setAttribute("aria-label", i18n[vditor.options.lang].insertBefore +
        "<" + updateHotkeyTip("⌘-⇧-s") + ">");
    insertBefore.innerHTML = beforeSVG;
    insertBefore.className = "vditor-icon vditor-tooltipped vditor-tooltipped__n";
    insertBefore.onclick = () => {
        // 需添加零宽字符，否则的话无法记录 undo
        element.insertAdjacentHTML("beforebegin", `<p data-block="0">${Constants.ZWSP}<wbr>\n</p>`);
        setRangeByWbr(vditor.wysiwyg.element, range);
        highlightToolbar(vditor);
        afterRenderEvent(vditor);
    };
    return insertBefore;
};

const genInsertAfter = (range: Range, element: HTMLElement, vditor: IVditor) => {
    const insertAfter = document.createElement("span");
    insertAfter.setAttribute("data-type", "insert-after");
    insertAfter.setAttribute("aria-label", i18n[vditor.options.lang].insertAfter +
        "<" + updateHotkeyTip("⌘-⇧-e") + ">");
    insertAfter.innerHTML = afterSVG;
    insertAfter.className = "vditor-icon vditor-tooltipped vditor-tooltipped__n";
    insertAfter.onclick = () => {
        // 需添加零宽字符，否则的话无法记录 undo
        element.insertAdjacentHTML("afterend", `<p data-block="0">${Constants.ZWSP}<wbr>\n</p>`);
        setRangeByWbr(vditor.wysiwyg.element, range);
        highlightToolbar(vditor);
        afterRenderEvent(vditor);
    };
    return insertAfter;
};

const genClose = (popover: HTMLElement, element: HTMLElement, vditor: IVditor) => {
    const close = document.createElement("span");
    close.setAttribute("data-type", "remove");
    close.setAttribute("aria-label", i18n[vditor.options.lang].remove +
        "<" + updateHotkeyTip("⌘-⇧-x") + ">");
    close.innerHTML = trashcanSVG;
    close.className = "vditor-icon vditor-tooltipped vditor-tooltipped__n";
    close.onclick = () => {
        element.remove();
        popover.style.display = "none";
        highlightToolbar(vditor);
        afterRenderEvent(vditor);
    };
    return close;
};

export const genAPopover = (vditor: IVditor, aElement: HTMLElement) => {
    vditor.wysiwyg.popover.innerHTML = "";

    const updateA = () => {
        if (input.value.trim() !== "") {
            aElement.innerHTML = input.value;
        }
        aElement.setAttribute("href", input1.value);
        aElement.setAttribute("title", input2.value);
    };

    const hotkey = (event: KeyboardEvent, nextInputElement: HTMLInputElement) => {
        if (event.key === "Tab") {
            nextInputElement.focus();
            nextInputElement.select();
            event.preventDefault();
            return;
        }
        if (event.altKey && event.key === "Enter") {
            const range = vditor.wysiwyg.element.ownerDocument.createRange();
            range.selectNodeContents(aElement.lastChild);
            range.collapse(false);
            setSelectionFocus(range);
            event.preventDefault();
        }
    };

    aElement.querySelectorAll("[data-marker]").forEach((item: HTMLElement) => {
        item.removeAttribute("data-marker");
    })
    const inputWrap = document.createElement("span");
    inputWrap.setAttribute("aria-label", i18n[vditor.options.lang].textIsNotEmpty);
    inputWrap.className = "vditor-tooltipped vditor-tooltipped__n";
    const input = document.createElement("input");
    inputWrap.appendChild(input);
    input.className = "vditor-input";
    input.setAttribute("placeholder", i18n[vditor.options.lang].textIsNotEmpty);
    input.style.width = "120px";
    input.value = aElement.innerHTML || "";
    input.oninput = () => {
        updateA();
    };
    input.onkeydown = (event) => {
        hotkey(event, input1);
    };

    const input1Wrap = document.createElement("span");
    input1Wrap.setAttribute("aria-label", i18n[vditor.options.lang].link);
    input1Wrap.className = "vditor-tooltipped vditor-tooltipped__n";
    const input1 = document.createElement("input");
    input1Wrap.appendChild(input1);
    input1.className = "vditor-input";
    input1.setAttribute("placeholder", i18n[vditor.options.lang].link);
    input1.value = aElement.getAttribute("href") || "";
    input1.oninput = () => {
        updateA();
    };
    input1.onkeydown = (event) => {
        hotkey(event, input2);
    };

    const input2Wrap = document.createElement("span");
    input2Wrap.setAttribute("aria-label", i18n[vditor.options.lang].tooltipText);
    input2Wrap.className = "vditor-tooltipped vditor-tooltipped__n";
    const input2 = document.createElement("input");
    input2Wrap.appendChild(input2);
    input2.className = "vditor-input";
    input2.setAttribute("placeholder", i18n[vditor.options.lang].tooltipText);
    input2.style.width = "60px";
    input2.value = aElement.getAttribute("title") || "";
    input2.oninput = () => {
        updateA();
    };
    input2.onkeydown = (event) => {
        hotkey(event, input);
    };

    vditor.wysiwyg.popover.insertAdjacentElement("beforeend", inputWrap);
    vditor.wysiwyg.popover.insertAdjacentElement("beforeend", input1Wrap);
    vditor.wysiwyg.popover.insertAdjacentElement("beforeend", input2Wrap);
    setPopoverPosition(vditor, aElement);
};

export const listOutdent = (vditor: IVditor, liElement: HTMLElement, range: Range, topListElement: HTMLElement) => {
    const liParentLiElement = hasClosestByMatchTag(liElement.parentElement, "LI");
    if (liParentLiElement) {
        vditor.wysiwyg.element.querySelectorAll("wbr").forEach((wbr) => {
            wbr.remove();
        });
        range.insertNode(document.createElement("wbr"));

        const liParentElement = liElement.parentElement;
        const liParentAfterElement = liParentElement.cloneNode() as HTMLElement;

        let isMatch = false;
        let afterHTML = "";
        liParentElement.querySelectorAll("li").forEach((item) => {
            if (isMatch) {
                afterHTML += item.outerHTML;
                item.remove();
            }
            if (item.isEqualNode(liElement)) {
                isMatch = true;
            }
        });
        liParentAfterElement.innerHTML = afterHTML;

        liParentLiElement.insertAdjacentElement("afterend", liElement);
        liElement.insertAdjacentElement("beforeend", liParentAfterElement);

        addP2Li(topListElement);
        topListElement.outerHTML = vditor.lute.SpinVditorDOM(topListElement.outerHTML);

        setRangeByWbr(vditor.wysiwyg.element, range);
        const tempTopListElement = getTopList(range.startContainer);
        if (tempTopListElement) {
            tempTopListElement.querySelectorAll(".vditor-wysiwyg__block")
                .forEach((blockElement: HTMLElement) => {
                    processCodeRender(blockElement, vditor);
                    blockElement.firstElementChild.setAttribute("style", "display:none");
                });
        }
        afterRenderEvent(vditor);
        highlightToolbar(vditor);
    } else {
        vditor.wysiwyg.element.focus();
    }
};
