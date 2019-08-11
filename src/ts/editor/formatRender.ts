import {inputEvent} from "./inputEvent";
import {setSelectionByPosition} from "./setSelection";

export const formatRender = (vditor: IVditor, content: string, position?: {start: number, end: number}) => {
    const textList = content.split("\n");
    let html = "";
    const newLine = '<span><br><span style="display: none">\n</span></span>';
    textList.forEach((text, index) => {
        if (index === textList.length - 1 && text === "") {
            return;
        }
        if (text) {
            html += `<span>${text}</span>${newLine}`;
        } else {
            html += newLine;
        }
    });

    // TODO: 使用虚拟 Dom
    vditor.editor.element.innerHTML = html;

    if (position) {
        setSelectionByPosition(position.start, position.end, vditor.editor.element);
    }

    inputEvent(vditor);
};
