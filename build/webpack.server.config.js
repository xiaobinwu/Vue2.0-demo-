const webpack = require('webpack')
const base = require('./webpack.base.config')
//bundleRenderer预捆绑
//避免一个请求引起的状态突变将影响下一个请求的结果
//相反，为每个请求运行我们的应用程序“更新”更直接，所以我们不必考虑避免跨请求的状态污染。 
//这正是bundleRenderer帮助我们实现的。
//相应配置项
module.exports = Object.assign({}, base, {
  target: 'node',
  devtool: false,
  entry: './src/server-entry.js',
  output: Object.assign({}, base.output, {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  }),
  resolve: {
    alias: {
      'create-api': './create-api-server.js'
    }
  },
  externals: Object.keys(require('../package.json').dependencies),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"'
    })
  ]
})
