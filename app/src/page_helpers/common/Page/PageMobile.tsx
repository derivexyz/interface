import Box from '@lyra/ui/components/Box'
import IconButton from '@lyra/ui/components/Button/IconButton'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Image from '@lyra/ui/components/Image'
import Text from '@lyra/ui/components/Text'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { HEADER_CARD_HEIGHT, MOBILE_FOOTER_HEIGHT } from '@/app/constants/layout'
import { PageId } from '@/app/constants/pages'
import getAssetSrc from '@/app/utils/getAssetSrc'
import getPagePath from '@/app/utils/getPagePath'

import { PageProps } from '.'

export default function PageMobile({
  children,
  title,
  subtitle,
  headerCard,
  showBackButton,
  backHref,
}: PageProps): JSX.Element {
  const navigate = useNavigate()

  return (
    <Box px={3} pt={3} flexGrow={1} pb={MOBILE_FOOTER_HEIGHT + 9 * 4}>
      <Image
        mb={!title && !showBackButton ? 0 : !title && showBackButton ? 8 : 12}
        href={getPagePath({ page: PageId.TradeIndex })}
        src={getAssetSrc('/images/logo.png')}
        height={36}
        width={36}
      />
      {title ? (
        <>
          <Box mb={8}>
            <Text variant="title" mb={subtitle ? 2 : 0}>
              {title}
            </Text>
            {subtitle ? (
              <Text variant="subtitle" color="secondaryText">
                {subtitle}
              </Text>
            ) : null}
          </Box>
          {headerCard ? (
            <Box mb={8} height={HEADER_CARD_HEIGHT} width="100%">
              {headerCard}
            </Box>
          ) : null}
        </>
      ) : null}
      {showBackButton ? (
        <Flex>
          <IconButton
            variant="light"
            icon={IconType.ArrowLeft}
            onClick={!backHref ? () => navigate(-1) : undefined}
            href={backHref}
          />
        </Flex>
      ) : null}
      {children}
    </Box>
  )
}
