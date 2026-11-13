/** @jest-environment jsdom */
import {findText, replaceText} from "../src/ts/find/text";

test("rich replacements escape punctuation before Markdown serialization", () => {
    const element = document.createElement("pre");
    element.innerHTML = '<h1 data-block="0">Omega</h1>';
    expect(replaceText(element, "Omega", "*literal* <b> & $&", false, 0)).toBe(1);
    expect(element.textContent).toBe("\\*literal\\* \\<b\\> \\& \\$\\&");
});

test("hidden escape markers are excluded from rich text matches", () => {
    const element = document.createElement("div");
    element.innerHTML = '<p><span data-type="backslash"><span>\\</span>*</span>literal' +
        '<span data-type="backslash"><span>\\</span>*</span></p>';
    expect(findText(element, "*literal*", false).total).toBe(1);
    expect(replaceText(element, "*", "X", false)).toBe(2);
    expect(element.textContent).toBe("XliteralX");
    expect(element.querySelector('[data-type="backslash"]')).toBeNull();
});

test("inline formatting matches stay within paragraph and cell boundaries", () => {
    const element = document.createElement("pre");
    element.innerHTML = '<p>ab<strong>cd</strong>ef<br>gh</p><p>ij</p><table><tr><td>kl</td><td>mn</td></tr></table>';
    const result = findText(element, "bcde", false);
    expect(result.total).toBe(1);
    expect(result.match.range.toString()).toBe("bcde");
    for (const query of ["fgh", "ghij", "klmn"]) expect(findText(element, query, false).total).toBe(0);
    expect(replaceText(element, "bcde", "X", false)).toBe(1);
    expect(element.querySelector("p").innerHTML).toBe("aX<strong></strong>f<br>gh");
});

test("code and rich text have separate escaping and preview scope", () => {
    const element = document.createElement("pre");
    element.innerHTML = '<p>one</p><div data-type="code-block"><pre><code>one</code></pre>' +
        '<pre class="vditor-ir__preview"><code>one</code></pre></div>';
    expect(findText(element, "one", false).total).toBe(2);
    expect(replaceText(element, "one", "*", false)).toBe(2);
    expect(element.querySelector("p").textContent).toBe("\\*");
    expect(element.querySelector("code").textContent).toBe("*");
    expect(element.querySelector(".vditor-ir__preview code").textContent).toBe("one");
});

test("source search counts large documents without a Range per match", () => {
    const element = document.createElement("textarea");
    element.value = "one ".repeat(150000);
    const result = findText(element, "ONE", false, 149999);
    expect(result.total).toBe(150000);
    expect(result.index).toBe(149999);
    expect(result.match).toEqual({start: 599996, end: 599999, range: undefined});
    expect(replaceText(element, "one", "$&*", false)).toBe(150000);
    expect(element.value.startsWith("$&* $&* ")).toBe(true);
});

test("zero-width editor sentinels preserve text offsets and Unicode matches", () => {
    const element = document.createElement("pre");
    element.innerHTML = "<p>\u200bA\u200b😀\u200bB\u200b</p>";
    const result = findText(element, "a😀b", false);
    expect(result.total).toBe(1);
    expect(result.match.range.toString().replace(/\u200b/g, "")).toBe("A😀B");
    expect(findText(element, "a😀b", true).total).toBe(0);
});
