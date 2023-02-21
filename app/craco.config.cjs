const path = require('path')
const webpack = require('webpack')
const { getLoader, loaderByName } = require('@craco/craco')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const SentryWebpackPlugin = require('@sentry/webpack-plugin')

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
      if (process.env.NODE_ENV !== 'production') {
        webpackConfig.devtool = 'eval-cheap-module-source-map'
        webpackConfig.ignoreWarnings = [
          {
            message: /Failed to parse source map/,
          },
        ]
      }
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        })
      )
      if (process.env.NODE_ENV === 'production') {
        webpackConfig.devtool = 'source-map'
        webpackConfig.plugins.push(
          new SentryWebpackPlugin({
            authToken: process.env.REACT_APP_SENTRY_AUTH_TOKEN,
            org: process.env.REACT_APP_SENTRY_ORG,
            project: process.env.REACT_APP_SENTRY_PROJECT,
            include: './build',
            ignore: ['node_modules'],
          })
        )
      }
      webpackConfig.resolve.fallback = {
        buffer: require.resolve('buffer'),
      }

      return webpackConfig
    },
  },
}
