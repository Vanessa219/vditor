import puppeteer, {Page} from "puppeteer";

const getExecutablePath = () => {
    try {
        return puppeteer.executablePath();
    } catch (error) {
        return puppeteer.executablePath("chrome");
    }
};

export const launchBrowser = () => puppeteer.launch({
    executablePath: getExecutablePath(),
});

export const useLocalVditorAssets = async (page: Page) => {
    await page.setRequestInterception(true);
    page.on("request", (request) => {
        const url = request.url();
        const distMarker = "/dist/";
        const isVditorCDN = url.includes("cdn.jsdelivr.net/npm/vditor") || url.includes("unpkg.com/vditor");
        if (isVditorCDN && url.includes(distMarker)) {
            const localPath = url.substring(url.indexOf(distMarker) + distMarker.length);
            request.continue({url: `http://localhost:9000/${localPath}`});
        } else {
            request.continue();
        }
    });
};
