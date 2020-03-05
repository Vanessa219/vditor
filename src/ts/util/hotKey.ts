import {isCtrl, isFirefox, updateHotkeyTip} from "./compatibility";

// 是否匹配 ⌘-⇧-[] / ⌘-[]
export const matchHotKey = (hotKey: string, event: KeyboardEvent) => {
    const hotKeys = updateHotkeyTip(hotKey).split("-");
    const hasShift = hotKeys.length > 2 && (hotKeys[1] === "shift" || hotKeys[1] === "⇧");
    let key = (hasShift ? hotKeys[2] : hotKeys[1]) || "-";
    if (hasShift && key === "-" && (isFirefox() || !/Mac/.test(navigator.platform))) {
        key = "_";
    }
    if (isCtrl(event) && event.key.toLowerCase() === key.toLowerCase() && !event.altKey
        && ((!hasShift && !event.shiftKey) || (hasShift && event.shiftKey))) {
        return true;
    }
    return false;
};
