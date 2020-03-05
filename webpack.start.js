/**
 * @fileoverview demo.
 *
 * @author <a href="http://vanessa.b3log.org">Liyuan Li</a>
 * @version 0.3.0.0, Sep 3, 2019
 */

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const pkg = require('./package.json')

module.exports = {
  mode: 'development',
  watch: true,
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'demo/dist'),
  },
  entry: {
    'index.js': './demo/index.js',
    'jest-puppeteer.js': './demo/jest-puppeteer.js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.svg', '.png', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        include: [path.resolve(__dirname, 'src')],
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
            options: {
              url: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                require('autoprefixer')({grid: true, remove: false}),
              ],
            },
          },
          {
            loader: 'sass-loader', // compiles Sass to CSS
          },
        ],
      },
      {
        test: /\.svg$/,
        include: [path.resolve(__dirname, './src/assets/icons')],
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
            },
          },
        ],
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/env',
                {
                  targets: {
                    browsers: [
                      'last 2 Chrome major versions',
                      'last 2 Firefox major versions',
                      'last 2 Safari major versions',
                      'last 2 Edge major versions',
                      'last 2 iOS major versions',
                      'last 2 ChromeAndroid major versions',
                    ],
                  },
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.png$/,
        include: [path.resolve(__dirname, './src/assets/images')],
        use: [
          'file-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunks: ['index.js'],
      filename: './index.html',
      template: './demo/index.html',
    }),
    new HtmlWebpackPlugin({
      chunks: ['jest-puppeteer.js'],
      filename: './jest-puppeteer.html',
      template: './demo/jest-puppeteer.html',
    }),
    new webpack.DefinePlugin({
      VDITOR_VERSION: JSON.stringify(pkg.version),
    }),
    new CopyPlugin([
      {from: 'src/images', to: 'images'},
      {from: 'src/js', to: 'js'},
    ]),
  ],
  devServer: {
    contentBase: path.join(__dirname, '.'),
    port: 9000,
    host: '0.0.0.0',
    before: (app) => {
      app.get('/dist/js/lute/lute.wasm.br', function (req, res, next) {
        res.set({
          'Content-Encoding': 'br',
          'Content-Type': 'application/wasm',
        })
        next()
      })
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        pathRewrite: {'^/api': ''},
      },
      '/hacpai': {
        target: 'https://hacpai.com',
        pathRewrite: {'^/hacpai': ''},
      },
    },
  },
}
