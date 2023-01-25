import Button from '@lyra/ui/components/Button'
import Modal from '@lyra/ui/components/Modal'
import ModalBody from '@lyra/ui/components/Modal/ModalBody'
import Text from '@lyra/ui/components/Text'
import { getThemePreset } from '@lyra/ui/theme'
import { connectorsForWallets, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import {
  braveWallet,
  coinbaseWallet,
  imTokenWallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { isAddress } from 'ethers/lib/utils.js'
import nullthrows from 'nullthrows'
import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { chain as wagmiChain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'

import Avatar from '../components/common/Avatar'
import { ScreenWalletData } from '../constants/screen'
import { qredo, rabby } from '../constants/wallets'
import useAutoConnect from '../hooks/account/useAutoConnect'
import useWallet from '../hooks/account/useWallet'
import useQueryParam from '../hooks/url/useQueryParam'
import emptyFunction from '../utils/emptyFunction'
import fetchScreenWallet from '../utils/fetchScreenWallet'
import isMainnet from '../utils/isMainnet'
import isScreeningEnabled from '../utils/isScreeningEnabled'
import mergeDeep from '../utils/mergeDeep'

const SUPPORTED_CHAINS = [
  wagmiChain.optimism,
  wagmiChain.optimismGoerli,
  wagmiChain.arbitrum,
  wagmiChain.arbitrumGoerli,
]

const INFURA_PROJECT_ID = nullthrows(
  process.env.REACT_APP_INFURA_PROJECT_ID,
  'Missing REACT_APP_INFURA_PROJECT_ID in environment variables'
)

const { chains, provider } = configureChains(
  [{ ...wagmiChain.mainnet }, ...SUPPORTED_CHAINS],
  [infuraProvider({ apiKey: INFURA_PROJECT_ID }), publicProvider()]
)

const connectors = connectorsForWallets([
  {
    groupName: 'Best Support for Optimism',
    wallets: [
      metaMaskWallet({ chains }),
      coinbaseWallet({ chains, appName: 'Lyra' }),
      walletConnectWallet({ chains }),
      rainbowWallet({ chains }),
      imTokenWallet({ chains }),
      trustWallet({ chains }),
      braveWallet({ chains }),
      qredo({ chains }),
      rabby({ chains }),
      injectedWallet({ chains }),
    ],
  },
])

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

const WalletScreenModal = (): JSX.Element => {
  const { connectedAccount, disconnect } = useWallet()

  const [blockData, setBlockData] = useState<ScreenWalletData | null>(null)

  useAutoConnect()
  const prevAccountRef = useRef(connectedAccount)

  useEffect(() => {
    if (connectedAccount && isMainnet() && isScreeningEnabled()) {
      const isConnect = !prevAccountRef.current || prevAccountRef.current !== connectedAccount
      fetchScreenWallet(connectedAccount, isConnect).then(setBlockData)
    } else {
      setBlockData(null)
    }
    prevAccountRef.current = connectedAccount
  }, [connectedAccount])

  return (
    <>
      {blockData ? (
        <Modal title="Wallet Blocked" isOpen={blockData?.isBlocked}>
          <ModalBody>
            <Text mb={8} color="secondaryText">
              {blockData.blockDescription}
            </Text>
            <Button size="lg" label="Disconnect" onClick={() => disconnect()} />
          </ModalBody>
        </Modal>
      ) : null}
    </>
  )
}

export const WalletSeeContext = createContext<{ seeAddress: string | null; removeSeeAddress: () => void }>({
  seeAddress: null,
  removeSeeAddress: emptyFunction,
})

// Store selected walletType in local browser storage
export function WalletProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const lyraThemeLight = getThemePreset(false, true)
  const text = lyraThemeLight.colors?.text
  const secondaryText = lyraThemeLight.colors?.secondaryText
  const primaryText = lyraThemeLight.colors?.primaryText
  const errorText = lyraThemeLight.colors?.errorText
  const modalBg = lyraThemeLight.colors?.modalBg
  const buttonBg = lyraThemeLight.colors?.buttonBg
  const primaryButtonBg = lyraThemeLight.colors?.primaryButtonBg
  const buttonHover = lyraThemeLight.colors?.buttonHover
  const modalOverlayBg = lyraThemeLight.colors?.modalOverlayBg
  const elevatedShadowBg = lyraThemeLight.colors?.elevatedShadowBg

  const theme = mergeDeep(lightTheme(), {
    fonts: { body: 'Inter var' },
    colors: {
      accentColor: primaryText,
      accentColorForeground: 'white',
      actionButtonBorder: 'transparent',
      actionButtonBorderMobile: buttonBg,
      actionButtonSecondaryBackground: buttonBg,
      closeButton: text,
      closeButtonBackground: buttonBg,
      connectButtonBackground: primaryButtonBg,
      connectButtonBackgroundError: primaryButtonBg,
      connectButtonInnerBackground: text,
      connectButtonText: 'white',
      connectButtonTextError: 'white',
      connectionIndicator: text,
      error: errorText,
      generalBorder: 'transparent',
      generalBorderDim: 'transparent',
      menuItemBackground: buttonHover,
      modalBackdrop: modalOverlayBg,
      modalBackground: modalBg,
      modalBorder: 'transparent',
      modalText: text,
      modalTextDim: secondaryText,
      modalTextSecondary: secondaryText,
      profileAction: buttonBg,
      profileActionHover: buttonHover,
      profileForeground: 'transparent',
      selectedOptionBorder: 'transparent',
      standby: text,
    },
    shadows: {
      dialog: `0px 0px 40px ${elevatedShadowBg}`,
    },
    radii: {
      actionButton: '10000px',
      connectButton: '10000px',
      menuButton: '10000px',
      modal: '28px',
      modalMobile: '28px',
    },
  })

  const initialChain = isMainnet() ? wagmiChain.optimism : wagmiChain.optimismGoerli

  // Grab initial see arg from query parameters
  const [rawQuerySeeAddress] = useQueryParam('see')
  const querySeeAddress = rawQuerySeeAddress && isAddress(rawQuerySeeAddress) ? rawQuerySeeAddress : null
  const [seeAddress, setSeeAddress] = useState<string | null>(querySeeAddress)
  useEffect(() => {
    // Update context from ?see= param
    if (querySeeAddress) {
      setSeeAddress(querySeeAddress)
    }
  }, [querySeeAddress])
  const removeSeeAddress = useCallback(() => setSeeAddress(null), [])
  const value = useMemo(() => ({ seeAddress, removeSeeAddress }), [seeAddress, removeSeeAddress])

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        appInfo={{
          appName: 'Lyra',
          learnMoreUrl: 'https://lyra.finance',
        }}
        avatar={Avatar}
        theme={theme}
        chains={chains}
      >
        <WalletSeeContext.Provider value={value}>
          <WalletScreenModal />
          {children}
        </WalletSeeContext.Provider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
