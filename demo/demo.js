import Vditor from '../src/index'
// import Vditor from '../dist/index.min'

const LazyLoadImage = () => {
  const loadImg = (it) => {
    const testImage = document.createElement('img')
    testImage.src = it.getAttribute('data-src')
    testImage.addEventListener('load', () => {
      it.src = testImage.src
      it.style.backgroundImage = 'none'
      it.style.backgroundColor = 'transparent'
    })
    it.removeAttribute('data-src')
  }

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('img').forEach((data) => {
      if (data.getAttribute('data-src')) {
        loadImg(data)
      }
    })
    return false
  }

  if (window.imageIntersectionObserver) {
    window.imageIntersectionObserver.disconnect()
    document.querySelectorAll('img').forEach(function (data) {
      window.imageIntersectionObserver.observe(data)
    })
  } else {
    window.imageIntersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entrie) => {
        if ((typeof entrie.isIntersecting === 'undefined'
          ? entrie.intersectionRatio !== 0
          : entrie.isIntersecting) && entrie.target.getAttribute('data-src')) {
          loadImg(entrie.target)
        }
      })
    })
    document.querySelectorAll('img').forEach(function (data) {
      window.imageIntersectionObserver.observe(data)
    })
  }
}

const vditor2 = new Vditor('vditor2', {
  counter: 100,
  upload: {
    token: 'test',
    url: '/api/upload/editor',
    linkToImgUrl: '/api/upload/fetch',
    filename: name => {
      // ? \ / : | < > * [ ] white to -
      return name.replace(/\?|\\|\/|:|\||<|>|\*|\[|\]|\s+/g, '-')
    },
  },
  preview: {
    show: true,
    url: '/api/markdown',
    parse: () => {
      LazyLoadImage()
    },
  },
  classes: {
    preview: 'content-reset',
  },
})

const vditor = new Vditor('vditor', {
  cache: false,
  height: 200,
  width: '50%',
  counter: 100,
  resize: {
    enable: true,
    position: 'top',
    after: height => {
      console.log(`after resize, height change: ${height}`)
    },
  },
  placeholder: 'say sth...',
  lang: 'en_US',
  preview: {
    url: '/api/markdown',
    parse: (element) => {
      console.log(element)
      LazyLoadImage()
    },
  },
  hint: {
    emojiPath: 'https://static.hacpai.com/emoji/graphics',
    emojiTail: '<a href="https://hacpai.com/settings/function" target="_blank">设置常用表情</a>',
    emoji: {
      '+1': '👍',
      '-1': '👎',
      'trollface': 'https://vditor.b3log.org/images/trollface.png',
    },
    at: (key) => {
      console.log(`atUser: ${key}`)
      return [
        {
          value: '@88250',
          html: '<img src="https://img.hacpai.com/avatar/1353745196354_1535379434567.png?imageView2/1/w/52/h/52/interlace/0/q"> 88250',
        },
        {
          value: '@Vanessa',
          html: '<img src="https://img.hacpai.com/avatar/1353745196354_1535379434567.png?imageView2/1/w/52/h/52/interlace/0/q"> Vanessa',
        }]
    },
  },
  classes: {
    preview: 'content-reset',
  },
  focus: (val) => {
    console.log(`focus value: ${val}`)
    console.log(
      `focus cursor position:${JSON.stringify(vditor.getCursorPosition())}`)
  },
  blur: (val) => {
    console.log(`blur: ${val}`)
  },
  input: (val, mdElement) => {
    console.log('change:' + val, mdElement)
  },
  esc: (val) => {
    console.log(`esc: ${val}`)
  },
  ctrlEnter: (val) => {
    console.log(`ctrlEnter: ${val}`)
  },
  select: (val) => {
    console.log(`select: ${val}`)
  },
  toolbar: [
    {
      name: 'preview',
      tipPosition: 'ne',
    },
    'br',
    {
      name: 'emoji',
    },
    'strike',
  ],
})

// vditor.insertVale('Hi, Vditor!')
// vditor.focus()
// console.log('vditor.getValue(): ' + vditor.getValue())
// vditor.setSelection(4, 9)
// console.log('vditor.getSelection(): ' + vditor.getSelection())
// setTimeout(() => {
//   vditor.setValue('Hi, Markdown!')
//   vditor.renderPreview()
//   vditor.disabled()
// }, 3000)
//
// setTimeout(() => {
//   vditor.enable()
//   vditor.setSelection(4, 12)
//   vditor.deleteValue()
// }, 6000)
//
// setTimeout(() => {
//   vditor.setSelection(0, 4)
//   vditor.updateValue('Welcome')
//   vditor.blur()
// }, 9000)