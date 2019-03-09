import puppeteer from 'puppeteer'

describe('use puppeteer to test getTextareaPosition', () => {
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

    it('getTextareaPosition', async () => {
        await page.evaluate(() => {
            // @ts-ignore
            vditorTest.setValue('vditorvditorvditorvditorvditorvditorvditorvditorvditorvditorvditorvditor for jest puppeteer :')
        })

        await page.waitFor(1000)

        let text = await page.evaluate(() => {
            // @ts-ignore
            return vditorTest.vditor.hint.element.getAttribute('style')
        })
        expect(text).toContain('top: -65px;')
        expect(text).toContain('left: 173px;')
    })

    afterAll(async () => {
        await browser.close()
    })
})