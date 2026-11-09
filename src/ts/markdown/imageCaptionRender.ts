const getContentNodes = (element: Element, ignoreIRMarkers = false) => {
    return Array.from(element.childNodes).filter((node) => {
        if (node.nodeType === Node.COMMENT_NODE) {
            return false;
        }
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent.replace(/\u200b/g, "").trim() !== "";
        }
        if (!(node instanceof HTMLElement)) {
            return true;
        }
        if (node.tagName === "WBR") {
            return false;
        }
        return !ignoreIRMarkers || !node.classList.contains("vditor-ir__marker");
    });
};

const getWYSIWYGImage = (paragraph: HTMLParagraphElement) => {
    const nodes = getContentNodes(paragraph);
    if (nodes.length !== 1 || !(nodes[0] instanceof HTMLElement)) {
        return undefined;
    }

    const container = nodes[0];
    if (container instanceof HTMLImageElement) {
        return {
            container,
            image: container,
        };
    }
    if (container instanceof HTMLAnchorElement) {
        const linkNodes = getContentNodes(container);
        if (linkNodes.length === 1 && linkNodes[0] instanceof HTMLImageElement) {
            return {
                container,
                image: linkNodes[0],
            };
        }
    }
    return undefined;
};

const getIRImage = (paragraph: HTMLParagraphElement) => {
    const nodes = getContentNodes(paragraph);
    if (nodes.length !== 1 || !(nodes[0] instanceof HTMLElement)) {
        return undefined;
    }

    let imageNode = nodes[0];
    if (imageNode.getAttribute("data-type") === "a") {
        const linkNodes = getContentNodes(imageNode, true);
        if (linkNodes.length !== 1 || !(linkNodes[0] instanceof HTMLElement)) {
            return undefined;
        }
        imageNode = linkNodes[0];
    }
    if (imageNode.getAttribute("data-type") !== "img") {
        return undefined;
    }

    const image = imageNode.querySelector(":scope > img");
    const titleMarker = imageNode.querySelector<HTMLElement>(":scope > .vditor-ir__marker--title");
    if (!(image instanceof HTMLImageElement) || !titleMarker) {
        return undefined;
    }

    const markerText = titleMarker.textContent.trim();
    const closeMarker = markerText[0] === "(" ? ")" : markerText[0];
    if (markerText.length < 2 || !["\"", "'", "("].includes(markerText[0]) ||
        markerText[markerText.length - 1] !== closeMarker) {
        return undefined;
    }
    return {
        caption: markerText.slice(1, -1).trim(),
        container: imageNode,
        image,
    };
};

const unwrapWYSIWYGCaptions = (element: HTMLElement) => {
    element.querySelectorAll("span.vditor-image[data-image-caption]").forEach((wrapper) => {
        while (wrapper.firstChild) {
            wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
        }
        wrapper.remove();
    });
};

const resetIRCaptions = (element: HTMLElement) => {
    element.querySelectorAll(".vditor-image[data-image-caption]").forEach((imageNode) => {
        imageNode.classList.remove("vditor-image");
        imageNode.removeAttribute("data-image-caption");
    });
};

const renderPreviewCaptions = (element: HTMLElement) => {
    element.querySelectorAll("p").forEach((paragraph: HTMLParagraphElement) => {
        const imageData = getWYSIWYGImage(paragraph);
        const caption = imageData?.image.getAttribute("title")?.trim();
        if (!imageData || !caption) {
            return;
        }

        const figure = document.createElement("figure");
        Array.from(paragraph.attributes).forEach((attribute) => {
            figure.setAttribute(attribute.name, attribute.value);
        });
        figure.classList.add("vditor-image");
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = caption;
        figure.append(imageData.container, figcaption);
        paragraph.replaceWith(figure);
    });
};

const renderWYSIWYGCaptions = (element: HTMLElement) => {
    element.querySelectorAll("p").forEach((paragraph: HTMLParagraphElement) => {
        const imageData = getWYSIWYGImage(paragraph);
        const caption = imageData?.image.getAttribute("title")?.trim();
        if (!imageData || !caption) {
            return;
        }

        const wrapper = document.createElement("span");
        wrapper.className = "vditor-image";
        wrapper.setAttribute("data-image-caption", caption);
        imageData.container.replaceWith(wrapper);
        wrapper.append(imageData.container);
    });
};

const renderIRCaptions = (element: HTMLElement) => {
    element.querySelectorAll("p").forEach((paragraph: HTMLParagraphElement) => {
        const imageData = getIRImage(paragraph);
        if (!imageData?.caption) {
            return;
        }
        imageData.container.classList.add("vditor-image");
        imageData.container.setAttribute("data-image-caption", imageData.caption);
    });
};

export const renderImageCaptions = (
    element: HTMLElement,
    mode: "preview" | "wysiwyg" | "ir",
    enable: boolean,
) => {
    if (mode === "wysiwyg") {
        unwrapWYSIWYGCaptions(element);
    } else if (mode === "ir") {
        resetIRCaptions(element);
    }
    if (!enable) {
        return;
    }

    if (mode === "preview") {
        renderPreviewCaptions(element);
    } else if (mode === "wysiwyg") {
        renderWYSIWYGCaptions(element);
    } else {
        renderIRCaptions(element);
    }
};

export const renderImageCaptionHTML = (html: string, enable: boolean) => {
    if (!enable) {
        return html;
    }
    const container = document.createElement("div");
    container.innerHTML = html;
    renderImageCaptions(container, "preview", true);
    return container.innerHTML;
};
