/** @jest-environment jsdom */
import {Tip} from "../../src/ts/tip";

describe("custom message tips", () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it("delegates show/hide and resets expiration when a message is replaced", () => {
        const tips = {show: jest.fn(), hide: jest.fn()};
        const tip = new Tip(tips);
        tip.show("first", 100);
        jest.advanceTimersByTime(50);
        tip.show("second", 200);
        jest.advanceTimersByTime(100);
        expect(tips.hide).not.toHaveBeenCalled();
        expect(tips.show.mock.calls).toEqual([["first", 100], ["second", 200]]);
        expect(tip.element.innerHTML).toBe("");
        jest.advanceTimersByTime(100);
        expect(tips.hide).toHaveBeenCalledTimes(1);
    });

    it("keeps persistent tips until hide and cancels their timers", () => {
        const tips = {show: jest.fn(), hide: jest.fn()};
        const tip = new Tip(tips);
        tip.show("persistent", 0);
        jest.runAllTimers();
        expect(tips.hide).not.toHaveBeenCalled();
        tip.hide(); tip.hide();
        expect(tips.hide).toHaveBeenCalledTimes(1);
        tip.show("timed", 100);
        tip.hide(); jest.runAllTimers();
        expect(tips.hide).toHaveBeenCalledTimes(2);
    });

    it("retains built-in notifications without a custom adapter", () => {
        const tip = new Tip();
        tip.show("old", 100);
        tip.show("persistent", 0);
        jest.runAllTimers();
        expect(tip.element.textContent).toContain("persistent");
        (tip.element.querySelector(".vditor-tip__close") as HTMLElement).click();
        expect(tip.element.className).toBe("vditor-tip");
        expect(tip.element.textContent).toBe("");
    });
});
