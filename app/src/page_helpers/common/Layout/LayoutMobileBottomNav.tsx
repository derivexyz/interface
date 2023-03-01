import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import Flex from '@lyra/ui/components/Flex'
import Icon, { IconType } from '@lyra/ui/components/Icon'
import Image from '@lyra/ui/components/Image'
import List from '@lyra/ui/components/List'
import Modal from '@lyra/ui/components/Modal'
import Token from '@lyra/ui/components/Token'
import { ModalContext } from '@lyra/ui/theme/ModalProvider'
import React, { useCallback, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { MOBILE_FOOTER_HEIGHT } from '@/app/constants/layout'
import { PageId } from '@/app/constants/pages'
import AccountButton from '@/app/containers/common/AccountButton'
import useNetwork from '@/app/hooks/account/useNetwork'
import getAssetSrc from '@/app/utils/getAssetSrc'
import { getDefaultMarket } from '@/app/utils/getDefaultMarket'
import getPagePath from '@/app/utils/getPagePath'
import isMainnet from '@/app/utils/isMainnet'

import LayoutMoreDropdownListItems from './LayoutMoreDropdownListItems'
import LayoutPrivacyModal from './LayoutPrivacyModal'

export default function LayoutMobileBottomNav(): JSX.Element {
  const navigate = useNavigate()
  const network = useNetwork()
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
            {!isMainnet() ? <Token ml="auto" variant="warning" label="Testnet" /> : null}
          </Flex>
          <List mt="auto">
            <DropdownButtonListItem
              onClick={() => {
                navigate(getPagePath({ page: PageId.Portfolio }))
                onClose()
              }}
              label="Portfolio"
            />
            <DropdownButtonListItem
              onClick={() => {
                navigate(getPagePath({ page: PageId.Trade, network, marketAddressOrName: getDefaultMarket(network) }))
                onClose()
              }}
              label="Trade"
            />
            <DropdownButtonListItem
              onClick={() => {
                navigate(getPagePath({ page: PageId.VaultsIndex }))
                onClose()
              }}
              label="Vaults"
            />
            <DropdownButtonListItem
              onClick={() => {
                navigate(getPagePath({ page: PageId.RewardsIndex }))
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
