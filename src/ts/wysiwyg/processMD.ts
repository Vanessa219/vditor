export const isHrMD = (text: string) => {
    // - _ *
    if (text.replace(/ |-/g, "") === ""
        || text.replace(/ |_/g, "") === ""
        || text.replace(/ |\*/g, "") === "") {
        return true;
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
