export const commandable = (): boolean => {
    if (/firefox/i.test(navigator.userAgent) || /edge/i.test(navigator.userAgent)
        || /msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent)) {
        return false;
    }
    return true;
};
