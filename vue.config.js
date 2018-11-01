const path = require('path')

function resolve (dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  // Fix the dev server settings for use on c9.io
  devServer: {
    hot: true,
    public: 'javascript-space-mrmint.c9users.io:8080'
  },

  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue', '.json', 'scss'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': resolve('src'),
        style: resolve('src/style')
      }
    }
  }
}
