import {code160to32} from "../util/code160to32";
import {setSelectionByPosition} from "../util/selection";
import {inputEvent} from "./inputEvent";

export const formatRender = (vditor: IVditor, content: string, position?: { start: number, end: number }, options = {
    enableAddUndoStack: true,
    enableHint: false,
    enableInput: true,
}) => {
    const textList = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
    let html = "";
    const newLine = '<span><br><span style="display: none">\n</span></span>';

    let isEmpty = true;
    textList.forEach((text, index) => {
        if (text !== "") {
            isEmpty = false;
        }

        if (index === textList.length - 1 && text === "") {
            // 空行行末尾不需要
            return;
        }

        if (text) {
            html += `<span>${code160to32(text.replace(/&/g, "&amp;").replace(/</g, "&lt;"))}</span>${newLine}`;
        } else {
            html += newLine;
        }
    });

    if (textList.length <= 2 && isEmpty) {
        // 当内容等于空或 \n 时把编辑器内部元素置空，显示 placeholder 文字
        vditor.sv.element.innerHTML = "";
    } else {
        // TODO: 使用虚拟 Dom
        vditor.sv.element.innerHTML = html || newLine;
    }

    if (position) {
        setSelectionByPosition(position.start, position.end, vditor.sv.element);
    }

    inputEvent(vditor, {
        enableAddUndoStack: options.enableAddUndoStack,
        enableHint: options.enableHint,
        enableInput: options.enableInput,
    });
};
