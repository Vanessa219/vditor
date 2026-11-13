import {getMarkdown} from "../markdown/getMarkdown";
import {isCtrl} from "../util/compatibility";
import {execAfterRender} from "../util/fixBrowserBehavior";
import {normalizeCodeDOM} from "../util/codeDOM";
import {processCodeRender} from "../util/processCode";
import {renderToc} from "../util/toc";
import {renderDomByMd} from "../wysiwyg/renderDomByMd";
import {countMatches, displayRange, findText, replaceText} from "./text";

let instanceCount = 0;

export class Find {
    public element: HTMLElement;
    private query: HTMLInputElement;
    private replacement: HTMLInputElement;
    private sensitive: HTMLInputElement;
    private count: HTMLElement;
    private replaceRow: HTMLElement;
    private replaceButtons: HTMLButtonElement[] = [];
    private navigationButtons: HTMLButtonElement[] = [];
    private index = 0;
    private total = 0;
    private composing = false;
    private timer = 0;
    private observer: MutationObserver;
    private events = new AbortController();
    private highlightName = `vditor-find-${++instanceCount}`;
    private highlightStyle: HTMLStyleElement;
    private sourceHighlight: HTMLElement;
    private sourceContent: HTMLElement;
    private sourceMatch: IFindResult["match"];
    private resizeObserver: ResizeObserver;

    constructor(private vditor: IVditor) {
        const labels = {
            find: "Find", replace: "Replace", replaceAll: "Replace all", matchCase: "Match case",
            previousMatch: "Previous", nextMatch: "Next", close: "Close",
        };
        const label = (key: keyof typeof labels) => vditor.options.i18n?.[key] || window.VditorI18n[key] || labels[key];
        this.element = document.createElement("section");
        this.element.className = "vditor-find";
        this.element.hidden = true;
        this.element.setAttribute("aria-label", label("find"));
        const row = document.createElement("div");
        row.className = "vditor-find__row";
        this.element.appendChild(row);
        this.query = this.input(label("find"));
        this.query.type = "search";
        row.appendChild(this.query);
        this.count = document.createElement("output");
        this.count.setAttribute("aria-live", "polite");
        row.appendChild(this.count);
        this.navigationButtons = [this.button(label("previousMatch"), () => this.move(-1)),
            this.button(label("nextMatch"), () => this.move(1))];
        row.append(...this.navigationButtons);
        const sensitive = document.createElement("label");
        this.sensitive = document.createElement("input");
        this.sensitive.type = "checkbox";
        sensitive.append(this.sensitive, document.createTextNode(label("matchCase")));
        row.appendChild(sensitive);
        const toggle = this.button(label("replace"), () => {
            this.replaceRow.hidden = !this.replaceRow.hidden;
            toggle.setAttribute("aria-expanded", String(!this.replaceRow.hidden));
            if (!this.replaceRow.hidden) this.replacement.focus();
        });
        toggle.setAttribute("aria-expanded", "false");
        row.appendChild(toggle);
        row.appendChild(this.button(label("close"), () => this.close(true)));
        this.replaceRow = document.createElement("div");
        this.replaceRow.className = "vditor-find__row";
        this.replaceRow.hidden = true;
        this.replacement = this.input(label("replace"));
        this.replaceRow.appendChild(this.replacement);
        this.replaceButtons = [this.button(label("replace"), () => this.replaceCurrent(false)),
            this.button(label("replaceAll"), () => this.replaceCurrent(true))];
        this.replaceRow.append(...this.replaceButtons);
        this.element.append(this.replaceRow);
        const signal = this.events.signal;
        this.query.addEventListener("input", () => {
            this.index = 0;
            this.schedule();
        }, {signal});
        this.sensitive.addEventListener("change", () => {
            this.index = 0;
            this.refresh();
        }, {signal});
        this.element.addEventListener("compositionstart", () => {this.composing = true;}, {signal});
        this.element.addEventListener("compositionend", () => {
            this.composing = false;
            this.schedule();
        }, {signal});
        vditor.element.addEventListener("keydown", event => {
            if (event.isComposing || this.composing || vditor[vditor.currentMode].composingLock) return;
            if (isCtrl(event) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === "f") {
                event.preventDefault();
                event.stopPropagation();
                this.open();
            } else if (!this.element.hidden && event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();
                this.close(true);
            } else if (this.element.contains(event.target as Node) && event.key === "Enter") {
                event.preventDefault();
                event.stopPropagation();
                if (event.target === this.replacement) this.replaceCurrent(false);
                else this.move(event.shiftKey ? -1 : 1);
            }
        }, {capture: true, signal});
        this.observer = new MutationObserver(() => this.schedule());
        for (const mode of ["sv", "ir", "wysiwyg"] as const) {
            this.observer.observe(vditor[mode].element, {childList: true, characterData: true, subtree: true,
                attributes: true, attributeFilter: ["contenteditable", "disabled"]});
        }
        vditor.element.addEventListener("input", event => {
            if (!this.element.contains(event.target as Node)) this.schedule();
        }, {signal});
        vditor.sv.element.addEventListener("scroll", () => this.scrollSourceHighlight(), {signal});
        this.resizeObserver = new ResizeObserver(() => {
            if (this.sourceMatch) this.highlightSource(this.sourceMatch, false);
        });
        this.resizeObserver.observe(vditor.sv.element);
        this.highlightStyle = document.createElement("style");
        this.highlightStyle.textContent = `::highlight(${this.highlightName}) {background-color: var(--find-background-color); color: var(--find-text-color);}`;
        document.head.appendChild(this.highlightStyle);
    }

