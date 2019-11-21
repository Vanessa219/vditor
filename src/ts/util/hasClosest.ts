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

export const hasClosestByClassName = (element: HTMLElement, className: string) => {
    let e = element;
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
