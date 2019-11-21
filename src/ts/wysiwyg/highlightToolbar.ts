import indentSVG from "../../assets/icons/indent.svg";
import outdentSVG from "../../assets/icons/outdent.svg";
import trashcanSVG from "../../assets/icons/trashcan.svg";
import {i18n} from "../i18n";
import {hasClosestByClassName, hasClosestByTag, hasTopClosestByTag} from "../util/hasClosest";

export const highlightToolbar = (vditor: IVditor) => {
    if (getSelection().rangeCount === 0) {
        return;
    }
    const range = getSelection().getRangeAt(0);
    let typeElement = range.startContainer as HTMLElement;
    if (range.startContainer.nodeType === 3) {
        typeElement = range.startContainer.parentElement;
    }

    let toolbarName = typeElement.nodeName;
    if (toolbarName === "CODE" && typeElement.parentElement.nodeName === "PRE") {
        toolbarName = "";
    }
    if (/^H[1-6]$/.test(toolbarName)) {
        toolbarName = "H";
    }
    if (toolbarName === "B") {
        toolbarName = "STRONG";
    }
    if (toolbarName === "I") {
        toolbarName = "EM";
    }
    if (toolbarName === "S") {
        toolbarName = "STRIKE";
    }

    const tagToolbar: { [key: string]: string } = {
        A: "link",
        CODE: "inline-code",
        EM: "italic",
        H: "headings",
        STRIKE: "strike",
        STRONG: "bold",
    };

    // 工具栏高亮
    Object.keys(tagToolbar).forEach((key) => {
        const value = tagToolbar[key];
        if (toolbarName === key) {
            if (vditor.toolbar.elements[value]) {
                vditor.toolbar.elements[value].children[0].classList.add("vditor-menu--current");
            }
        } else {
            if (vditor.toolbar.elements[value]) {
                vditor.toolbar.elements[value].children[0].classList.remove("vditor-menu--current");
            }
        }
    });

    if (hasClosestByTag(typeElement, "H")) {
        if (vditor.toolbar.elements.bold) {
            vditor.toolbar.elements.bold.children[0].classList.add("vditor-menu--disabled");
        }
    } else {
        if (vditor.toolbar.elements.bold) {
            vditor.toolbar.elements.bold.children[0].classList.remove("vditor-menu--disabled");
        }
    }

    if (hasClosestByTag(typeElement, "UL")) {
        if (vditor.toolbar.elements.list) {
            vditor.toolbar.elements.list.children[0].classList.add("vditor-menu--current");
        }
    } else {
        if (vditor.toolbar.elements.list) {
            vditor.toolbar.elements.list.children[0].classList.remove("vditor-menu--current");
        }
    }
    if (hasClosestByTag(typeElement, "OL")) {
        if (vditor.toolbar.elements["ordered-list"]) {
            vditor.toolbar.elements["ordered-list"].children[0].classList.add("vditor-menu--current");
        }
    } else {
        if (vditor.toolbar.elements["ordered-list"]) {
            vditor.toolbar.elements["ordered-list"].children[0].classList.remove("vditor-menu--current");
        }
    }

    // ul popover
    const topUlElement = hasTopClosestByTag(typeElement, "UL") as HTMLElement;
    if (topUlElement) {
        vditor.wysiwyg.popover.innerHTML = "";

        const outdent = document.createElement("sapn");
        outdent.innerHTML = outdentSVG;
        outdent.className = "vditor-icon";
        outdent.onclick = () => {
            document.execCommand("outdent", false);
        };

        const indent = document.createElement("sapn");
        indent.innerHTML = indentSVG;
        indent.className = "vditor-icon";
        indent.onclick = () => {
            document.execCommand("indent", false);
        };

        vditor.wysiwyg.popover.insertAdjacentElement("beforeend", outdent);
        vditor.wysiwyg.popover.insertAdjacentElement("beforeend", indent);

        setPopoverPosition(vditor, topUlElement);
    }

    // pre popover
    const preElement = hasClosestByTag(typeElement, "PRE");
    if (preElement) {
        vditor.wysiwyg.popover.innerHTML = "";

        const updateLanguage = () => {
            preElement.firstElementChild.className = `language-${input.value}`;
        };
        const input = document.createElement("input");
        input.className = "vditor-input";
        input.setAttribute("placeholder", "language");
        input.value =
            preElement.firstElementChild.className.indexOf("language-") > -1 ?
                preElement.firstElementChild.className.split("-")[1].split(" ")[0] : "";
        input.onblur = updateLanguage;
        input.onkeypress = (event) => {
            if (event.key === "Enter") {
                updateLanguage();
            }
        };
        const close = document.createElement("span");
        close.innerHTML = trashcanSVG;
        close.className = "vditor-icon";
        close.onclick = () => {
            preElement.remove();
            vditor.wysiwyg.popover.style.display = "none";
        };
        vditor.wysiwyg.popover.insertAdjacentElement("beforeend", input);
        vditor.wysiwyg.popover.insertAdjacentElement("beforeend", close);
        setPopoverPosition(vditor, preElement);
    }

    // table popover
    const tableElement = hasClosestByTag(typeElement, "TABLE") as HTMLTableElement;
    if (tableElement) {
        vditor.wysiwyg.popover.innerHTML = "";
        const updateTable = () => {
            const row = parseInt(input.value, 10);
            const column = parseInt(input2.value, 10);
            const oldRow = tableElement.rows.length;
            const oldColumn = tableElement.rows[0].cells.length;

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
                        tableElement.querySelector("tbody").insertAdjacentHTML("beforeend", rowHTML);
                    }
                } else {
                    for (let m = oldRow - 1; m >= row; m--) {
                        tableElement.rows[m].remove();
                    }
                }
            }
        };

        const input = document.createElement("input");
        input.className = "vditor-input";
        input.style.width = "42px";
        input.style.textAlign = "center";
        input.setAttribute("placeholder", "row");
        input.value = tableElement.rows.length.toString();
        input.onblur = updateTable;
        input.onkeypress = (event) => {
            if (event.key === "Enter") {
                updateTable();
            }
        };

        const input2 = document.createElement("input");
        input2.className = "vditor-input";
        input2.style.width = "42px";
        input2.style.textAlign = "center";
        input2.setAttribute("placeholder", "column");
        input2.value = tableElement.rows[0].cells.length.toString();
        input2.onblur = updateTable;
        input2.onkeypress = (event) => {
            if (event.key === "Enter") {
                updateTable();
            }
        };

        const close = document.createElement("sapn");
        close.innerHTML = trashcanSVG;
        close.className = "vditor-icon";
        close.onclick = () => {
            tableElement.remove();
            vditor.wysiwyg.popover.style.display = "none";
        };

        vditor.wysiwyg.popover.insertAdjacentElement("beforeend", input);
        vditor.wysiwyg.popover.insertAdjacentHTML("beforeend", " x ");
        vditor.wysiwyg.popover.insertAdjacentElement("beforeend", input2);
        vditor.wysiwyg.popover.insertAdjacentElement("beforeend", close);
        setPopoverPosition(vditor, tableElement);
    }

    // a popover
    if (typeElement.nodeName === "A") {
        vditor.wysiwyg.popover.innerHTML = "";

        const updateA = () => {
            typeElement.setAttribute("href", input.value);
            typeElement.setAttribute("title", input2.value);
        };

        const input = document.createElement("input");
        input.className = "vditor-input";
        input.setAttribute("placeholder", i18n[vditor.options.lang].link);
        input.value = typeElement.getAttribute("href") || "";
        input.onblur = updateA;
        input.onkeypress = (event) => {
            if (event.key === "Enter") {
                updateA();
            }
        };

        const input2 = document.createElement("input");
        input2.className = "vditor-input";
        input2.setAttribute("placeholder", "title");
        input2.style.width = "52px";
        input2.value = typeElement.getAttribute("title") || "";
        input2.onblur = updateA;
        input2.onkeypress = (event) => {
            if (event.key === "Enter") {
                updateA();
            }
        };

        vditor.wysiwyg.popover.insertAdjacentElement("beforeend", input);
        vditor.wysiwyg.popover.insertAdjacentElement("beforeend", input2);

        setPopoverPosition(vditor, typeElement);
    }

    // img popover
    let imgElement: HTMLImageElement;
    if (range.startContainer.nodeType !== 3 && range.startContainer.childNodes.length > range.startOffset
        && range.startContainer.childNodes[range.startOffset].nodeName === "IMG") {
        imgElement = range.startContainer.childNodes[range.startOffset] as HTMLImageElement;
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

        const input = document.createElement("input");
        input.className = "vditor-input";
        input.setAttribute("placeholder", i18n[vditor.options.lang].imageURL);
        input.value = imgElement.getAttribute("src") || "";
        input.onblur = updateImg;
        input.onkeypress = (event) => {
            if (event.key === "Enter") {
                updateImg();
            }
        };

        const alt = document.createElement("input");
        alt.className = "vditor-input";
        alt.setAttribute("placeholder", "alt");
        alt.style.width = "52px";
        alt.value = imgElement.getAttribute("alt") || "";
        alt.onblur = updateImg;
        alt.onkeypress = (event) => {
            if (event.key === "Enter") {
                updateImg();
            }
        };

        const aHref = document.createElement("input");
        aHref.className = "vditor-input";
        aHref.setAttribute("placeholder", i18n[vditor.options.lang].link);
        aHref.value = imgElement.parentElement.nodeName === "A" ? imgElement.parentElement.getAttribute("href") : "";
        aHref.onblur = updateImg;
        aHref.onkeypress = (event) => {
            if (event.key === "Enter") {
                updateImg();
            }
        };

        vditor.wysiwyg.popover.insertAdjacentElement("beforeend", input);
        vditor.wysiwyg.popover.insertAdjacentElement("beforeend", alt);
        vditor.wysiwyg.popover.insertAdjacentElement("beforeend", aHref);

        setPopoverPosition(vditor, imgElement);
    }

    if (!imgElement && !topUlElement && !tableElement && !preElement && typeElement.nodeName !== "A"
        && !hasClosestByClassName(typeElement, "vditor-panel")) {
        vditor.wysiwyg.popover.style.display = "none";
    }
};

const setPopoverPosition = (vditor: IVditor, element: HTMLElement) => {
    vditor.wysiwyg.popover.style.top = (element.offsetTop - 25) + "px";
    vditor.wysiwyg.popover.style.left = element.offsetLeft + "px";
    vditor.wysiwyg.popover.style.display = "block";
};
