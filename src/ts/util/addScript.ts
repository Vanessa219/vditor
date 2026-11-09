const loadingScripts = new Map<string, Promise<boolean>>();

export const addScript = (path: string, id: string) => {
    if (document.getElementById(id)) {
        return Promise.resolve(true);
    }
    if (loadingScripts.has(id)) {
        return loadingScripts.get(id);
    }
    const promise = new Promise<boolean>((resolve, reject) => {
        const scriptElement = document.createElement("script");
        scriptElement.src = path;
        scriptElement.async = true;
        scriptElement.onerror = (event) => {
            scriptElement.remove();
            loadingScripts.delete(id);
            reject(event);
        };
        scriptElement.onload = () => {
            loadingScripts.delete(id);
            if (document.getElementById(id)) {
                // 循环调用需清除 DOM 中的 script 标签
                scriptElement.remove();
                resolve(true);
                return false;
            }
            scriptElement.id = id;
            resolve(true);
        };
        document.head.appendChild(scriptElement);
    });
    loadingScripts.set(id, promise);
    return promise;
};
