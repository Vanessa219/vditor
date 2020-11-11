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
    removeComment(cmtElement, id)
  })

  cmtElement.addEventListener('mouseover', () => {
    window.vditor.hlCommentIds([id])
  })

  cmtElement.addEventListener('mouseout', () => {
    window.vditor.unHlCommentIds([id])
  })
}

const removeComment = (cmtElement, id) => {
  cmtElement.remove()

  let cmts = localStorage.getItem('cmts')
  if (!cmts) {
    return
  } else {
    cmts = JSON.parse(cmts)
  }
  cmts.find((item, index) => {
    if (item.id === id) {
      cmts.splice(index, 1)
      return true
    }
  })
  localStorage.setItem('cmts', JSON.stringify(cmts))
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
    remove (ids) {
      ids.forEach((id) => {
        removeComment(document.querySelector(`#comments div[data-id="${id}"]`),
          id)
      })
    },
  },
  after () {
    renderComments(window.vditor.getCommentIds())
  },
})
