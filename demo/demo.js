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
    console.log(`focus: ${val}`)
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
    'preview',
    {
      name: 'emoji',
      tail: '<a href="https://hacpai.com/settings/function" target="_blank">设置常用表情</a>',
    }],
})

const vditor2 = new Vditor('vditor2')