import Box from '@lyra/ui/components/Box'
import IconButton from '@lyra/ui/components/Button/IconButton'
import Card from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Spinner from '@lyra/ui/components/Spinner'
import Text, { TextElement } from '@lyra/ui/components/Text'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'

import { MOBILE_FOOTER_HEIGHT, MOBILE_HEADER_HEIGHT } from '@/app/constants/layout'

import LayoutMobileBottomNav from './LayoutMobileBottomNav'

const COLLAPSED_HEADER_BREAKPOINT = 80

type Props = {
  children?: React.ReactNode
  collapsedHeader?: string | TextElement | (TextElement | null)[] | null
  header?: React.ReactNode
  showBackButton?: boolean
  backHref?: string
  isLoading?: boolean
}

export default function LayoutMobile({
  children,
  header,
  backHref,
  collapsedHeader,
  showBackButton,
  isLoading,
}: Props): JSX.Element {
  const [showCollapsedHeader, setShowCollapsedHeader] = useState(false)

  const onScroll = useCallback(() => {
    setShowCollapsedHeader(window.scrollY >= COLLAPSED_HEADER_BREAKPOINT)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  const { back } = useRouter()

  const pageContent = (
    <Box pb={MOBILE_FOOTER_HEIGHT}>
      {showBackButton || !!header ? (
        <Card>
          <CardSection px={6} pt={12} noPadding>
            {showBackButton ? (
              <Flex mb={4}>
                <IconButton
                  variant="light"
                  icon={IconType.ArrowLeft}
                  onClick={!backHref ? () => back() : undefined}
                  href={backHref}
                />
              </Flex>
            ) : null}
            {typeof header === 'string' ? <Text variant="title">{header}</Text> : header}
          </CardSection>
        </Card>
      ) : null}
      {children}
    </Box>
  )

  return (
    <>
      {showCollapsedHeader && collapsedHeader ? (
        <Flex
          alignItems="center"
          height={MOBILE_HEADER_HEIGHT}
          width="100%"
          sx={{
            position: 'fixed',
            top: '0',
            left: '0',
            transition: 'opacity 100ms ease-out',
            zIndex: 'topNavBar',
            backdropFilter: 'blur(50px)',
            bg: 'cardBg',
          }}
          px={6}
        >
          <Text variant="secondaryMedium">{collapsedHeader}</Text>
        </Flex>
      ) : null}
      {isLoading ? (
        <Center height="100%" width="100%">
          <Spinner />
        </Center>
      ) : (
        pageContent
      )}
      <LayoutMobileBottomNav />
    </>
  )
}
