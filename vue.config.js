module.exports = {
    runtimeCompiler: true,
    pwa: {
        name: process.env.VUE_APP_NAME,
    },
    devServer: {
        port: 8082,
        host: '0.0.0.0',
        disableHostCheck: true
    },
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = process.env.VUE_APP_NAME
                return args
            })
    }
}