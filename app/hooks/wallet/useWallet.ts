import { JsonRpcProvider } from '@ethersproject/providers'
import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { Signer } from 'ethers'
import { useCallback, useEffect, useMemo } from 'react'
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
import isServer from '@/app/utils/isServer'

import useQueryParam from '../url/useQueryParam'

type Wallet = {
  isConnected: boolean
  account: string | undefined
  chainId: number | undefined
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

export default function useWallet(): Wallet {
  const { address, connector, isConnecting } = useAccount()
  const { isLoading } = useConnect()
  const { chain } = useNetwork()
  const { switchNetworkAsync } = useSwitchNetwork()
  const { data: signer } = useSigner()
  const { disconnect } = useDisconnect()
  const provider = useProvider<JsonRpcProvider>()
  const walletType = getWalletType(connector?.id)

  const { openConnectModal } = useConnectModal()
  const { openAccountModal } = useAccountModal()

  const [seeAddress] = useQueryParam('see')

  const switchNetwork = useCallback(
    async (chainId: number) => {
      if (switchNetworkAsync) {
        try {
          const chain = await switchNetworkAsync(chainId)
          return chain.id
        } catch (e) {
          console.warn(e)
        }
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

  useEffect(() => {
    if (!isServer()) {
      const w = window as any
      w.__APP_CONTEXT__ = {
        address,
        seeAddress,
        chainId: chain?.id,
      }
    }
  }, [seeAddress, address, chain])

  return useMemo(
    () => ({
      account: seeAddress ?? address,
      chainId: chain?.id,
      connector,
      isConnected: !!address && !!connector,
      isLoading: isLoading || isConnecting,
      isOverride: !!seeAddress,
      provider,
      signer,
      walletType,
      disconnect,
      switchNetwork,
      openAccountModal: openAccountModalSafe,
      openConnectModal: openConnectModalSafe,
    }),
    [
      address,
      connector,
      chain,
      isLoading,
      isConnecting,
      seeAddress,
      signer,
      provider,
      walletType,
      disconnect,
      switchNetwork,
      openAccountModalSafe,
      openConnectModalSafe,
    ]
  )
}
