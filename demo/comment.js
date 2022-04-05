import Vditor from '../src/index'
import '../src/assets/less/index.less'

const bindCommentEvent = (cmtElement) => {
  const inputElement = cmtElement.querySelector('input')
  const id = cmtElement.getAttribute('data-id')
  inputElement.addEventListener('blur', () => {
    if (inputElement.value.trim() === '') {
      window.vditor.removeCommentIds([id])
      removeComment(cmtElement, id)
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

  ids.forEach(commentData => {
    let text = ''
    cmts.find((item) => {
      if (item.id === commentData.id) {
        text = item.text
        return true
      }
    })

    const cmtElement = document.createElement('div')
    cmtElement.setAttribute('data-id', commentData.id)
    cmtElement.setAttribute('style', `top:${commentData.top}px`)
    cmtElement.innerHTML = `<div>
${text}<br>
<button>删除</button><br>
<input>
</div>`
    cmtElement.value = text
    document.getElementById('comments').
      insertAdjacentElement('beforeend', cmtElement)
    // 高度调整
    const previousElement = cmtElement.previousElementSibling
    if (previousElement) {
      const previousTop = parseInt(previousElement.style.top) +
        previousElement.clientHeight + 20
      if (previousTop > commentData.top) {
        cmtElement.style.top = previousTop + 'px'
      }
    }
    bindCommentEvent(cmtElement)
  })

  document.getElementById('comments').addEventListener("scroll", () => {
    window.vditor.vditor.wysiwyg.element.scrollTop = document.getElementById('comments').scrollTop
  })
}

const matchCommentsTop = (commentsData) => {
  commentsData.forEach((item) => {
    const commentElement = document.querySelector(
      `#comments div[data-id="${item.id}"]`)
    commentElement.setAttribute('style', `top:${item.top}px`)
    // 高度调整
    const previousElement = commentElement.previousElementSibling
    if (previousElement) {
      const previousTop = parseInt(previousElement.style.top) +
        previousElement.clientHeight + 20
      if (previousTop > item.top) {
        commentElement.style.top = previousTop + 'px'
      }
    }
  })

  document.getElementById('comments').scrollTop = window.vditor.vditor.wysiwyg.element.scrollTop
}

window.vditor = new Vditor('vditor', {
  // _lutePath: `http://192.168.0.107:9090/lute.min.js?${new Date().getTime()}`,
  _lutePath: 'src/js/lute/lute.min.js',
  mode: 'wysiwyg',
  debugger: true,
  typewriterMode: true,
  placeholder: 'Hello, Vditor!',
  comment: {
    enable: true,
    adjustTop(commentsData) {
      matchCommentsTop(commentsData)
    },
    add (id, text, commentsData) {
      commentsData.find((item, index) => {
        if (item.id === id) {
          const cmtElement = document.createElement('div')
          cmtElement.setAttribute('data-id', id)
          cmtElement.innerHTML = `<div>
${text}<br>
<button>删除</button><br>
<input>
</div>`
          cmtElement.value = text
          if (index === 0) {
            document.querySelector('#comments').
              insertAdjacentElement('beforeend', cmtElement)
          } else {
            document.querySelector(
              `#comments div[data-id="${commentsData[index - 1].id}"]`).
              insertAdjacentElement('afterend', cmtElement)
          }
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
          return true
        }
      })
      matchCommentsTop(commentsData)
    },
    remove (ids) {
      ids.forEach((id) => {
        removeComment(document.querySelector(`#comments div[data-id="${id}"]`),
          id)
      })
      matchCommentsTop(window.vditor.getCommentIds())
    },
    scroll (top) {
      document.getElementById('comments').scrollTop = top
    },
  },
  after () {
    renderComments(window.vditor.getCommentIds())
  },
})
