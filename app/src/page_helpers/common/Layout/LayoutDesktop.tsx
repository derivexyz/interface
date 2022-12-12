import Background from '@lyra/ui/components/Background'
import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import useIsDarkMode from '@lyra/ui/hooks/useIsDarkMode'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import {
  DESKTOP_HEADER_NAV_HEIGHT,
  DESKTOP_LAYOUT_LARGE_WIDTH,
  DESKTOP_LAYOUT_WIDTH,
  DESKTOP_RIGHT_COLUMN_WIDTH,
  DESTKOP_HEADER_NOTICE_HEIGHT,
} from '@/app/constants/layout'
import useBoolLocalStorage from '@/app/hooks/local_storage/useBoolLocalStorage'

import LayoutDesktopNav from './LayoutDesktopNav'

type Props = {
  children?: React.ReactNode
  rightColumn?: React.ReactNode
  footer?: React.ReactNode
  header?: React.ReactNode
  currentPath: string
  showBackButton?: boolean
  backHref?: string
  isLoading?: boolean
}

const NOTICE_KEY = '__TRADING_PAUSE_MERGE__'
const NOTICE = null

export default function LayoutDesktop({
  children,
  rightColumn,
  footer,
  header,
  showBackButton,
  backHref,
  currentPath,
  isLoading,
}: Props): JSX.Element {
  const [isDarkMode] = useIsDarkMode()

  const navigate = useNavigate()

  const [isNoticeDismissed, setIsNoticeDismissed] = useBoolLocalStorage(NOTICE_KEY)
  const notice = !isNoticeDismissed ? NOTICE : null
  const pt = notice ? DESKTOP_HEADER_NAV_HEIGHT + DESTKOP_HEADER_NOTICE_HEIGHT : DESKTOP_HEADER_NAV_HEIGHT

  const pageContent = (
    <Flex pt={pt} minHeight="100%" width="100%" justifyContent="center">
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
          {typeof header === 'string' ? <Text variant="title">{header}</Text> : header}
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

  return (
    <>
      <LayoutDesktopNav notice={notice} onCloseNotice={() => setIsNoticeDismissed(true)} currentPath={currentPath} />
      <Background
        bg={isDarkMode ? 'background' : 'bgGradient'}
        mx="auto"
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          pointerEvents: 'none',
          zIndex: -1,
          transform: 'translate(-50%, -50%)',
        }}
      />
      {isLoading ? (
        <Center height="100%" width="100%">
          <Spinner />
        </Center>
      ) : (
        pageContent
      )}
    </>
  )
}
