import pauseSVG from "../../assets/icons/pause.svg";
import playSVG from "../../assets/icons/play.svg";
import {setSelectionFocus} from "../editor/setSelection";

export const speechRender = (element: HTMLElement, lang: (keyof II18nLang) = "zh_CN") => {
    if (!speechSynthesis || !SpeechSynthesisUtterance) {
        return;
    }

    let speechDom: HTMLDivElement = document.querySelector(".vditor-speech");
    if (!speechDom) {
        speechDom = document.createElement("div");
        speechDom.className = "vditor-speech";
        document.body.insertAdjacentElement("beforeend", speechDom);
    }

    let range: Range;
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

    const resetSpeedDom = (hide: boolean = false) => {
        const text = getSelection().toString().trim();
        if (text === "" || hide === false) {
            speechDom.className = "vditor-speech";
            speechSynthesis.cancel();
            speechDom.innerHTML = playSVG;
            if (hide) {
                speechDom.style.display = "none";
            }
        }
        return text;
    };

    const voice = getVoice();

    speechDom.onclick = () => {
        if (speechDom.className === "vditor-speech") {
            const utterThis = new SpeechSynthesisUtterance(speechDom.getAttribute("data-text"));
            utterThis.voice = voice;
            utterThis.onend = () => {
                resetSpeedDom();
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

        setSelectionFocus(range);
    };

    element.addEventListener("mouseup", (event) => {
        const text = resetSpeedDom(true);
        if (text === "") {
            return;
        }
        range = getSelection().getRangeAt(0).cloneRange();
        const rect = getSelection().getRangeAt(0).getBoundingClientRect();
        speechDom.innerHTML = playSVG;
        speechDom.style.display = "block";
        speechDom.style.top = (rect.top + rect.height + document.querySelector("html").scrollTop - 20) + "px";
        speechDom.style.left = (event.screenX + 2) + "px";
        speechDom.setAttribute("data-text", text);
    });

    document.addEventListener("click", () => {
        resetSpeedDom(true);
    });
};
