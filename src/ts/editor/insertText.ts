import {formatRender} from "./formatRender";
import {getSelectPosition} from "./getSelectPosition";
import {getText} from "../util/getText";
import {selectIsEditor} from "./selectIsEditor";

export const insertText = (vditor: IVditor, prefix: string, suffix: string, replace: boolean = false,
                           toggle: boolean = false) => {
    let range: Range = window.getSelection().rangeCount === 0 ? undefined : window.getSelection().getRangeAt(0);
    if (!selectIsEditor(vditor.editor.element)) {
        if (vditor.editor.range) {
            range = vditor.editor.range;
        } else {
            range = vditor.editor.element.ownerDocument.createRange();
            range.setStart(vditor.editor.element, 0);
            range.collapse(true);
        }
    }

    const position = getSelectPosition(vditor.editor.element, range);
    const content = getText(vditor.editor.element, vditor.currentMode);

    // select none || select something and need replace
    if (range.collapsed || (!range.collapsed && replace)) {
        const text = prefix + suffix;
        formatRender(vditor, content.substring(0, position.start) + text + content.substring(position.end),
            {
                end: position.start + prefix.length,
                start: position.start + prefix.length,
            });
    } else {
        const selectText = content.substring(position.start, position.end);
        if (toggle && content.substring(position.start - prefix.length, position.start) === prefix
            && content.substring(position.end, position.end + suffix.length) === suffix) {
            formatRender(vditor, content.substring(0, position.start - prefix.length)
                + selectText + content.substring(position.end + suffix.length),
                {
                    end: position.start - prefix.length + selectText.length,
                    start: position.start - prefix.length,
                });
        } else {
            const text = prefix + selectText + suffix;
            formatRender(vditor, content.substring(0, position.start) + text + content.substring(position.end),
                {
                    end: position.start + prefix.length + selectText.length,
                    start: position.start + prefix.length,
                });
        }
    }
};
