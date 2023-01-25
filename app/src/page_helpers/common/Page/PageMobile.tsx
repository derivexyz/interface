import Box from '@lyra/ui/components/Box'
import IconButton from '@lyra/ui/components/Button/IconButton'
import Card from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Text, { TextElement } from '@lyra/ui/components/Text'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { MOBILE_FOOTER_HEIGHT, MOBILE_HEADER_HEIGHT } from '@/app/constants/layout'

const COLLAPSED_HEADER_BREAKPOINT = 80

type Props = {
  children?: React.ReactNode
  collapsedHeader?: string | TextElement | (TextElement | null)[] | null
  header?: React.ReactNode
  showBackButton?: boolean
  backHref?: string
}

export default function PageMobile({
  children,
  header,
  backHref,
  collapsedHeader,
  showBackButton,
}: Props): JSX.Element {
  const [showCollapsedHeader, setShowCollapsedHeader] = useState(false)

  const onScroll = useCallback(() => {
    setShowCollapsedHeader(window.scrollY >= COLLAPSED_HEADER_BREAKPOINT)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  const navigate = useNavigate()

  const pageContent = (
    <Box flexGrow={1} pb={MOBILE_FOOTER_HEIGHT}>
      {showBackButton || !!header ? (
        <Card>
          <CardSection px={6} pt={12} noPadding>
            {showBackButton ? (
              <Flex mb={4}>
                <IconButton
                  variant="light"
                  icon={IconType.ArrowLeft}
                  onClick={!backHref ? () => navigate(-1) : undefined}
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
      {pageContent}
    </>
  )
}
