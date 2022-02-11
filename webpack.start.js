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
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'demo/dist'),
  },
  entry: {
    'index.js': './demo/index.js',
    'render.js': './demo/render.js',
    'jest-puppeteer.js': './demo/jest-puppeteer.js',
    'comment.js': './demo/comment.js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.png', '.less'],
  },
  module: {
    rules: [
      {
        test: /\.less$/,
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
              postcssOptions: {
                plugins: [
                  ['autoprefixer', {grid: true, remove: false}],
                ],
              },
            },
          },
          {
            loader: 'less-loader', // compiles Less to CSS
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
      chunks: ['render.js'],
      filename: './render.html',
      template: './demo/render.html',
    }),
    new HtmlWebpackPlugin({
      chunks: ['jest-puppeteer.js'],
      filename: './jest-puppeteer.html',
      template: './demo/jest-puppeteer.html',
    }),
    new HtmlWebpackPlugin({
      chunks: ['comment.js'],
      filename: './comment.html',
      template: './demo/comment.html',
    }),
    new webpack.DefinePlugin({
      VDITOR_VERSION: JSON.stringify(pkg.version),
    }),
    new CopyPlugin({
      patterns: [
        {from: 'src/css', to: 'css'},
        {from: 'src/images', to: 'images'},
        {from: 'src/js', to: 'js'},
        {from: 'types', to: 'types'},
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, '.'),
    },
    port: 9000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        pathRewrite: {'^/api': ''},
      },
      '/ld246': {
        target: 'https://ld246.com',
        pathRewrite: {'^/ld246': ''},
      },
    },
  },
}
