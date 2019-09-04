import {spec} from './commonmark-0.29'

require('../../src/js/lute/lute.min.js')

const globalAny: any = global;

it('MarkdownIt', () => {
    spec.forEach(async (item: any) => {
        const result = globalAny.lute.markdown(item.markdown)
        expect(result).toBe(item.html)
        if (result !== item.html) {
            console.log(item.example)
        }
    })
})
