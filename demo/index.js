import Vditor from '../src/index'
import '../src/assets/scss/classic.scss'

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

window.vditor = new Vditor('vditor', {
  counter: 100,
  height: 300,
  editorName: 'vditor',
  keymap: {
    deleteLine: '⌘-a'
  },
  hint: {
    emojiPath: 'https://static.hacpai.com/emoji/graphics',
    emojiTail: '<a href="https://hacpai.com/settings/function" target="_blank">设置常用表情</a>',
    emoji: {
      '+1': '👍',
      '-1': '👎',
      'egg': '🥚',
      'eggplant': '🍆',
      'eight': '8⃣',
      'eight_pointed_black_star': '✴',
      'eight_spoked_asterisk': '✳',
      'electric_plug': '🔌',
      'elephant': '🐘',
      'email': '✉',
      'end': '🔚',
      'envelope': '✉',
      'es': '🇪🇸',
      'euro': '💶',
      'european_castle': '🏰',
      'european_post_office': '🏤',
      'evergreen_tree': '🌲',
      'exclamation': '❗',
      'expressionless': '😑',
      'eyeglasses': '👓',
      'eyes': '👀',
      'facepunch': '👊',
      'factory': '🏭',
      'fallen_leaf': '🍂',
      'family': '👪',
      'fast_forward': '⏩',
      'fax': '📠',
      'fearful': '😨',
      'feet': '🐾',
      'ferris_wheel': '🎡',
      'file_folder': '📁',
      'fire': '🔥',
      'fire_engine': '🚒',
      'fireworks': '🎆',
      'first_quarter_moon': '🌓',
      'first_quarter_moon_with_face': '🌛',
      'fish': '🐟',
      'fish_cake': '🍥',
      'fishing_pole_and_fish': '🎣',
      'fist': '✊',
      'five': '5⃣',
      'flags': '🎏',
      'flashlight': '🔦',
      'floppy_disk': '💾',
      'flower_playing_cards': '🎴',
      'flushed': '😳',
      'foggy': '🌁',
      'football': '🏈',
      'fork_and_knife': '🍴',
      'fountain': '⛲',
      'four': '4⃣',
      'four_leaf_clover': '🍀',
      'fr': '🇫🇷',
      'free': '🆓',
      'fried_shrimp': '🍤',
      'fries': '🍟',
      'frog': '🐸',
      'frowning': '😦',
      'fuelpump': '⛽',
      'full_moon': '🌕',
      'full_moon_with_face': '🌝',
      'trollface': 'https://unpkg.com/vditor@1.3.1/dist/images/emoji/trollface.png',
      'huaji': 'https://unpkg.com/vditor@1.3.1/dist/images/emoji/huaji.gif',
    },
  },
  tab: '  ',
  upload: {
    accept: 'image/*,.pdf,.wav',
    token: 'test',
    url: '/api/upload/editor',
    linkToImgUrl: '/api/upload/fetch',
    filename (name) {
      // ? \ / : | < > * [ ] white to -
      return name.replace(/\?|\\|\/|:|\||<|>|\*|\[|\]|\s+/g, '-')
    },
    handler (file) {
      console.log(file)
      return 'handler'
    },
  },
  preview: {
    mode: "preview",
    parse: () => {
      LazyLoadImage()
    },
  },
})

window.vditorTest = new Vditor('vditorTest', {
  cache: true,
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
      'trollface': 'https://unpkg.com/vditor@1.3.1/dist/images/emoji/trollface.png',
      'huaji': 'https://unpkg.com/vditor@1.3.1/dist/images/emoji/huaji.gif',
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
    {
      name: 'both',
      tipPosition: 'ne',
    },
    'br',
    {
      name: 'emoji',
    },
    'strike',
  ],
})