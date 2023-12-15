import Vditor from '../src/index'
import '../src/assets/less/index.less'

window.vditorTest = new Vditor('vditorTest', {
  tab: '\t',
  cache: false,
  height: 200,
  width: 500,
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
      LazyLoadImage()
    },
    hljs: {
      style: 'solarized-dark256',
      lineNumber: true,
    },
  },
  hint: {
    emojiPath: 'https://cdn.jsdelivr.net/npm/vditor/dist/images/emoji',
    emojiTail: '<a href="https://ld246.com/settings/function" target="_blank">设置常用表情</a>',
    emoji: {
      '+1': '👍',
      '-1': '👎',
      'trollface': 'https://cdn.jsdelivr.net/npm/vditor@1.3.1/dist/images/emoji/trollface.png',
      'huaji': 'https://cdn.jsdelivr.net/npm/vditor@1.3.1/dist/images/emoji/huaji.gif',
    },
    at: (key) => {
      console.log(`atUser: ${key}`)
      return [
        {
          value: '@88250',
          html: '<img src="https://img.ld246.com/avatar/1353745196354_1535379434567.png?imageView2/1/w/52/h/52/interlace/0/q"> 88250',
        },
        {
          value: '@Vanessa',
          html: '<img src="https://img.ld246.com/avatar/1353745196354_1535379434567.png?imageView2/1/w/52/h/52/interlace/0/q"> Vanessa',
        }]
    },
  },
  focus: (val) => {
    console.log(`focus value: ${val}`)
  },
  blur: (val) => {
    console.log(`blur: ${val}`)
  },
  input: (val, mdElement) => {
    console.log('change:' + val, mdElement)
  },
  esc: (val) => {
    console.log(`esc: ${val}`)
    console.log(
      `cursor position:${JSON.stringify(vditorTest.getCursorPosition())}`)
  },
  ctrlEnter: (val) => {
    console.log(`ctrlEnter: ${val}`)
  },
  select: (val) => {
    console.log('select:', val)
  },
  upload: {
    accept: 'image/*,.pdf',
    token: 'test',
    url: '/api/upload/editor',
    linkToImgUrl: '/api/upload/fetch',
    filename: name => {
      // ? \ / : | < > * [ ] white to -
      return name.replace(/\?|\\|\/|:|\||<|>|\*|\[|\]|\s+/g, '-')
    },
  },
  toolbar: [
    {
      name: 'preview',
      tipPosition: 'ne',
    },
    'both',
    {
      name: 'wysiwyg',
      tipPosition: 'ne',
    },
    {
      name: 'both',
      tipPosition: 'ne',
    },
    'br',
    {
      name: 'emoji',
    },
    'strike',
    'devtools',
    'fullscreen',
    {
      name: 'download',
      tipPosition: 'nw',
      tip: '下载',
      icon: '<svg t="1566271629641" class="icon" viewBox="0 0 1092 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1960" xmlns:xlink="http://www.w3.org/1999/xlink" width="34.125" height="32"><defs><style type="text/css"></style></defs><path d="M1044.753067 902.3488H47.5136a47.5136 47.5136 0 0 0 0 94.890667h997.239467a45.806933 45.806933 0 0 0 33.5872-13.858134 47.5136 47.5136 0 0 0-33.5872-81.032533z m-522.4448-103.970133a33.450667 33.450667 0 0 0 23.825066 8.874666 33.450667 33.450667 0 0 0 23.825067-8.874666l302.2848-290.952534c7.509333-7.236267 8.874667-16.452267 3.6864-24.7808-5.188267-8.3968-32.768-7.714133-44.8512-7.714133h-118.784V47.5136c0-25.941333-13.789867-47.5136-47.445333-47.5136H427.4176c-33.655467 0-47.5136 21.572267-47.5136 47.5136v427.349333H237.431467c-12.014933 0-15.906133-0.6144-21.162667 7.7824-5.188267 8.328533-3.754667 17.544533 3.6864 24.7808l302.421333 290.952534z" p-id="1961"></path></svg>',
      click: () => {
        alert('download')
      },
    },
  ],
})

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
