import { NextSeo } from 'next-seo'
import React from 'react'

import getHostname from '@/app/utils/getHostname'

import {
  DEFAULT_META_DESCRIPTION,
  DEFAULT_META_IMAGE,
  DEFAULT_META_IMAGE_HEIGHT,
  DEFAULT_META_IMAGE_WIDTH,
  DEFAULT_TITLE,
} from '../../../constants/meta'
import getAssetSrc from '../../../utils/getAssetSrc'

type Props = {
  title?: string
  url?: string
  description?: string
  image?: string
  imageHeight?: number
  imageWidth?: number
}

export default function MetaTags({
  title = DEFAULT_TITLE,
  url = getHostname(),
  description = DEFAULT_META_DESCRIPTION,
  image = DEFAULT_META_IMAGE,
  imageHeight = DEFAULT_META_IMAGE_HEIGHT,
  imageWidth = DEFAULT_META_IMAGE_WIDTH,
}: Props): JSX.Element {
  const titleWithSuffix = `${title} | Lyra`
  return (
    <NextSeo
      title={titleWithSuffix}
      description={description}
      canonical={url}
      openGraph={{
        url,
        title: titleWithSuffix,
        description: description,
        site_name: 'Lyra',
        images: [
          {
            url: getAssetSrc(image, true),
            alt: 'Lyra',
            height: imageHeight,
            width: imageWidth,
          },
        ],
      }}
      twitter={{
        handle: '@lyrafinance',
        site: '@lyrafinance',
        cardType: 'summary_large_image',
      }}
    />
  )
}
