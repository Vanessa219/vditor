import {VDITOR_VERSION} from "./constants";
// import emojiSVG from "./assets/icons/emoji.svg";

class Vditor {
    greeting: string;
    version: string;

    constructor(message: string) {
        this.greeting = message;
        this.version = VDITOR_VERSION;
    }

    greet() {
        return "Hello, " + this.greeting + this.version;
    }
}

import(/* webpackChunkName: "marked" */ 'marked')
    .then(marked => {
        // 懒加载的模块拥有所有的类型，并且能够按期工作
        // 类型检查会工作，代码引用也会工作  :100:
        console.log(marked.parse('# Marked in the browser.'));
    })
    .catch(err => {
        console.log('Failed to load marked', err);
    });

export default Vditor
