import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import Flex from '@lyra/ui/components/Flex'
import Icon, { IconType } from '@lyra/ui/components/Icon'
import Image from '@lyra/ui/components/Image'
import NextLink from '@lyra/ui/components/Link/NextLink'
import List from '@lyra/ui/components/List'
import Modal from '@lyra/ui/components/Modal'
import Text from '@lyra/ui/components/Text'
import Token from '@lyra/ui/components/Token'
import { ModalContext } from '@lyra/ui/theme/ModalProvider'
import { useRouter } from 'next/router'
import React, { useCallback, useContext, useState } from 'react'

import { DEFAULT_MARKET } from '@/app/constants/defaults'
import { MOBILE_FOOTER_HEIGHT } from '@/app/constants/layout'
import { PageId } from '@/app/constants/pages'
import AccountButton from '@/app/containers/common/AccountButton'
import getAssetSrc from '@/app/utils/getAssetSrc'
import { getNavPageFromPath } from '@/app/utils/getNavPageFromPath'
import getPagePath from '@/app/utils/getPagePath'
import isOptimismMainnet from '@/app/utils/isOptimismMainnet'

import LayoutMoreDropdownListItems from './LayoutMoreDropdownListItems'
import LayoutPrivacyModal from './LayoutPrivacyModal'

const getRootPagePath = (path: string): string => {
  const parts = path
    .split('?')[0]
    .split('#')[0]
    .split('/')
    .filter(p => p !== '')
  if (parts.length === 0) {
    return '#'
  } else if (parts[0].startsWith('portfolio')) {
    return getPagePath({ page: PageId.Portfolio })
  } else if (parts[0].startsWith('position') || parts[0].startsWith('trade')) {
    return getPagePath({ page: PageId.Trade, marketAddressOrName: DEFAULT_MARKET })
  } else if (parts[0].startsWith('admin')) {
    return getPagePath({ page: PageId.Admin })
  } else if (parts[0].startsWith('rewards')) {
    return getPagePath({ page: PageId.Rewards })
  } else {
    return '#'
  }
}

export default function LayoutMobileBottomNav(): JSX.Element {
  const router = useRouter()
  const tabPage = getNavPageFromPath(router.asPath)
  const [isOpen, setIsOpen] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)
  const onClose = useCallback(() => setIsOpen(false), [])

  const { openModalId, setOpenModalId } = useContext(ModalContext)

  return (
    <>
      <Flex
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: MOBILE_FOOTER_HEIGHT,
          backdropFilter: 'blur(50px)',
          bg: `cardElevatedBg`,
          zIndex: 'bottomNav',
          borderTop: '1px solid',
          borderColor: 'background',
        }}
      >
        <Flex>
          <Flex
            onClick={() => {
              if (openModalId > 0) {
                // Handle global close (close top modal)
                setOpenModalId(Math.max(openModalId - 1, 0))
              } else {
                setIsOpen(!isOpen)
              }
            }}
            height="100%"
            width={MOBILE_FOOTER_HEIGHT}
            alignItems="center"
            justifyContent="center"
            sx={{
              cursor: 'pointer',
              ':hover': {
                bg: 'hover',
              },
            }}
          >
            <Icon
              size={openModalId > 0 ? 24 : 33}
              color="secondaryText"
              icon={openModalId > 0 ? IconType.X : IconType.Menu}
            />
          </Flex>
          {(!openModalId || isOpen) && !isMoreOpen ? (
            <NextLink href={getRootPagePath(router.asPath)}>
              <Flex
                height="100%"
                alignItems="center"
                justifyContent="center"
                sx={{
                  cursor: 'pointer',
                  borderLeft: '1px solid',
                  borderRight: '1px solid',
                  borderColor: 'background',
                  ':hover': {
                    bg: 'hover',
                  },
                }}
                onClick={() => {
                  setIsOpen(false)
                  router.push(getRootPagePath(router.asPath))
                }}
              >
                <Text
                  color="secondaryText"
                  variant="bodyMedium"
                  mx={6}
                  sx={{ visibility: isMoreOpen ? 'hidden' : null }}
                >
                  {tabPage}
                </Text>
              </Flex>
            </NextLink>
          ) : null}
        </Flex>
        <Flex flexGrow={1} p={4} alignItems="center" justifyContent="flex-end">
          <AccountButton />
        </Flex>
      </Flex>
      <Modal isMobileFullscreen isOpen={isOpen} onClose={onClose}>
        <Flex flexDirection="column" minHeight="100%">
          <Flex sx={{ position: 'sticky', top: 0, left: 0, right: 0, bg: 'cardBackrgoundSolid' }} p={6}>
            <Image
              href={getPagePath({ page: PageId.Portfolio })}
              src={getAssetSrc('/images/logo.png')}
              height={24}
              width={24}
            />
            {!isOptimismMainnet() ? <Token ml="auto" variant="warning" label="Testnet" /> : null}
          </Flex>
          <List mt="auto">
            <DropdownButtonListItem
              onClick={() => {
                router.push(getPagePath({ page: PageId.Portfolio }))
                onClose()
              }}
              label="Portfolio"
            />
            <DropdownButtonListItem
              onClick={() => {
                router.push(getPagePath({ page: PageId.Trade, marketAddressOrName: DEFAULT_MARKET }))
                onClose()
              }}
              label="Trade"
            />
            <DropdownButtonListItem
              onClick={() => {
                router.push(getPagePath({ page: PageId.Competition }))
                onClose()
              }}
              label="Competition"
            />
            <DropdownButtonListItem
              onClick={() => {
                router.push(getPagePath({ page: PageId.VaultsIndex }))
                onClose()
              }}
              label="Vaults"
            />
            <DropdownButtonListItem
              onClick={() => {
                router.push(getPagePath({ page: PageId.Rewards }))
                onClose()
              }}
              label="Rewards"
            />
            <DropdownButtonListItem
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              label="More"
              rightContent={<Icon icon={IconType.ChevronRight}></Icon>}
            />
          </List>
        </Flex>
      </Modal>
      <Modal isMobileFullscreen isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)}>
        <Flex flexDirection="column" height="100%">
          <List mt="auto">
            <LayoutMoreDropdownListItems
              onClose={() => setIsMoreOpen(false)}
              onClickPrivacy={() => setIsPrivacyOpen(true)}
            />
          </List>
        </Flex>
      </Modal>
      <LayoutPrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </>
  )
}