    public open() {
        this.element.hidden = false;
        this.refresh();
        this.query.focus();
        this.query.select();
    }

    public close(focus = false) {
        this.element.hidden = true;
        window.clearTimeout(this.timer);
        this.clearHighlight();
        if (focus) this.vditor[this.vditor.currentMode].element.focus();
    }

    public refresh() {
        if (this.element.hidden || this.composing || this.vditor[this.vditor.currentMode].composingLock) return;
        window.clearTimeout(this.timer);
        const result = this.find(this.query.value, {caseSensitive: this.sensitive.checked, index: this.index});
        this.index = Math.max(0, result.index);
        this.total = result.total;
        this.count.textContent = `${result.index + 1}/${result.total}`;
        this.navigationButtons.forEach(button => {button.disabled = !result.total;});
        this.replaceButtons.forEach(button => {button.disabled = !result.total || !this.editable();});
    }

    public find(query: string, options: IFindOptions = {}): IFindResult {
        this.clearHighlight();
        const result = findText(this.vditor[this.vditor.currentMode].element, query,
            !!options.caseSensitive, options.index || 0);
        if (result.match && !this.vditor[this.vditor.currentMode].composingLock) {
            if (this.vditor.currentMode === "sv") {
                const element = this.vditor.sv.element;
                element.setSelectionRange(result.match.start, result.match.end);
                this.highlightSource(result.match);
            } else {
                const range = displayRange(result.match.range);
                const css = window.CSS as typeof CSS & {highlights?: Map<string, unknown>};
                const HighlightClass = (window as unknown as {Highlight?: new(range: Range) => unknown}).Highlight;
                if (css?.highlights && HighlightClass) css.highlights.set(this.highlightName, new HighlightClass(range));
                const rect = range.getBoundingClientRect();
                const element = this.vditor[this.vditor.currentMode].element;
                const viewport = element.getBoundingClientRect();
                if (rect.top < viewport.top || rect.bottom > viewport.bottom) {
                    element.scrollTop += rect.top - viewport.top - element.clientHeight / 2;
                }
            }
        }
        return result;
    }

    public replace(query: string, replacement: string, options: IFindOptions = {}): number {
        if (!this.editable() || this.composing || !query) return 0;
        const vditor = this.vditor;
        const surface = vditor[vditor.currentMode].element;
        const clone = surface.cloneNode(true) as HTMLElement;
        const count = replaceText(clone, query, replacement, !!options.caseSensitive, options.index);
        if (!count) return 0;
        if (vditor.currentMode !== "sv") normalizeCodeDOM(clone);
        const markdown = vditor.currentMode === "sv" ? (clone as HTMLTextAreaElement).value :
            vditor.currentMode === "ir" ? vditor.lute.VditorIRDOM2Md(clone.innerHTML) : vditor.lute.VditorDOM2Md(clone.innerHTML);
        if (markdown === getMarkdown(vditor)) return 0;
        if (vditor.options.beforeReplace?.(markdown) === false) return 0;
        vditor.undo.addToUndoStack(vditor);
        this.clearHighlight();
        const target = vditor[vditor.currentMode].element;
        const renderOptions = {enableAddUndoStack: false, enableHint: false, enableInput: true};
        if (vditor.currentMode === "sv") {
            vditor.sv.element.value = markdown;
            vditor.outline.render(vditor);
        } else if (vditor.currentMode === "wysiwyg") {
            renderDomByMd(vditor, markdown, renderOptions);
        } else {
            target.innerHTML = vditor.lute.Md2VditorIRDOM(markdown);
            target.querySelectorAll(".vditor-ir__preview[data-render='2']").forEach((item: HTMLElement) => {
                processCodeRender(item, vditor);
            });
        }
        renderToc(vditor);
        // 替换独立记录历史，输入通知继续使用各模式的渲染流程。
        if (vditor.currentMode !== "wysiwyg") execAfterRender(vditor, renderOptions);
        vditor.undo.addToUndoStack(vditor);
        this.schedule();
        return count;
    }

