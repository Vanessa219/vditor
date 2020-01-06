export const updateHotkeyTip = (hotkey: string) => {
    if (/Mac/.test(navigator.platform)) {
        hotkey = hotkey.replace("ctrl", "⌘").replace("shift", "⇧");
    } else {
        hotkey = hotkey.replace("⌘", "ctrl").replace("⇧", "shift");
    }
    return hotkey;
};
