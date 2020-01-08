export const updateHotkeyTip = (hotkey: string) => {
    if (/Mac/.test(navigator.platform)) {
        hotkey = hotkey.replace("ctrl", "⌘").replace("shift", "⇧")
            .replace("alt", "⌥");
    } else {
        hotkey = hotkey.replace("⌘", "ctrl").replace("⇧", "shift")
            .replace("⌥", "alt");
    }
    return hotkey;
};
