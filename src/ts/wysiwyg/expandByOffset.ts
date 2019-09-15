export const expandByOffset = (elment: HTMLElement) => {
    const caretElement = elment.querySelector("[data-caret]");
    const nodeElement = caretElement.closest(".node");
    if (nodeElement) {
        nodeElement.className = "node node--expand";
    } else if (caretElement.previousElementSibling.className === "node") {
        caretElement.previousElementSibling.className = "node node--expand";
    }
};
