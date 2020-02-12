import {isCtrl} from "./compatibility";

export const processKeymap = (hotkey: string, event: KeyboardEvent, action: () => void) => {
    const hotkeys = hotkey.split("-");
    const hasShift = hotkeys.length === 3 && (hotkeys[1] === "shift" || hotkeys[1] === "⇧");
    const key = (hasShift ? hotkeys[2] : hotkeys[1]) || "-";
    if ((hotkeys[0] === "ctrl" || hotkeys[0] === "⌘") && isCtrl(event)
        && event.key.toLowerCase() === key.toLowerCase()) {
        if ((!hasShift && !event.shiftKey) || (hasShift && event.shiftKey)) {
            action();
            event.preventDefault();
            event.stopPropagation();
            return true;
        }
    }
    return false;
};
