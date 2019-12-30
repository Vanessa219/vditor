export const hasClosestByTag = (element: HTMLElement, nodeName: string) => {
    let e = element;
    let isClosest = false;
    while (e && !isClosest && !e.classList.contains("vditor-wysiwyg")) {
        if (e.nodeName.indexOf(nodeName) === 0) {
            isClosest = true;
        } else {
            e = e.parentElement;
        }
    }
    return isClosest && e;
};

export const hasClosestByAttribute = (element: HTMLElement, attr: string, value: string) => {
    let e = element;
    let isClosest = false;
    while (e && !isClosest && !e.classList.contains("vditor-wysiwyg")) {
        if (e.getAttribute(attr) === value) {
            isClosest = true;
        } else {
            e = e.parentElement;
        }
    }
    return isClosest && e;
};

export const hasClosestBlock = (element: HTMLElement) => {
    let e = element;
    let isClosest = false;
    while (e && !isClosest && !e.classList.contains("vditor-wysiwyg")) {
        if (e.tagName === "H1" ||
            e.tagName === "H2" ||
            e.tagName === "H3" ||
            e.tagName === "H4" ||
            e.tagName === "H5" ||
            e.tagName === "H6" ||
            e.tagName === "P" ||
            e.tagName === "BLOCKQUOTE" ||
            e.tagName === "OL" ||
            e.tagName === "UL") {
            isClosest = true;
        } else {
            e = e.parentElement;
        }
    }
    return isClosest && e;
};

export const hasClosestByMatchTag = (element: HTMLElement, nodeName: string) => {
    let e = element;
    let isClosest = false;
    while (e && !isClosest && !e.classList.contains("vditor-wysiwyg")) {
        if (e.nodeName === nodeName) {
            isClosest = true;
        } else {
            e = e.parentElement;
        }
    }
    return isClosest && e;
};

export const hasClosestByClassName = (element: HTMLElement, className: string) => {
    let e = element.nodeType === 3 ? element.parentElement : element;
    let isClosest = false;
    while (e && !isClosest && !e.classList.contains("vditor-wysiwyg")) {
        if (e.classList.contains(className)) {
            isClosest = true;
        } else {
            e = e.parentElement;
        }
    }
    return isClosest && e;
};

export const hasTopClosestByTag = (element: HTMLElement, nodeName: string) => {
    let closest = hasClosestByTag(element, nodeName);
    let parentClosest = hasClosestByTag(closest.parentElement, nodeName);
    let findTop = false;
    while (closest && !closest.classList.contains("vditor-wysiwyg") && !findTop) {
        if (parentClosest) {
            closest = hasClosestByTag(closest.parentElement, nodeName);
            parentClosest = hasClosestByTag(closest.parentElement, nodeName);
        } else {
            findTop = true;
        }
    }
    return closest || false;
};
