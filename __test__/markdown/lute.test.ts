import {spec} from './commonmark-0.29'

require('../../src/js/lute/lute.min.js')

const globalAny: any = global;

it('MarkdownIt', () => {
    spec.forEach(async (item: any) => {
        const result = globalAny.lute.markdown(item.markdown, {
            gfm: false,
            softBreak2HardBreak: false,
            autoSpace: false,
            fixTermTypo: false,
            emoji: false,
        })
        expect(result).toBe(item.html)
    })
})
