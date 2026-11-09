const {launchBrowser, useLocalVditorAssets} = require("./launchBrowser");

const openEditorPage = async () => {
    const browser = await launchBrowser();
    const page = await browser.newPage();
    const origin = process.env.VDITOR_TEST_ORIGIN || "http://localhost:9000";
    await useLocalVditorAssets(page);
    try {
        await page.goto(origin + "/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
    } catch (error) {
        await browser.close();
        throw error;
    }
    return {browser, page};
};

const newEditor = (page, options = {}) => page.evaluate(async options => {
    if (window.testEditor) {
        const root = window.testEditor.vditor.element;
        window.testEditor.destroy(); root.remove();
    }
    const root = document.createElement("div");
    document.body.appendChild(root);
    window.testEditor = await new Promise(resolve => {
        const editor = new window.vditorTest.constructor(root, {
            mode: "wysiwyg", icon: "", cache: {enable: false}, i18n: window.VditorI18n,
            _lutePath: "/js/lute/lute.min.js", undoDelay: 0, preview: {delay: 0}, ...options,
            after: () => resolve(editor),
        });
    });
}, options);

module.exports = {openEditorPage, newEditor};
