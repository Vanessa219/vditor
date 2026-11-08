/** @jest-environment jsdom */
jest.mock("../../src/ts/constants", () => ({Constants: {ZWSP: "\u200b"}}));
const {codeRender} = require('../../src/ts/markdown/codeRender');

describe('code copy survives serialized DOM', () => {
    beforeEach(() => {
        document.body.innerHTML = '<input value="selection"><div id="root"><pre><code>const a = 1;</code></pre></div>';
        window.VditorI18n = {copy: 'Copy', copied: 'Copied'};
        Object.defineProperty(HTMLElement.prototype, 'innerText', {configurable: true,
            get() { return this.textContent; }});
        document.execCommand = jest.fn(() => true);
        HTMLTextAreaElement.prototype.select = function () { this.focus(); this.setSelectionRange(0, this.value.length); };
    });
    test('restores textarea value and external handlers without duplicating menus', () => {
        const root = document.getElementById('root');
        const option = {renderMenu: jest.fn((_code, menu) => { const custom = document.createElement('i'); custom.className = 'custom'; menu.append(custom); })};
        for (let i = 0; i < 3; i++) {
            codeRender(root, option); codeRender(root, option);
            expect(root.querySelectorAll('.custom')).toHaveLength(1);
            expect(root.querySelectorAll('pre > span')).toHaveLength(1);
            expect(root.querySelectorAll('.vditor-copy')).toHaveLength(1);
            expect(root.querySelector('textarea').value).toBe('const a = 1;');
            const button = root.querySelector('.vditor-copy span');
            expect(button.getAttribute('onclick')).toBeNull();
            const success = jest.fn(); root.addEventListener('vditor-copy-success', success, {once: true});
            const input = document.querySelector('input'); input.focus();input.setSelectionRange(1, 4);
            button.click();
            expect(success).toHaveBeenCalledTimes(1);
            expect(document.activeElement).toBe(input);
            expect(input.selectionStart).toBe(1);expect(input.selectionEnd).toBe(4);
            root.innerHTML = root.innerHTML;
        }
        expect(document.execCommand).toHaveBeenCalledTimes(3);
        expect(option.renderMenu).toHaveBeenCalledTimes(3);
    });
    test('keyboard success and failure preserve honest feedback', () => {
        const root = document.getElementById('root');codeRender(root);
        const button = root.querySelector('.vditor-copy span');
        const success = jest.fn();root.addEventListener('vditor-copy-success', success);
        button.dispatchEvent(new KeyboardEvent('keydown', {key:'Enter', bubbles:true}));
        expect(button.getAttribute('aria-label')).toBe('Copied');expect(success).toHaveBeenCalledTimes(1);
        document.execCommand.mockReturnValue(false);
        button.dispatchEvent(new KeyboardEvent('keydown', {key:' ', bubbles:true}));
        expect(button.getAttribute('aria-label')).toBe('Copy');expect(success).toHaveBeenCalledTimes(1);
    });
});
