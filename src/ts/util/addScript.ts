export const addScript = (url: string, id: string) => {
    if (!document.getElementById(id)) {
        return new Promise((resolve) => {
            const scriptElement = document.createElement("script");
            scriptElement.id = id;
            scriptElement.type = 'text/javascript';
            scriptElement.src = url;
            document.getElementsByTagName("head")[0].appendChild(scriptElement);

            scriptElement.onload = (() => {
                resolve()
            })
        });
    }
};
