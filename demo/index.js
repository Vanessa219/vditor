import Vditor from '../src/index'
import '../src/assets/scss/index.scss'

// new VConsole()

let toolbar
if (window.innerWidth < 768) {
  toolbar = [
    'emoji',
    'headings',
    'bold',
    'italic',
    'strike',
    'link',
    '|',
    'list',
    'ordered-list',
    'check',
    'outdent',
    'indent',
    '|',
    'quote',
    'line',
    'code',
    'inline-code',
    'insert-before',
    'insert-after',
    '|',
    'upload',
    'record',
    'table',
    '|',
    'undo',
    'redo',
    '|',
    'edit-mode',
    'content-theme',
    'code-theme',
    'export',
    {
      name: 'more',
      toolbar: [
        'fullscreen',
        'both',
        'preview',
        'info',
        'help',
      ],
    }]
}

const bindCommentEvent = (cmtElement) => {
  const inputElement = cmtElement.querySelector('input')
  const id = cmtElement.getAttribute('data-id')
  inputElement.addEventListener('blur', () => {
    if (inputElement.value.trim() === '') {
      window.vditor.removeCommentIds([id])
      cmtElement.remove()
    }
  })
  cmtElement.querySelector('button').addEventListener('click', () => {
    window.vditor.removeCommentIds([id])
    cmtElement.remove()
  })

  cmtElement.addEventListener('mouseover', () => {
    window.vditor.hlCommentIds([id])
  })

  cmtElement.addEventListener('mouseout', () => {
    window.vditor.unHlCommentIds([id])
  })
}

const renderComments = (ids) => {
  let cmts = localStorage.getItem('cmts')
  if (!cmts) {
    localStorage.setItem('cmts', '[]')
    cmts = []
  } else {
    cmts = JSON.parse(cmts)
  }

  ids.forEach(id => {
    let text = ''
    cmts.find((item) => {
      if (item.id === id) {
        text = item.text
        return true
      }
    })

    const cmtElement = document.createElement('div')
    cmtElement.setAttribute('data-id', id)
    cmtElement.innerHTML = `<div>
${text}<br>
<button>删除</button><br>
<input> 
</div>`
    cmtElement.value = text
    document.getElementById('comments').
      insertAdjacentElement('beforeend', cmtElement)
    bindCommentEvent(cmtElement)
  })
}

window.vditor = new Vditor('vditor', {
  // _lutePath: `http://192.168.0.107:9090/lute.min.js?${new Date().getTime()}`,
  _lutePath: 'src/js/lute/lute.min.js',
  toolbar,
  mode: 'wysiwyg',
  height: window.innerHeight + 100,
  outline: true,
  debugger: true,
  typewriterMode: true,
  placeholder: 'Hello, Vditor!',
  preview: {
    markdown: {
      toc: true,
      mark: true,
    },
  },
  comment: {
    enable: true,
    add (id, text) {
      const cmtElement = document.createElement('div')
      cmtElement.setAttribute('data-id', id)
      cmtElement.innerHTML = `<div>
${text}<br>
<button>删除</button><br>
<input> 
</div>`
      cmtElement.value = text
      document.getElementById('comments').
        insertAdjacentElement('beforeend', cmtElement)
      bindCommentEvent(cmtElement)
      cmtElement.querySelector('input').focus()
      let cmts = localStorage.getItem('cmts')
      if (!cmts) {
        localStorage.setItem('cmts', '[]')
        cmts = []
      } else {
        cmts = JSON.parse(cmts)
      }
      cmts.push({id, text})
      localStorage.setItem('cmts', JSON.stringify(cmts))
    },
  },
  after () {
    renderComments(window.vditor.getCommentIds())
  },
  toolbarConfig: {
    pin: true,
  },
  counter: {
    enable: true,
    type: 'text',
  },
  hint: {
    emojiPath: 'https://cdn.jsdelivr.net/npm/vditor@1.8.3/dist/images/emoji',
    emojiTail: '<a href="https://ld246.com/settings/function" target="_blank">设置常用表情</a>',
    emoji: {
      'sd': '💔',
      'j': 'https://unpkg.com/vditor@1.3.1/dist/images/emoji/j.png',
    },
    extend: [
      {
        key: '@',
        hint: (key) => {
          console.log(key)
          if ('vanessa'.indexOf(key.toLocaleLowerCase()) > -1) {
            return [
              {
                value: '@Vanessa',
                html: '<img src="https://avatars0.githubusercontent.com/u/970828?s=60&v=4"/> Vanessa',
              }]
          }
          return []
        },
      },
      {
        key: '#',
        hint: (key) => {
          console.log(key)
          if ('vditor'.indexOf(key.toLocaleLowerCase()) > -1) {
            return [
              {
                value: '#Vditor',
                html: '<span style="color: #999;">#Vditor</span> ♏ 一款浏览器端的 Markdown 编辑器，支持所见即所得（富文本）、即时渲染（类似 Typora）和分屏预览模式。',
              }]
          }
          return []
        },
      }],
  },
  tab: '\t',
  upload: {
    accept: 'image/*,.mp3, .wav, .rar',
    token: 'test',
    url: '/api/upload/editor',
    linkToImgUrl: '/api/upload/fetch',
    filename (name) {
      return name.replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '').
        replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '').
        replace('/\\s/g', '')
    },
  },
})
