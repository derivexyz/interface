import Document, { Head, Html, Main, NextScript } from 'next/document'
import Script from 'next/script'
import React from 'react'

import getAssetSrc from '../utils/getAssetSrc'

/**
 * Rendered Server Side
 */
export default class MyDocument extends Document {
  render = (): JSX.Element => {
    return (
      <Html lang="en">
        <Head>
          <Script src="https://cdn.polyfill.io/v2/polyfill.min.js"></Script>
          <link rel="apple-touch-icon" sizes="180x180" href={getAssetSrc('/favicon/apple-touch-icon.png')} />
          <link rel="icon" type="image/png" sizes="32x32" href={getAssetSrc('/favicon/favicon-32x32.png')} />
          <link rel="icon" type="image/png" sizes="16x16" href={getAssetSrc('/favicon/favicon-16x16.png')} />
          <link rel="manifest" href={getAssetSrc('/manifest.json')} />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#000000"></meta>
          {/* TODO: Move fonts to @lyra/ui export */}
          <link href={getAssetSrc('/fonts/style.css')} rel="stylesheet" />
          <link rel="preconnect" href="https://rsms.me/" />
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        </Head>
        <body className="ph-no-capture">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
