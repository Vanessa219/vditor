
import(/* webpackChunkName: "marked" */ 'marked')
    .then(marked => {
        console.log(marked.parse('# Marked in the browser.'));
    })
    .catch(err => {
        console.log('Failed to load marked', err);
    });