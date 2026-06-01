module.exports = {
  preset: '@dcloudio/uni-preset-vue',
  transpileDependencies: ['@dcloudio/uni-ui'],
  productionSourceMap: false,
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  },
  chainWebpack(config) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use('vue-loader')
      .loader('vue-loader-v15')
      .end()
  }
}
