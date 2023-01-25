import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import {
  DESKTOP_HEADER_NAV_HEIGHT,
  DESKTOP_LAYOUT_LARGE_WIDTH,
  DESKTOP_LAYOUT_RIGHT_COLUMN_MIN_WIDTH,
  DESKTOP_LAYOUT_WIDTH,
} from '@/app/constants/layout'

type Props = {
  children?: React.ReactNode
  rightColumn?: React.ReactNode
  header?: React.ReactNode
  showBackButton?: boolean
  backHref?: string
}

export default function PageDesktop({ children, rightColumn, header, showBackButton, backHref }: Props): JSX.Element {
  const navigate = useNavigate()

  const headerComponent = (
    <Box px={6} pb={4}>
      {showBackButton ? (
        <Flex>
          <Button
            mb={4}
            label="Back"
            variant="light"
            leftIcon={IconType.ArrowLeft}
            onClick={!backHref ? () => navigate(-1) : undefined}
            href={backHref}
          />
        </Flex>
      ) : null}
      {typeof header === 'string' ? (
        <Text variant="title" mb={2}>
          {header}
        </Text>
      ) : (
        header
      )}
    </Box>
  )

  return (
    <Flex pt={DESKTOP_HEADER_NAV_HEIGHT} minHeight="100%" width="100%" justifyContent="center">
      <Flex
        pt={6}
        px={6}
        minHeight="100%"
        width="100%"
        maxWidth={rightColumn ? DESKTOP_LAYOUT_LARGE_WIDTH : DESKTOP_LAYOUT_WIDTH}
        flexDirection="column"
      >
        {headerComponent}
        <Flex flexGrow={1} width="100%">
          <Flex flexGrow={1} pr={rightColumn ? 6 : 0} flexDirection="column">
            {children}
          </Flex>
          {rightColumn ? (
            <Box minWidth={DESKTOP_LAYOUT_RIGHT_COLUMN_MIN_WIDTH}>
              <Box
                minWidth={DESKTOP_LAYOUT_RIGHT_COLUMN_MIN_WIDTH}
                sx={{ position: 'sticky', top: DESKTOP_HEADER_NAV_HEIGHT + 8 }}
                pb={12}
              >
                {rightColumn}
              </Box>
            </Box>
          ) : null}
        </Flex>
      </Flex>
    </Flex>
  )
}
