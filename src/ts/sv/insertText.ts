import {getMarkdown} from "../util/getMarkdown";
import {getEditorRange, getSelectPosition} from "../util/selection";
import {formatRender} from "./formatRender";

export const insertText = (vditor: IVditor, prefix: string, suffix: string, replace: boolean = false,
                           toggle: boolean = false) => {
    const range = getEditorRange(vditor.sv.element);

    const position = getSelectPosition(vditor.sv.element, range);
    const content = getMarkdown(vditor);

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
