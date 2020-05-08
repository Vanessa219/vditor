import {Constants} from "../constants";
import {disableToolbar, enableToolbar, removeCurrentToolbar, setCurrentToolbar} from "../toolbar/setToolbar";
import {hasClosestByAttribute, hasClosestByMatchTag} from "../util/hasClosest";
import {hasClosestByHeadings} from "../util/hasClosestByHeadings";
import {getEditorRange, selectIsEditor} from "../util/selection";

export const highlightToolbar = (vditor: IVditor) => {
    clearTimeout(vditor.ir.hlToolbarTimeoutId);
    vditor.ir.hlToolbarTimeoutId = window.setTimeout(() => {
        if (vditor.ir.element.getAttribute("contenteditable") === "false") {
            return;
        }
        if (!selectIsEditor(vditor.ir.element)) {
            return;
        }

        removeCurrentToolbar(vditor.toolbar.elements, Constants.EDIT_TOOLBARS);
        enableToolbar(vditor.toolbar.elements, Constants.EDIT_TOOLBARS);

        const range = getEditorRange(vditor.ir.element);
        let typeElement = range.startContainer as HTMLElement;
        if (range.startContainer.nodeType === 3) {
            typeElement = range.startContainer.parentElement;
        }
        if (typeElement.classList.contains("vditor-reset")) {
            typeElement = typeElement.childNodes[range.startOffset] as HTMLElement;
        }

        const headingElement = hasClosestByHeadings(typeElement);
        if (headingElement) {
            setCurrentToolbar(vditor.toolbar.elements, ["headings"]);
        }

        const quoteElement = hasClosestByMatchTag(typeElement, "BLOCKQUOTE");
        if (quoteElement) {
            setCurrentToolbar(vditor.toolbar.elements, ["quote"]);
        }
        const aElement = hasClosestByAttribute(typeElement, "data-type", "a");
        if (aElement) {
            setCurrentToolbar(vditor.toolbar.elements, ["link"]);
        }
        const emElement = hasClosestByAttribute(typeElement, "data-type", "em");
        if (emElement) {
            setCurrentToolbar(vditor.toolbar.elements, ["italic"]);
        }
        const strongElement = hasClosestByAttribute(typeElement, "data-type", "strong");
        if (strongElement) {
            setCurrentToolbar(vditor.toolbar.elements, ["bold"]);
        }
        const sElement = hasClosestByAttribute(typeElement, "data-type", "s");
        if (sElement) {
            setCurrentToolbar(vditor.toolbar.elements, ["strike"]);
        }
        const codeElement = hasClosestByAttribute(typeElement, "data-type", "code");
        if (codeElement) {
            disableToolbar(vditor.toolbar.elements, ["headings", "bold", "italic", "strike", "line", "quote",
                "list", "ordered-list", "check", "code", "upload", "link", "table", "record"]);
            setCurrentToolbar(vditor.toolbar.elements, ["inline-code"]);
        }
        const codeBlockElement = hasClosestByAttribute(typeElement, "data-type", "code-block");
        if (codeBlockElement) {
            disableToolbar(vditor.toolbar.elements, ["headings", "bold", "italic", "strike", "line", "quote",
                "list", "ordered-list", "check", "code", "inline-code", "upload", "link", "table", "record"]);
            setCurrentToolbar(vditor.toolbar.elements, ["code"]);
        }
        const tableElement = hasClosestByMatchTag(typeElement, "TABLE") as HTMLTableElement;
        if (tableElement) {
            disableToolbar(vditor.toolbar.elements, ["table"]);
        }
        const liElement = hasClosestByMatchTag(typeElement, "LI");
        if (liElement) {
            if (liElement.classList.contains("vditor-task")) {
                setCurrentToolbar(vditor.toolbar.elements, ["check"]);
            } else if (liElement.parentElement.tagName === "OL") {
                setCurrentToolbar(vditor.toolbar.elements, ["ordered-list"]);
            } else if (liElement.parentElement.tagName === "UL") {
                setCurrentToolbar(vditor.toolbar.elements, ["list"]);
            }
            enableToolbar(vditor.toolbar.elements, ["outdent", "indent"]);
        } else {
            disableToolbar(vditor.toolbar.elements, ["outdent", "indent"]);
        }

    }, 200);
};
