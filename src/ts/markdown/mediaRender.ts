const videoRender = (element: HTMLElement, url: string) => {
    // const divElement = document.createElement("div");
    // element.parentNode.replaceChild(divElement, element.parentNode);
};

const audioRender = (element: HTMLElement, url: string) => {
    element.insertAdjacentHTML("afterend", `<audio controls="controls" src="${url}"></audio>`);
    element.remove();
};

export const mediaRender = (element: HTMLElement) => {
    element.querySelectorAll("a").forEach((aElement) => {
        const url = aElement.getAttribute("href");
        videoRender(aElement, url);
        if (url.match(/^.+.(mp3|wav)$/)) {
            audioRender(aElement, url);
        }
    });
};
