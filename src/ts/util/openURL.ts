import {isSafari} from "./isSafari";

export const openURL = (url:string) => {
    if (isSafari()) {
        window.location.href = url;
    } else {
        window.open(url);
    }
}
