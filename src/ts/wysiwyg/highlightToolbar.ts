export const highlightToolbar = (vditor: IVditor) => {
    const range = getSelection().getRangeAt(0);
    let typeElement = range.startContainer;
    if (range.startContainer.nodeType === 3) {
        typeElement = range.startContainer.parentElement;
    }

    let toolbarName = typeElement.nodeName;
    if (toolbarName === "CODE" && typeElement.parentElement.nodeName === "PRE"
        && !typeElement.parentElement.classList.contains("vditor-wysiwyg")) {
        toolbarName = "PRECODE";
    }

    const tagToolbar: { [key: string]: string } = {
        A: "link",
        CODE: "inline-code",
        DEL: "strike",
        EM: "italic",
        H1: "headings",
        H2: "headings",
        H3: "headings",
        H4: "headings",
        H5: "headings",
        H6: "headings",
        PRECODE: "code",
        STRONG: "bold",
    };

    if (toolbarName in tagToolbar) {
        vditor.toolbar.elements[tagToolbar[toolbarName]] &&
        vditor.toolbar.elements[tagToolbar[toolbarName]].children[0].classList.add("vditor-menu--current");
    } else {
        Object.keys(tagToolbar).forEach((key) => {
            vditor.toolbar.elements[tagToolbar[key]] &&
            vditor.toolbar.elements[tagToolbar[key]].children[0].classList.remove("vditor-menu--current");
        });
    }
};
