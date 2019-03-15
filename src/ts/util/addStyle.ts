export const addStyle = (url: string, id: string) => {
    if (!document.getElementById(id)) {
        const styleElement = document.createElement("link");
        styleElement.id = id;
        styleElement.setAttribute("rel", "stylesheet");
        styleElement.setAttribute("type", "text/css");
        styleElement.setAttribute("href", url);
        document.getElementsByTagName("head")[0].appendChild(styleElement);
    }
};
