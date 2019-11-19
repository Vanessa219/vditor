import {i18n} from "../i18n";
import {hasClosest, hasClosestClassName} from "../util/hasClosest";

export const highlightToolbar = (vditor: IVditor) => {
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

    if (hasClosest(typeElement, "H")) {
        if (vditor.toolbar.elements.bold) {
            vditor.toolbar.elements.bold.children[0].classList.add("vditor-menu--disabled");
        }
    } else {
        if (vditor.toolbar.elements.bold) {
            vditor.toolbar.elements.bold.children[0].classList.remove("vditor-menu--disabled");
        }
    }

    if (hasClosest(typeElement, "UL")) {
        if (vditor.toolbar.elements.list) {
            vditor.toolbar.elements.list.children[0].classList.add("vditor-menu--current");
        }
    } else {
        if (vditor.toolbar.elements.list) {
            vditor.toolbar.elements.list.children[0].classList.remove("vditor-menu--current");
        }
    }
    if (hasClosest(typeElement, "OL")) {
        if (vditor.toolbar.elements["ordered-list"]) {
            vditor.toolbar.elements["ordered-list"].children[0].classList.add("vditor-menu--current");
        }
    } else {
        if (vditor.toolbar.elements["ordered-list"]) {
            vditor.toolbar.elements["ordered-list"].children[0].classList.remove("vditor-menu--current");
        }
    }

    // a popover
    if (typeElement.nodeName === "A") {
        vditor.wysiwyg.popover.innerHTML = "";

        const updateHref = () => {
            typeElement.setAttribute("href", input.value);
        };

        const input = document.createElement("input");
        input.className = "vditor-input";
        input.setAttribute("placeholder", i18n[vditor.options.lang].link);
        input.value = typeElement.getAttribute("href") || "";
        input.onblur = updateHref;
        input.onkeypress = (event) => {
            if (event.key === "Enter") {
                updateHref();
            }
        };

        vditor.wysiwyg.popover.insertAdjacentElement("beforeend", input);

        setPopoverPosition(vditor, typeElement);
    }

    // pre popover
    const preElement = hasClosest(typeElement, "PRE");
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
        vditor.wysiwyg.popover.insertAdjacentElement("beforeend", input);
        setPopoverPosition(vditor, preElement);
    }

    // table popover
    const tableElement = hasClosest(typeElement, "TABLE");
    if (tableElement) {
        vditor.wysiwyg.popover.innerHTML = "";
        const updateTable = () => {
            const row = 1;
        };
        const input = document.createElement("input");
        input.className = "vditor-input";
        input.style.width = "30px";
        input.style.textAlign = "center";
        input.setAttribute("placeholder", "row");
        input.value = tableElement.querySelectorAll("tr").length.toString();
        input.onblur = updateTable;
        input.onkeypress = (event) => {
            if (event.key === "Enter") {
                updateTable();
            }
        };

        const input2 = document.createElement("input");
        input2.className = "vditor-input";
        input2.style.width = "30px";
        input2.style.textAlign = "center";
        input2.setAttribute("placeholder", "column");
        input2.value = tableElement.querySelector("tr").querySelectorAll("th").length.toString();
        input2.onblur = updateTable;
        input2.onkeypress = (event) => {
            if (event.key === "Enter") {
                updateTable();
            }
        };

        vditor.wysiwyg.popover.insertAdjacentElement("beforeend", input);
        vditor.wysiwyg.popover.insertAdjacentHTML("beforeend", " x ");
        vditor.wysiwyg.popover.insertAdjacentElement("beforeend", input2);
        setPopoverPosition(vditor, tableElement);
    }

    if (!tableElement && !preElement && typeElement.nodeName !== "A"
        && !hasClosestClassName(typeElement, "vditor-panel")) {
        vditor.wysiwyg.popover.style.display = "none";
    }
};

const setPopoverPosition = (vditor: IVditor, element: HTMLElement) => {
    const preRect = element.getBoundingClientRect();
    const editorRect = vditor.wysiwyg.element.getBoundingClientRect();
    vditor.wysiwyg.popover.style.top = (preRect.top - editorRect.top - 25) + "px";
    vditor.wysiwyg.popover.style.left = (preRect.left - editorRect.left) + "px";
    vditor.wysiwyg.popover.style.display = "block";
};
