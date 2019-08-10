import {getSelectPosition} from "./getSelectPosition";
import {inputEvent} from "./inputEvent";
import {setSelectionByPosition} from "./setSelection";

// content 不为空时为初始化时dialing
export const formatRender = (vditor: IVditor, content: string, offset: number = 0) => {
    const lastPosition = getSelectPosition(vditor.editor.element);

    const textList = content.split("\n");
    let html = "";
    const newLine = '<span><br><span style="display: none">\n</span></span>';
    textList.forEach((text, index) => {
        if (index === textList.length - 1 && index !== 0) {
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

    setSelectionByPosition(lastPosition.start + offset, lastPosition.end + offset, vditor.editor.element);

    inputEvent(vditor);
};
