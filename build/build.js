const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const path = require('path')
const fs = require('fs-extra')

// 清空输出目录
fs.emptyDirSync(path.resolve(__dirname, '../dist'))

// 编译 js
const rollup = require('rollup')
const buble = require('rollup-plugin-buble')
const uglifyJS = require('uglify-js')
const pkg = require('../package.json')

const banner = [
  '/*!',
  ' * wingx.js v' + pkg.version,
  ' * https://github.com/wangshengfei/wingxjs',
  ' * Released under the MIT License.',
  ' */'
].join('\n')

rollup
  .rollup({
    input: path.resolve(__dirname, '../libs/index.js'),
    plugins: [
      resolve(),
      commonjs({
        include: 'node_modules/**', // 包括
        exclude: [],  // 排除
      }),
      buble()]
  })
  .then(bundle => {
    // 输出 umd 格式
    bundle
      .generate({
        format: 'umd',
        name: 'wingx',
        banner
      })
      .then(({ code }) => {
        fs.writeFile(path.resolve(__dirname, '../dist/wingx.js'), code)
        fs.writeFile(
          path.resolve(__dirname, '../dist/wingx.min.js'),
          uglifyJS.minify(code, { output: { comments: /^!/ } }).code
        )
      })

    // 输出 es 格式
    bundle.write({
      file: path.resolve(__dirname, '../dist/wingx.esm.js'),
      format: 'es',
      banner
    })

    // 输出 cjs 格式
    bundle.write({
      file: path.resolve(__dirname, '../dist/wingx.common.js'),
      format: 'cjs',
      banner
    })
  })