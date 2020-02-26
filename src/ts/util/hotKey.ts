import {isCtrl, updateHotkeyTip} from "./compatibility";

// 是否匹配 ⌘-⇧-[] / ⌘-[]
export const matchHotKey = (hotKey: string, event: KeyboardEvent) => {
    const hotKeys = updateHotkeyTip(hotKey).split("-");
    const hasShift = hotKeys.length === 3 && (hotKeys[1] === "shift" || hotKeys[1] === "⇧");
    const key = (hasShift ? hotKeys[2] : hotKeys[1]) || "-";
    if (isCtrl(event) && event.key.toLowerCase() === key.toLowerCase() && !event.altKey
        && ((!hasShift && !event.shiftKey) || (hasShift && event.shiftKey))) {
        return true;
    }
    return false;
};
