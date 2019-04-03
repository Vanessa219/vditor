/**
 * @fileoverview server.
 *
 * @author <a href="http://vanessa.b3log.org">Liyuan Li</a>
 * @version 0.1.0.1, Apr 2, 2019
 */

const path = require('path')

module.exports = {
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, '.'),
    port: 9000,
    host: '0.0.0.0',
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