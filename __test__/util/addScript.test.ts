/** @jest-environment jsdom */
import {addScript} from "../../src/ts/util/addScript";

describe("script loading", () => {
    it("shares a pending script and waits for execution", async () => {
        const first = addScript("/runtime.js", "testRuntime");
        const second = addScript("/runtime.js", "testRuntime");
        expect(first).toBe(second);
        expect(document.querySelectorAll('script[src="/runtime.js"]')).toHaveLength(1);
        let loaded = false;
        second.then(() => { loaded = true; });
        await Promise.resolve();
        expect(loaded).toBe(false);
        const script = document.querySelector('script[src="/runtime.js"]');
        script.dispatchEvent(new Event("load"));
        await expect(first).resolves.toBe(true);
        expect(script.id).toBe("testRuntime");
        await expect(addScript("/runtime.js", "testRuntime")).resolves.toBe(true);
    });

    it("removes failed loads and permits retry", async () => {
        const failure = addScript("/retry.js", "retryRuntime");
        const rejected = expect(failure).rejects.toBeInstanceOf(Event);
        document.querySelector('script[src="/retry.js"]').dispatchEvent(new Event("error"));
        await rejected;
        expect(document.querySelector('script[src="/retry.js"]')).toBeNull();
        const retry = addScript("/retry.js", "retryRuntime");
        document.querySelector('script[src="/retry.js"]').dispatchEvent(new Event("load"));
        await expect(retry).resolves.toBe(true);
    });
});
