export const getCurrentLinePosition = (position: { start: number, end: number }, text: string) => {

    // find start
    let start = position.start - 1;
    let findStart = false;
    while (!findStart && start > -1) {
        // 防止光标在末尾
        if (text.charAt(start) === "\n" && text.length !== start + 1) {
            start++;
            findStart = true;
        } else if (start === 0) {
            findStart = true;
        } else {
            start--;
        }
    }

    // find end
    let end = position.end;
    let findEnd = false;
    while (!findEnd && end <= text.length) {
        if (text.charAt(end) === "\n") {
            end++;
            findEnd = true;
        } else if (end === text.length) {
            findEnd = true;
        } else {
            end++;
        }
    }

    return {
        end: Math.min(end, text.length),
        start: Math.max(0, start),
    };
};
