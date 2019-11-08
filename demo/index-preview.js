import VditorPreview from '../src/method'
import '../src/assets/scss/classic.scss'

VditorPreview.preview(document.getElementById('preview'),
  document.getElementById('markdownText').textContent, {
    className: 'preview vditor-reset',
    customEmoji: {
      'sd': '💔',
      'j': 'https://unpkg.com/vditor@1.3.1/dist/images/emoji/j.png',
    },
    speech: {
      enable: true,
    },
  })
