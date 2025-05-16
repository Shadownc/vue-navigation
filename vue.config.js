module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'https://navapi.lmyself.top',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        },
        secure: false
      }
    }
  }
} 