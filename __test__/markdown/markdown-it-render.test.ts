import MarkdownIt from 'markdown-it'
import {spec} from './commonmark-0.28'

it('MarkdownIt', () => {
    let right = 0;
    let error = 0;
    spec.forEach(async (item: any) => {
        const result = new MarkdownIt({
            xhtmlOut: true,
            html: true,
        }).render(item.markdown)
        if (result === item.html) {
            right++
        } else {
            error++
        }
        expect(result).toBe(item.html)
    })
    console.log(`pass:${right}, error:${error}`)
})