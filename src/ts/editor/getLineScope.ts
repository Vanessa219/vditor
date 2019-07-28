export const getLineScope = (value: string, index: number) => {
    let start = 0;
    let end = -1;
    value.split("\n").some((val, i) => {
        start = end + 1;
        end = start + val.length;
        if (index >= start && index <= end) {
            return true;
        }
    });
    return [start, end];
};
