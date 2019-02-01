export class Markdown {
    element: HTMLElement

    constructor(vditor: Vditor) {
        this.element = document.createElement('div')
        this.element.className = 'vditor-preview' +
            (vditor.options.classes.preview ? ' ' + vditor.options.classes.preview : '')
    }

    render () {
        let markedParse
        if (!markedParse) {
            import(/* webpackChunkName: "marked" */ 'marked')
                .then(marked => {
                    markedParse = marked.parser
                })
                .catch(err => {
                    console.log('Failed to load marked', err);
                });
        }

        //markedParse('# Marked in the browser.')
    }
}
