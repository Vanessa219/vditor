import {isCtrl, updateHotkeyTip} from "./compatibility";

export const processKeymap = (hotkey: string, event: KeyboardEvent, action: () => void) => {
    const hotkeys = updateHotkeyTip(hotkey).split("-");
    const hasShift = hotkeys.length === 3 && (hotkeys[1] === "shift" || hotkeys[1] === "⇧");
    const key = (hasShift ? hotkeys[2] : hotkeys[1]) || "-";
    if (isCtrl(event) && event.key.toLowerCase() === key.toLowerCase() && !event.altKey
        && ((!hasShift && !event.shiftKey) || (hasShift && event.shiftKey))) {
        action();
        event.preventDefault();
        event.stopPropagation();
        return true;
    }
    return false;
};
