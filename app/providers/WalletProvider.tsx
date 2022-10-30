import Button from '@lyra/ui/components/Button'
import Modal from '@lyra/ui/components/Modal'
import ModalBody from '@lyra/ui/components/Modal/ModalBody'
import Text from '@lyra/ui/components/Text'
import useThemeColor from '@lyra/ui/hooks/useThemeColor'
import { connectorsForWallets, lightTheme, RainbowKitProvider, wallet } from '@rainbow-me/rainbowkit'
import nullthrows from 'nullthrows'
import React, { useEffect, useRef, useState } from 'react'
import { chain as wagmiChain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'

import Avatar from '../components/common/Avatar'
import { ScreenWalletData } from '../constants/screen'
import useQueryParam from '../hooks/url/useQueryParam'
import useAutoConnect from '../hooks/wallet/useAutoConnect'
import useWallet from '../hooks/wallet/useWallet'
import NoSSR from '../page_helpers/common/NoSSR'
import fetchScreenWallet from '../utils/fetchScreenWallet'
import isOptimismMainnet from '../utils/isOptimismMainnet'
import isScreeningEnabled from '../utils/isScreeningEnabled'
import mergeDeep from '../utils/mergeDeep'

const SUPPORTED_CHAINS = [wagmiChain.optimism, wagmiChain.optimismGoerli]

const INFURA_PROJECT_ID = nullthrows(
  process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
  'Missing NEXT_PUBLIC_INFURA_PROJECT_ID in environment variables'
)

const { chains, provider } = configureChains(
  [wagmiChain.mainnet, ...SUPPORTED_CHAINS],
  [infuraProvider({ apiKey: INFURA_PROJECT_ID }), publicProvider()]
)

const connectors = connectorsForWallets([
  {
    groupName: 'Best Support for Optimism',
    wallets: [
      wallet.metaMask({ chains }),
      wallet.coinbase({ chains, appName: 'Lyra' }),
      wallet.walletConnect({ chains }),
      wallet.rainbow({ chains }),
      wallet.imToken({ chains }),
      wallet.trust({ chains }),
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
  const [_, setSeeAddress] = useQueryParam('see')

  const [blockData, setBlockData] = useState<ScreenWalletData | null>(null)

  useAutoConnect()
  const prevAccountRef = useRef(connectedAccount)

  useEffect(() => {
    if (connectedAccount && isOptimismMainnet() && isScreeningEnabled()) {
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

// Store selected walletType in local browser storage
export function WalletProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const primaryText = useThemeColor('primaryText')
  const errorText = useThemeColor('errorText')
  const modalBg = useThemeColor('modalBg')
  const modalOverlayBg = useThemeColor('modalOverlayBg')
  const text = useThemeColor('text')
  const secondaryText = useThemeColor('secondaryText')
  const buttonBg = useThemeColor('buttonBg')
  const buttonHover = useThemeColor('buttonHover')
  const primaryButtonBg = useThemeColor('primaryButtonBg')
  const elevatedShadowBg = useThemeColor('elevatedShadowBg')
  const white = useThemeColor('white')

  const theme = mergeDeep(lightTheme(), {
    fonts: { body: 'Inter var' },
    colors: {
      accentColor: primaryText,
      accentColorForeground: white,
      actionButtonBorder: 'transparent',
      actionButtonBorderMobile: buttonBg,
      actionButtonSecondaryBackground: buttonBg,
      closeButton: text,
      closeButtonBackground: buttonBg,
      connectButtonBackground: primaryButtonBg,
      connectButtonBackgroundError: primaryButtonBg,
      connectButtonInnerBackground: text,
      connectButtonText: white,
      connectButtonTextError: white,
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

  const initialChain = isOptimismMainnet() ? wagmiChain.optimism : wagmiChain.optimismGoerli

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
        initialChain={initialChain}
      >
        <NoSSR>
          <WalletScreenModal />
        </NoSSR>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