    public destroy() {
        this.close();
        this.events.abort();
        this.observer.disconnect();
        this.resizeObserver.disconnect();
        this.highlightStyle.remove();
        this.element.remove();
    }

    private editable() {
        const vditor = this.vditor;
        const surface = vditor[vditor.currentMode].element;
        return !vditor[vditor.currentMode].composingLock && !vditor.element.closest("[inert]") &&
            (vditor.currentMode === "sv" ? !vditor.sv.element.disabled : surface.getAttribute("contenteditable") !== "false");
    }

    private replaceCurrent(all: boolean) {
        const query = this.query.value;
        const replacement = this.replacement.value;
        const count = this.replace(query, replacement, {caseSensitive: this.sensitive.checked,
            index: all ? undefined : this.index});
        if (count && !all) this.index += countMatches(replacement, query, this.sensitive.checked);
        this.refresh();
    }

    private move(direction: number) {
        this.index = this.total ? (this.index + direction + this.total) % this.total : 0;
        this.refresh();
    }

    private schedule() {
        if (this.element.hidden) return;
        window.clearTimeout(this.timer);
        this.timer = window.setTimeout(() => this.refresh(), 120);
    }

    private clearHighlight() {
        (window.CSS as typeof CSS & {highlights?: Map<string, unknown>})?.highlights?.delete(this.highlightName);
        this.sourceHighlight?.remove();
        this.sourceHighlight = undefined;
        this.sourceContent = undefined;
        this.sourceMatch = undefined;
    }

    private input(label: string) {
        const input = document.createElement("input");
        input.className = "vditor-input";
        input.placeholder = label;
        input.setAttribute("aria-label", label);
        return input;
    }

    private button(label: string, action: () => void) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "vditor-button";
        button.textContent = label;
        button.addEventListener("click", action, {signal: this.events.signal});
        return button;
    }

    private highlightSource(match: IFindResult["match"], reveal = true) {
        const element = this.vditor.sv.element;
        this.sourceMatch = match;
        if (!this.sourceHighlight) {
            this.sourceHighlight = document.createElement("div");
            this.sourceHighlight.className = "vditor-find__source";
            this.sourceHighlight.setAttribute("aria-hidden", "true");
            this.sourceContent = document.createElement("div");
            this.sourceHighlight.appendChild(this.sourceContent);
            element.parentElement.appendChild(this.sourceHighlight);
        }
        const mirror = this.sourceContent;
        const computed = getComputedStyle(element);
        for (const property of ["font-family", "font-size", "font-style", "font-weight", "font-variant", "line-height",
            "letter-spacing", "tab-size", "padding", "word-break", "overflow-wrap", "text-indent", "text-align", "direction"]) {
            mirror.style.setProperty(property, computed.getPropertyValue(property));
        }
        Object.assign(this.sourceHighlight.style, {left: `${element.offsetLeft + element.clientLeft}px`,
            top: `${element.offsetTop + element.clientTop}px`, width: `${element.clientWidth}px`, height: `${element.clientHeight}px`});
        Object.assign(mirror.style, {whiteSpace: element.wrap === "off" ? "pre" : "pre-wrap", width: `${element.clientWidth}px`});
        const marker = document.createElement("mark");
        marker.textContent = element.value.slice(match.start, match.end);
        const lineEnd = element.value.indexOf("\n", match.end);
        mirror.replaceChildren(document.createTextNode(element.value.slice(0, match.start)), marker,
            document.createTextNode(element.value.slice(match.end, lineEnd === -1 ? undefined : lineEnd)));
        const top = marker.getBoundingClientRect().top - mirror.getBoundingClientRect().top;
        if (reveal && (top < element.scrollTop || top > element.scrollTop + element.clientHeight)) {
            element.scrollTop = Math.max(0, top - element.clientHeight / 2);
        }
        this.scrollSourceHighlight();
    }

    private scrollSourceHighlight() {
        if (!this.sourceContent) return;
        const element = this.vditor.sv.element;
        this.sourceContent.style.transform = `translate(${-element.scrollLeft}px, ${-element.scrollTop}px)`;
    }
}
