import {setSelectionFocus} from "../util/selection";

declare global {
    interface Window {
        vditorSpeechRange: Range;
    }
}

export const speechRender = (element: HTMLElement, lang: keyof II18n = "zh_CN") => {
    if (typeof speechSynthesis === "undefined" || typeof SpeechSynthesisUtterance === "undefined") {
        return;
    }

    const getVoice = () => {
        const voices = speechSynthesis.getVoices();
        let currentVoice: SpeechSynthesisVoice;
        let defaultVoice;
        voices.forEach((item) => {
            if (item.lang === lang.replace("_", "-")) {
                currentVoice = item;
            }
            if (item.default) {
                defaultVoice = item;
            }
        });
        if (!currentVoice) {
            currentVoice = defaultVoice;
        }
        return currentVoice;
    };

    let playSVG = '<svg><use xlink:href="#vditor-icon-play"></use></svg>';
    let pauseSVG = '<svg><use xlink:href="#vditor-icon-pause"></use></svg>';
    if (!document.getElementById("vditorIconScript")) {
        playSVG = '<svg viewBox="0 0 32 32"><path d="M3.436 0l25.128 16-25.128 16v-32z"></path></svg>';
        pauseSVG = '<svg viewBox="0 0 32 32"><path d="M20.617 0h9.128v32h-9.128v-32zM2.255 32v-32h9.128v32h-9.128z"></path></svg>';
    }

    let speechDom: HTMLButtonElement = document.querySelector(".vditor-speech");
    if (!speechDom) {
        speechDom = document.createElement("button");
        speechDom.className = "vditor-speech";
        element.insertAdjacentElement("beforeend", speechDom);
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = getVoice;
        }
    }
    const voice = getVoice();
    const utterThis = new SpeechSynthesisUtterance();
    utterThis.voice = voice;
    utterThis.onend = utterThis.onerror = () => {
        speechDom.style.display = "none";
        speechSynthesis.cancel();
        speechDom.classList.remove("vditor-speech--current");
        speechDom.innerHTML = playSVG;
    };

    element.addEventListener(window.ontouchstart !== undefined ? "touchend" : "click", (event) => {
        const target = event.target as HTMLElement
        if (target.classList.contains("vditor-speech") || target.parentElement.classList.contains("vditor-speech")) {
            if (!speechDom.classList.contains("vditor-speech--current")) {
                utterThis.text = speechDom.getAttribute("data-text");
                speechSynthesis.speak(utterThis);
                speechDom.classList.add("vditor-speech--current");
                speechDom.innerHTML = pauseSVG;
            } else {
                if (speechSynthesis.speaking) {
                    if (speechSynthesis.paused) {
                        speechSynthesis.resume();
                        speechDom.innerHTML = pauseSVG;
                    } else {
                        speechSynthesis.pause();
                        speechDom.innerHTML = playSVG;
                    }
                }
            }
            setSelectionFocus(window.vditorSpeechRange);
            element.focus();
            return;
        }

        speechDom.style.display = "none";
        speechSynthesis.cancel();
        speechDom.classList.remove("vditor-speech--current");
        speechDom.innerHTML = playSVG;

        if (getSelection().rangeCount === 0) {
            return;
        }
        const range = getSelection().getRangeAt(0)
        const text = range.toString().trim();
        if (!text) {
            return;
        }
        window.vditorSpeechRange = range.cloneRange();
        const rect = range.getBoundingClientRect();
        speechDom.innerHTML = playSVG;
        speechDom.style.display = "block";
        speechDom.style.top = (rect.top + rect.height + document.querySelector("html").scrollTop - 20) + "px";
        if (window.ontouchstart !== undefined) {
            speechDom.style.left = ((event as TouchEvent).changedTouches[(event as TouchEvent).changedTouches.length - 1].pageX + 2) + "px";
        } else {
            speechDom.style.left = ((event as MouseEvent).clientX + 2) + "px";
        }
        speechDom.setAttribute("data-text", text);
    });
};
