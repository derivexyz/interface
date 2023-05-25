import Box from '@lyra/ui/components/Box'
import IconButton from '@lyra/ui/components/Button/IconButton'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { DESKTOP_HEADER_NAV_HEIGHT, HEADER_CARD_HEIGHT, PAGE_FULL_WIDTH, PAGE_WIDTH } from '@/app/constants/layout'

import { PageProps } from '.'

export default function PageDesktop({
  children,
  title,
  subtitle,
  isFullWidth,
  headerCard,
  showBackButton,
  backHref,
}: PageProps): JSX.Element {
  const navigate = useNavigate()

  return (
    <Flex pt={DESKTOP_HEADER_NAV_HEIGHT} minHeight="100%" width="100%" justifyContent="center">
      <Flex
        px={6}
        minHeight="100%"
        width={isFullWidth ? PAGE_FULL_WIDTH : PAGE_WIDTH}
        maxWidth="100vw"
        flexDirection="column"
      >
        {title || headerCard ? (
          <Box mt={2}>
            <Flex height={HEADER_CARD_HEIGHT} alignItems="center">
              <Box>
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
                <Box ml="auto" height="100%" width={412}>
                  {headerCard}
                </Box>
              ) : null}
            </Flex>
          </Box>
        ) : null}
        {showBackButton ? (
          <Flex mt={!(title || headerCard) ? 6 : 0}>
            <IconButton
              variant="light"
              icon={IconType.ArrowLeft}
              onClick={!backHref ? () => navigate(-1) : undefined}
              href={backHref}
            />
          </Flex>
        ) : null}
        {children}
      </Flex>
    </Flex>
  )
}
