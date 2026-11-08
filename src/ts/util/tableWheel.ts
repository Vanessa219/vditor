const boundElements = new WeakSet<HTMLElement>();

export const bindTableWheel = (element: HTMLElement) => {
    if (boundElements.has(element)) {
        return;
    }
    boundElements.add(element);
    element.addEventListener("wheel", (event: WheelEvent) => {
        if (!event.cancelable || event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey ||
            event.deltaX !== 0 || event.deltaY === 0) {
            return;
        }
        const target = event.target instanceof Element ? event.target : (event.target as Node).parentElement;
        const table = target?.closest("table");
        if (!table || !element.contains(table) || table.scrollWidth <= table.clientWidth) {
            return;
        }
        const style = getComputedStyle(table);
        if (!/auto|scroll/.test(style.overflowX)) {
            return;
        }
        const scale = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? (parseFloat(style.lineHeight) || 20) :
            event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? table.clientWidth : 1;
        const before = table.scrollLeft;
        table.scrollLeft += event.deltaY * scale * (style.direction === "rtl" ? -1 : 1);
        // 到达横向边界后交给页面滚动，避免滚轮被表格持续截留。
        if (table.scrollLeft !== before) {
            event.preventDefault();
        }
    }, {passive: false});
};
