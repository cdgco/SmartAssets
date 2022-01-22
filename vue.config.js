module.exports = {
	runtimeCompiler: true,
 pwa: {
    name: 'SmartAssets', // <---- this is PWA name
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
				args[0].title = 'SmartAssets'
				return args
			})
	}
}
