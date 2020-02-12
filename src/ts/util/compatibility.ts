export const openURL = (url: string) => {
    if (navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") === -1) {
        window.location.href = url;
    } else {
        window.open(url);
    }
};

export const getEventName = () => {
    if (navigator.userAgent.indexOf("iPhone") > -1) {
        return "touchstart";
    } else {
        return "click";
    }
};

export const isCtrl = () => {

}
