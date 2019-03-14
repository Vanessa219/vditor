export const addStyle = (url: string, id: string) => {
    if (!document.getElementById(id)) {
        const hljsStyle = document.createElement("link");
        hljsStyle.id = "vditorHljsStyle";
        hljsStyle.setAttribute("rel", "stylesheet");
        hljsStyle.setAttribute("type", "text/css");
        hljsStyle.setAttribute("href", url);
        document.getElementsByTagName("head")[0].appendChild(hljsStyle);
    }
}