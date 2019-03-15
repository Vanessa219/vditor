/**
 * @fileoverview demo.
 *
 * @author <a href="http://vanessa.b3log.org">Liyuan Li</a>
 * @version 0.1.0.0, Jan 24, 2019
 */

const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackOnBuildPlugin = require('on-build-webpack')

const pkg = require('./package.json')

module.exports = {
  mode: 'development',
  watch: true,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'demo/dist'),
    publicPath: 'dist/',
  },
  entry: {
    'demo': './demo/demo.js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.svg', '.png'],
  },
  module: {
    rules: [
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
    new CleanWebpackPlugin(['./demo/dist']),
    new MiniCssExtractPlugin({
      filename: '[name]',
    }),
    new webpack.DefinePlugin({
      VDITOR_VERSION: JSON.stringify(pkg.version),
    }),
    new WebpackOnBuildPlugin(() => {
      fs.unlinkSync('./demo/dist/demo.css.js')
    }),
  ],
}