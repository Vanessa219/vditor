export const download = (content: string, filename: string) => {
    const aElement = document.createElement("a");
    aElement.download = filename;
    aElement.style.display = "none";
    aElement.href = URL.createObjectURL(new Blob([content]));

    document.body.appendChild(aElement);
    aElement.click();
    aElement.remove();
};

export const exportMarkdown = (content: string) => {
    download(content, content.substr(0, 10) + ".md");
};
