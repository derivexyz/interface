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
  DESKTOP_LAYOUT_WIDTH,
  DESKTOP_RIGHT_COLUMN_WIDTH,
} from '@/app/constants/layout'

type Props = {
  children?: React.ReactNode
  rightColumn?: React.ReactNode
  footer?: React.ReactNode
  header?: React.ReactNode
  showBackButton?: boolean
  backHref?: string
}

export default function PageDesktop({
  children,
  rightColumn,
  footer,
  header,
  showBackButton,
  backHref,
}: Props): JSX.Element {
  const navigate = useNavigate()

  return (
    <Flex pt={DESKTOP_HEADER_NAV_HEIGHT} minHeight="100%" width="100%" justifyContent="center">
      <Flex
        pt={3}
        px={6}
        minHeight="100%"
        width="100%"
        maxWidth={rightColumn ? DESKTOP_LAYOUT_LARGE_WIDTH : DESKTOP_LAYOUT_WIDTH}
        flexDirection="column"
      >
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
        <Flex flexGrow={1} width="100%">
          <Flex flexGrow={1} pr={rightColumn ? 6 : 0} flexDirection="column">
            {children}
            {footer ? (
              <Box
                sx={{
                  position: 'sticky',
                  bottom: 0,
                }}
              >
                {footer}
              </Box>
            ) : null}
          </Flex>
          {rightColumn ? (
            <Box width={DESKTOP_RIGHT_COLUMN_WIDTH} minWidth={DESKTOP_RIGHT_COLUMN_WIDTH} pb={12}>
              {rightColumn}
            </Box>
          ) : null}
        </Flex>
      </Flex>
    </Flex>
  )
}
