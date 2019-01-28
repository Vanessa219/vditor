import(/* webpackChunkName: "marked" */ 'marked')
    .then(marked => {
        console.log(marked.parse('# Marked in the browser.'));
    })
    .catch(err => {
        console.log('Failed to load marked', err);
    });

export class Markdown {
    element: HTMLElement

    constructor(vditor: Vditor) {
        this.element = document.createElement('div')
        this.element.className = 'vditor-preview'
    }

    renderPreview(html: string) {
        this.element.innerHTML = html
    }
}