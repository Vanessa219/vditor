import puppeteer, {Page} from "puppeteer";
import {mkdtempSync} from "fs";
import {join} from "path";

const getExecutablePath = () => {
    try {
        return puppeteer.executablePath();
    } catch (error) {
        return puppeteer.executablePath("chrome");
    }
};

export const launchBrowser = () => puppeteer.launch({
    browser: process.env.VDITOR_TEST_BROWSER === "firefox" ? "firefox" : "chrome",
    executablePath: process.env.VDITOR_TEST_EXECUTABLE_PATH || getExecutablePath(),
    userDataDir: process.env.VDITOR_TEST_PROFILE_ROOT ?
        mkdtempSync(join(process.env.VDITOR_TEST_PROFILE_ROOT, "profile-")) : undefined,
});

export const useLocalVditorAssets = async (page: Page) => {
    await page.setRequestInterception(true);
    page.on("request", async (request) => {
        const url = request.url();
        const distMarker = "/dist/";
        const isVditorCDN = url.includes("cdn.jsdelivr.net/npm/vditor") || url.includes("unpkg.com/vditor");
        if (isVditorCDN && url.includes(distMarker)) {
            const localPath = url.substring(url.indexOf(distMarker) + distMarker.length);
            const origin = process.env.VDITOR_TEST_ORIGIN || "http://localhost:9000";
            const response = await fetch(`${origin}/${localPath}`);
            await request.respond({status: response.status, headers: {"access-control-allow-origin": "*"},
                contentType: response.headers.get("content-type"), body: Buffer.from(await response.arrayBuffer())});
        } else {
            request.continue();
        }
    });
};
