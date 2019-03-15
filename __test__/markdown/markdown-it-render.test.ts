import MarkdownIt from 'markdown-it'
import {spec} from './commonmark-0.28'

it('MarkdownIt', () => {
    spec.forEach(async (item: any) => {
        const result = new MarkdownIt({
            xhtmlOut: true,
            html: true,
        }).render(item.markdown)
        expect(result).toBe(item.html.replace(/<blockquote>\n<\/blockquote>/g, '<blockquote></blockquote>'))
    })
})