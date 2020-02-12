export const isHrMD = (text: string) => {
    // - _ *
    text = text.trim();
    if (text.replace(/ |-/g, "") === ""
        || text.replace(/ |_/g, "") === ""
        || text.replace(/ |\*/g, "") === "") {
        if (text.replace(/ /g, "").length > 2) {
            return true;
        }
        return false;
    }
    return false;
};

export const isHeadingMD = (text: string) => {
    // - =
    text = text.split("\n").pop();
    if (text === "") {
        return false;
    }
    if (text.replace(/-/g, "") === ""
        || text.replace(/=/g, "") === "") {
        return true;
    }
    return false;
};
