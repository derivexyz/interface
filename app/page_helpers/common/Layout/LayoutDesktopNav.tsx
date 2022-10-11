import DropdownIconButton from '@lyra/ui/components/Button/DropdownIconButton'
import IconButton from '@lyra/ui/components/Button/IconButton'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Image from '@lyra/ui/components/Image'
import Link from '@lyra/ui/components/Link'
import Text from '@lyra/ui/components/Text'
import Token from '@lyra/ui/components/Token'
import useIsDarkMode from '@lyra/ui/hooks/useIsDarkMode'
import React, { useCallback, useState } from 'react'

import { DEFAULT_MARKET } from '@/app/constants/defaults'
import {
  DESKTOP_HEADER_NAV_HEIGHT,
  DESKTOP_LAYOUT_LARGE_WIDTH,
  DESTKOP_HEADER_NOTICE_HEIGHT,
} from '@/app/constants/layout'
import { LogEvent } from '@/app/constants/logEvents'
import { PageId } from '@/app/constants/pages'
import AccountButton from '@/app/containers/common/AccountButton'
import getAssetSrc from '@/app/utils/getAssetSrc'
import { getNavPageFromPath } from '@/app/utils/getNavPageFromPath'
import getPagePath from '@/app/utils/getPagePath'
import isOptimismMainnet from '@/app/utils/isOptimismMainnet'
import logEvent from '@/app/utils/logEvent'

import LayoutMoreDropdownListItems from './LayoutMoreDropdownListItems'
import LayoutPrivacyModal from './LayoutPrivacyModal'

const SIDE_WIDTH = 300

type Props = {
  notice?: string | null
  onCloseNotice?: () => void | null
  currentPath: string
}

export default function LayoutDesktopNav({ notice, onCloseNotice, currentPath }: Props): JSX.Element {
  const [isDarkMode] = useIsDarkMode()
  const page = getNavPageFromPath(currentPath)

  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)
  const onMoreClose = useCallback(() => setIsMoreOpen(false), [])

  return (
    <Flex
      flexDirection="column"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: notice ? DESKTOP_HEADER_NAV_HEIGHT + DESTKOP_HEADER_NOTICE_HEIGHT : DESKTOP_HEADER_NAV_HEIGHT,
        zIndex: 'topNavBar',
      }}
    >
      {notice ? (
        <Flex height={DESTKOP_HEADER_NOTICE_HEIGHT} bg="warningButtonBg" justifyContent="center">
          <Flex justifyContent="center" alignItems="center" width="100%" px={12} maxWidth={DESKTOP_LAYOUT_LARGE_WIDTH}>
            <Text ml={24} textAlign="center" color="white" width="100%">
              {notice}
            </Text>
            <IconButton ml="auto" variant="warning" icon={IconType.X} size="sm" onClick={onCloseNotice} />
          </Flex>
        </Flex>
      ) : null}
      <Flex
        height={DESKTOP_HEADER_NAV_HEIGHT}
        sx={{
          backdropFilter: 'blur(50px)',
        }}
        justifyContent="center"
      >
        <Flex width="100%" px={12} maxWidth={DESKTOP_LAYOUT_LARGE_WIDTH}>
          <Flex alignItems="center" width={SIDE_WIDTH}>
            <Image
              href={getPagePath({ page: PageId.Portfolio })}
              src={getAssetSrc('/images/logo.png')}
              height={24}
              width={24}
            />
          </Flex>
          <Flex flexGrow={1} alignItems={'center'} justifyContent={'center'}>
            <Link
              mx={4}
              href={getPagePath({ page: PageId.Portfolio })}
              textVariant="bodyMedium"
              variant="secondary"
              color={page !== PageId.Portfolio ? 'secondaryText' : 'text'}
              onClick={() => logEvent(LogEvent.NavPortfolioTabClick)}
            >
              Portfolio
            </Link>
            <Link
              mx={4}
              href={getPagePath({ page: PageId.Trade, marketAddressOrName: DEFAULT_MARKET })}
              onClick={() => logEvent(LogEvent.NavTradeTabClick)}
              textVariant="bodyMedium"
              variant="secondary"
              color={page !== PageId.Trade ? 'secondaryText' : 'text'}
            >
              Trade
            </Link>
            <Link
              mx={4}
              href={getPagePath({ page: PageId.Competition })}
              onClick={() => logEvent(LogEvent.NavTradeTabClick)}
              textVariant="bodyMedium"
              variant="secondary"
              color={page !== PageId.Competition ? 'secondaryText' : 'text'}
            >
              Competition
            </Link>
            <Link
              textVariant="bodyMedium"
              variant="secondary"
              mx={4}
              href={getPagePath({ page: PageId.VaultsIndex })}
              onClick={() => logEvent(LogEvent.NavVaultsTabClick)}
              color={page !== PageId.Vaults ? 'secondaryText' : 'text'}
            >
              Vaults
            </Link>
            <Link
              textVariant="bodyMedium"
              variant="secondary"
              mx={4}
              href={getPagePath({ page: PageId.Rewards })}
              onClick={() => logEvent(LogEvent.NavStakeTabClick)}
              color={page !== PageId.Rewards ? 'secondaryText' : 'text'}
            >
              Rewards
            </Link>
          </Flex>
          <Flex width={SIDE_WIDTH} justifyContent={'flex-end'} alignItems={'center'}>
            {!isOptimismMainnet() ? <Token mr={2} variant="warning" label="Testnet" /> : null}
            <AccountButton mr={2} />
            <DropdownIconButton
              isOpen={isMoreOpen}
              onClose={onMoreClose}
              onClick={() => setIsMoreOpen(true)}
              icon={IconType.MoreHorizontal}
              variant={isDarkMode ? 'static' : 'white'}
            >
              <LayoutMoreDropdownListItems onClose={onMoreClose} onClickPrivacy={() => setIsPrivacyOpen(true)} />
            </DropdownIconButton>
            <LayoutPrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
