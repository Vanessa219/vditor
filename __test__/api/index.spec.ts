import puppeteer from 'puppeteer'

describe('use puppeteer to test API', () => {
    let browser: any
    let page: any
    beforeAll(async () => {
        browser = await puppeteer.launch()
        page = await browser.newPage()
        await Promise.all([
            page.coverage.startJSCoverage(),
            page.coverage.startCSSCoverage(),
        ])
        await page.goto('http://localhost:9000/demo/')
    })

    it('API', async () => {
        // TODO
        await page.evaluate(() => {
        })

        await page.waitFor(1000)

        let result = await page.evaluate(() => {
        })

    })

    afterAll(async () => {
        await browser.close()
    })
})