import { JsonRpcProvider } from '@ethersproject/providers'
import { Chain } from '@lyrafinance/lyra-js'
import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { Signer } from 'ethers'
import { useCallback, useContext, useMemo } from 'react'
import {
  Connector,
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useProvider,
  useSigner,
  useSwitchNetwork,
} from 'wagmi'

import { WalletType } from '@/app/constants/networks'
import { WalletSeeContext } from '@/app/providers/WalletProvider'
import getChainForChainId from '@/app/utils/getChainForChainId'

type Wallet = {
  isConnected: boolean
  account: string | undefined
  connectedAccount: string | undefined
  chainId: number | undefined
  chain?: Chain
  isLoading: boolean
  walletType: WalletType | null
  connector: Connector | undefined
  signer?: Signer | null
  provider: JsonRpcProvider | undefined
  isOverride: boolean
  switchNetwork: (chainId: number) => Promise<number | null>
  disconnect: () => void
  openConnectModal: () => void
  openAccountModal: () => void
  removeSeeAddress: () => void
}

function getWalletType(connectorId?: string): WalletType | null {
  switch (connectorId) {
    case 'metaMask':
      return WalletType.MetaMask
    case 'walletConnect':
      return WalletType.WalletConnect
    case 'coinbaseWallet':
      return WalletType.CoinbaseWallet
    case 'safe':
      return WalletType.GnosisSafe
    default:
      return null
  }
}

export const getNameForWalletType = (walletType: WalletType): string => {
  switch (walletType) {
    case WalletType.MetaMask:
      return 'MetaMask'
    case WalletType.WalletConnect:
      return 'WalletConnect'
    case WalletType.CoinbaseWallet:
      return 'Coinbase'
    case WalletType.GnosisSafe:
      return 'GnosisSafe'
  }
}

const getChainForChainIdCatch = (chainId: number) => {
  try {
    return getChainForChainId(chainId)
  } catch {
    return
  }
}

export default function useWallet(): Wallet {
  const { address, connector } = useAccount()
  const { isLoading } = useConnect()
  const { chain } = useNetwork()
  const { switchNetworkAsync } = useSwitchNetwork()
  const { data: signer } = useSigner()
  const { disconnect } = useDisconnect()
  const provider = useProvider<JsonRpcProvider>()
  const walletType = getWalletType(connector?.id)
  const lyraChain = chain ? getChainForChainIdCatch(chain.id) : undefined

  const { openConnectModal } = useConnectModal()
  const { openAccountModal } = useAccountModal()

  const { seeAddress, removeSeeAddress } = useContext(WalletSeeContext)

  const switchNetwork = useCallback(
    async (chainId: number) => {
      if (switchNetworkAsync) {
        const chain = await switchNetworkAsync(chainId)
        return chain.id
      }
      return null
    },
    [switchNetworkAsync]
  )

  const openAccountModalSafe = useCallback(() => {
    if (openAccountModal) {
      openAccountModal()
    }
  }, [openAccountModal])

  const openConnectModalSafe = useCallback(() => {
    if (openConnectModal) {
      openConnectModal()
    }
  }, [openConnectModal])

  const w = window as any
  w.__APP_CONTEXT__ = {
    address,
    seeAddress,
    chainId: chain?.id,
  }

  return useMemo(
    () => ({
      account: seeAddress ?? address,
      connectedAccount: address,
      chainId: chain?.id,
      chain: lyraChain,
      connector,
      isConnected: !!address && !!connector,
      isLoading,
      isOverride: !!seeAddress,
      provider,
      signer,
      walletType,
      disconnect,
      switchNetwork,
      openAccountModal: openAccountModalSafe,
      openConnectModal: openConnectModalSafe,
      removeSeeAddress,
    }),
    [
      address,
      connector,
      chain,
      lyraChain,
      isLoading,
      seeAddress,
      signer,
      provider,
      walletType,
      disconnect,
      switchNetwork,
      openAccountModalSafe,
      openConnectModalSafe,
      removeSeeAddress,
    ]
  )
}
