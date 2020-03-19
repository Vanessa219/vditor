import pauseSVG from "../../assets/icons/pause.svg";
import playSVG from "../../assets/icons/play.svg";
import {setSelectionFocus} from "../util/selection";

declare global {
    interface Window {
        vditorSpeechRange: Range;
    }
}
export const speechRender = (element: HTMLElement, lang: (keyof II18nLang) = "zh_CN") => {
    if (!speechSynthesis || !SpeechSynthesisUtterance) {
        return;
    }

    let speechDom: HTMLDivElement = document.querySelector(".vditor-speech");
    if (!speechDom) {
        speechDom = document.createElement("div");
        speechDom.className = "vditor-speech";
        document.body.insertAdjacentElement("beforeend", speechDom);

        const getVoice = () => {
            const voices = speechSynthesis.getVoices();
            let currentVoice;
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

        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = getVoice;
        }

        const voice = getVoice();
        speechDom.onclick = () => {
            if (speechDom.className === "vditor-speech") {
                const utterThis = new SpeechSynthesisUtterance(speechDom.getAttribute("data-text"));
                utterThis.voice = voice;
                utterThis.onend = () => {
                    speechDom.className = "vditor-speech";
                    speechSynthesis.cancel();
                    speechDom.innerHTML = playSVG;
                };
                speechSynthesis.speak(utterThis);
                speechDom.className = "vditor-speech vditor-speech--current";
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
        };

        document.body.addEventListener("click", () => {
            if (getSelection().toString().trim() === "" && speechDom.style.display === "block") {
                speechDom.className = "vditor-speech";
                speechSynthesis.cancel();
                speechDom.style.display = "none";
            }
        });
    }

    element.addEventListener("mouseup", (event: MouseEvent) => {
        const text = getSelection().toString().trim();
        speechSynthesis.cancel();
        if (getSelection().toString().trim() === "") {
            if (speechDom.style.display === "block") {
                speechDom.className = "vditor-speech";
                speechDom.style.display = "none";
            }
            return;
        }
        window.vditorSpeechRange = getSelection().getRangeAt(0).cloneRange();
        const rect = getSelection().getRangeAt(0).getBoundingClientRect();
        speechDom.innerHTML = playSVG;
        speechDom.style.display = "block";
        speechDom.style.top = (rect.top + rect.height + document.querySelector("html").scrollTop - 20) + "px";
        speechDom.style.left = (event.screenX + 2) + "px";
        speechDom.setAttribute("data-text", text);
    });
};
