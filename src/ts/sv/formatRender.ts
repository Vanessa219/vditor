import {processAfterRender} from "./process";

export const formatRender = (vditor: IVditor, content: string, position?: { start: number, end: number }, options = {
    enableAddUndoStack: true,
    enableHint: false,
    enableInput: true,
}) => {
    vditor.sv.element.innerHTML = content;
    processAfterRender(vditor, {
        enableAddUndoStack: options.enableAddUndoStack,
        enableHint: options.enableHint,
        enableInput: options.enableInput,
    });
};
