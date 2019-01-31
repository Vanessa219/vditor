// webpack.demo.js
import Vditor from '../src/index'
// import Vditor from 'vditor'
// import Vditor from '../dist/index.min'

const vditor = new Vditor('vditor', {
  height: 200,
  width: '50%',
  counter: 100,
  draggable: true,
  placeholder: 'say sth...',
  lang: 'en_US',
  previewShow: true,
  classes: {
    preview: 'content-reset',
  },
  commonEmoji: {
    '+1': '👍',
    '-1': '👎',
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
  atUser: (key) => {
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
  toolbar: [
    {
      name: 'preview',
      tipPosition: 'ne',
    },
    'br'
    , {
      name: 'emoji',
      tail: '<a href="https://hacpai.com/settings/function" target="_blank">设置常用表情</a>',
    },
    'strike',
  ],
})

const vditor2 = new Vditor('vditor2', {
  upload: {
    url: '/api/upload/editor',
  },
})

vditor.insertVale('Hi, Vditor!')
vditor.focus()
console.log('vditor.getValue(): ' + vditor.getValue())
vditor.setSelection(4, 9)
console.log('vditor.getSelection(): ' + vditor.getSelection())
setTimeout(() => {
  vditor.setValue('Hi, Markdown!')
  vditor.renderPreview()
  vditor.disabled()
}, 3000)

setTimeout(() => {
  vditor.enable()
  vditor.setSelection(4, 12)
  vditor.deleteValue()
}, 6000)

setTimeout(() => {
  vditor.setSelection(0, 4)
  vditor.updateValue('Welcome')
  vditor.blur()
}, 9000)