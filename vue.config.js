module.exports = {
  devServer: {
    port: 80
  },
  configureWebpack: {
    resolve: {
      alias: {
        // 设置目录映射别名
        'asset': '@/assets',
        'components': '@/components',
        'network': '@/network',
        'utils': '@/utils',
        'views': '@/views'
      }
    }
  },
  publicPath: './'
}