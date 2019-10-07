import {code160to32} from "../util/code160to32";
import {inputEvent} from "./inputEvent";
import {setSelectionByPosition} from "./setSelection";

export const formatRender = (vditor: IVditor, content: string, position?: { start: number, end: number },
                             addUndo: boolean = true) => {

    const textList = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
    let html = "";
    const newLine = '<span><br><span style="display: none">\n</span></span>';

    // 当 textList 为 [""] 或 ["", ""]，把编辑器内部元素置空。显示 placeholder 文字
    if (textList.length <= 2 && textList[0] === "") {
        vditor.editor.element.innerHTML = "";
        inputEvent(vditor, addUndo);
        return;
    }

    textList.forEach((text, index) => {
        if (index === textList.length - 1 && text === "") {
            return;
        }
        if (text) {
            html += `<span>${code160to32(text.replace(/&/g, "&amp;").replace(/</g, "&lt;"))}</span>${newLine}`;
        } else {
            html += newLine;
        }
    });

    // TODO: 使用虚拟 Dom
    vditor.editor.element.innerHTML = html || newLine;

    if (position) {
        setSelectionByPosition(position.start, position.end, vditor.editor.element);
    }

    inputEvent(vditor, addUndo);
};
