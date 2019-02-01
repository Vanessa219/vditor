/**
 * @fileoverview server.
 *
 * @author <a href="http://vanessa.b3log.org">Liyuan Li</a>
 * @version 0.1.0.0, Jan 30, 2019
 */

const path = require('path')

module.exports = {
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, 'demo'),
    port: 9000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        pathRewrite: {'^/api' : ''}
      },
      '/hacpai': {
        target: 'https://hacpai.com',
        pathRewrite: {'^/hacpai' : ''}
      }
    }
  }
};