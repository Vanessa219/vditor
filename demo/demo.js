import Vditor from '../src/index'
// import Vditor from '../dist/vditor/index.min'

const vditor = new Vditor('vditor', {
  cache: false,
  height: 200,
  width: '50%',
  counter: 100,
  draggable: true,
  placeholder: 'say sth...',
  lang: 'en_US',
  preview: {
    url: '/api/markdown',
    parse: (element) => {
      console.log(element)
    },
  },
  hint: {
    emojiTail: '<a href="https://hacpai.com/settings/function" target="_blank">设置常用表情</a>',
    emoji: ['+1', '-1'],
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

const vditor2 = new Vditor('vditor2', {
  upload: {
    url: '/api/upload/editor',
    linkToImgUrl: '/api/fetch-upload',
  },
  preview: {
    show: true,
    url: '/api/markdown',
    parse: (element) => {
      console.log(element)
    },
  },
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