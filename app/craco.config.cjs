const path = require('path')
const { getLoader, loaderByName } = require('@craco/craco')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// packages: sdk, ui
const packages = [path.join(__dirname, '../sdk'), path.join(__dirname, '../ui')]

module.exports = {
  webpack: {
    configure: webpackConfig => {
      const { isFound, match } = getLoader(webpackConfig, loaderByName('babel-loader'))
      if (isFound) {
        const include = Array.isArray(match.loader.include) ? match.loader.include : [match.loader.include]
        match.loader.include = include.concat(packages)
      }

      webpackConfig.resolve.alias = {
        '@/app': path.resolve(__dirname, './src'),
      }

      if (process.env.NODE_ENV === 'production') {
        webpackConfig.plugins.push(
          new BundleAnalyzerPlugin({ analyzerMode: process.env.REACT_APP_INTERACTIVE_ANALYZE ? 'server' : 'json' })
        )
      }

      return webpackConfig
    },
  },
}
