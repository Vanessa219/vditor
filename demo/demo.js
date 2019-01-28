// webpack.demo.js
import Vditor from '../src/index'
// import Vditor from 'vditor'
// import Vditor from '../dist/index.min'

const vditor = new Vditor('vditor', {
  toolbar: [{
    name: 'emoji',
    tail: '<a href="https://hacpai.com/settings/function" target="_blank">设置常用表情</a>',
  }],
})

const vditor2 = new Vditor('vditor2')