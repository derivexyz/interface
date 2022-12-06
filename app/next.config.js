const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const withTM = require('next-transpile-modules')(['@lyrafinance/lyra-js', '@lyra/ui'])
module.exports = withBundleAnalyzer(
  withTM({
    trailingSlash: true,
    experimental: {
      esmExternals: false,
    },
    rewrites: async () => {
      if (process.env.GLOBAL_REWRITE) {
        console.log('Enabling global rewrite to', process.env.GLOBAL_REWRITE)
        return [
          {
            source: '/:path*',
            destination: `${process.env.GLOBAL_REWRITE}/:path*`,
          },
        ]
      }
      return []
    },
  })
)
