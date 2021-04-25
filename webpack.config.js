/**
 * @fileoverview webpack.
 *
 * @author <a href="http://vanessa.b3log.org">Liyuan Li</a>
 * @version 0.2.0.1, Jan 4, 2020
 */

const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const WebpackOnBuildPlugin = require('on-build-webpack')
const CopyPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require(
  'webpack-bundle-analyzer').BundleAnalyzerPlugin
const pkg = require('./package.json')
const banner = new webpack.BannerPlugin({
  banner: `Vditor v${pkg.version} - A markdown editor written in TypeScript.
  
MIT License

Copyright (c) 2018-present B3log 开源, b3log.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`,
  entryOnly: true,
})

const rimraf = require('rimraf')

rimraf.sync('./dist', {}, () => {
  console.log('rm dist')
})

module.exports = [
  {
    mode: 'production',
    entry: {
      'index': './src/assets/scss/index.scss',
    },
    resolve: {
      extensions: ['.scss'],
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          include: [path.resolve(__dirname, 'src/assets')],
          use: [
            MiniCssExtractPlugin.loader,
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
      ],
    },
    optimization: {
      minimizer: [
        new OptimizeCSSAssetsPlugin({}),
      ],
    },
    plugins: [
      banner,
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      new WebpackOnBuildPlugin(() => {
        fs.unlinkSync('./dist/index.js')
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
  }, {
    mode: 'production',
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      // chunkFilename: '[name].bundle.js',
      // publicPath: `${pkg.cdn}/vditor@${pkg.version}/dist/`,
      libraryTarget: 'umd',
      library: 'Vditor',
      libraryExport: 'default',
	  globalObject: 'this',
    },
    entry: {
      'index.min': './src/index.ts',
      'method.min': './src/method.ts',
    },
    resolve: {
      extensions: ['.js', '.ts', 'png'],
    },
    module: {
      rules: [
        {
          test: /\.png$/,
          include: [path.resolve(__dirname, './src/assets/images')],
          use: [
            'file-loader',
          ],
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
          test: /\.ts$/,
          use: 'ts-loader',
        },
      ],
    },
    plugins: [
      // new BundleAnalyzerPlugin(),
      new webpack.DefinePlugin({
        VDITOR_VERSION: JSON.stringify(pkg.version),
      }),
      banner,
    ],
    // optimization: {
    //   namedModules: true,
    //   namedChunks: true,
    //   splitChunks: {
    //     cacheGroups: {
    //       default: false,
    //       vendors: {
    //         test: /null/,
    //       },
    //     },
    //   },
    // },
  }]
