import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import Flex from '@lyra/ui/components/Flex'
import Icon, { IconType } from '@lyra/ui/components/Icon'
import Image from '@lyra/ui/components/Image'
import List from '@lyra/ui/components/List'
import Modal from '@lyra/ui/components/Modal'
import Token from '@lyra/ui/components/Token'
import { ModalContext } from '@lyra/ui/theme/ModalProvider'
import { Network } from '@lyrafinance/lyra-js'
import React, { useCallback, useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { getDefaultMarket } from '@/app/constants/defaults'
import { MOBILE_FOOTER_HEIGHT } from '@/app/constants/layout'
import { PageId } from '@/app/constants/pages'
import AccountButton from '@/app/containers/common/AccountButton'
import useNetwork from '@/app/hooks/wallet/useNetwork'
import useWallet from '@/app/hooks/wallet/useWallet'
import getAssetSrc from '@/app/utils/getAssetSrc'
import { getChainIdForNetwork } from '@/app/utils/getChainIdForNetwork'
import { getNavPageFromPath } from '@/app/utils/getNavPageFromPath'
import getPagePath from '@/app/utils/getPagePath'
import isMainnet from '@/app/utils/isMainnet'

import LayoutMoreDropdownListItems from './LayoutMoreDropdownListItems'
import LayoutPrivacyModal from './LayoutPrivacyModal'

export default function LayoutMobileBottomNav(): JSX.Element {
  const location = useLocation()
  const navigate = useNavigate()
  const tabPage = getNavPageFromPath(location.pathname)
  const network = useNetwork()
  const { chainId, switchNetwork } = useWallet()
  const [isOpen, setIsOpen] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)
  const onClose = useCallback(() => setIsOpen(false), [])

  const { openModalId, setOpenModalId } = useContext(ModalContext)

  const handleSelectNetwork = async (newNetwork: Network) => {
    const newChainId = getChainIdForNetwork(newNetwork)
    if (newChainId !== chainId) {
      await switchNetwork(newChainId)
      if (tabPage === PageId.Trade) {
        navigate(
          getPagePath({ page: PageId.Trade, network: newNetwork, marketAddressOrName: getDefaultMarket(newNetwork) })
        )
      }
    }
  }

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
                navigate(
                  getPagePath({ page: PageId.Trade, network, marketAddressOrName: getDefaultMarket(Network.Optimism) })
                )
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
                navigate(getPagePath({ page: PageId.Rewards }))
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
