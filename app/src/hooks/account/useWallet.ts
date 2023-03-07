import { JsonRpcProvider } from '@ethersproject/providers'
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

import { WalletSeeContext } from '@/app/providers/WalletProvider'

type Wallet = {
  isConnected: boolean
  account: string | undefined
  connectedAccount: string | undefined
  chainId: number | undefined
  isLoading: boolean
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

export default function useWallet(): Wallet {
  const { address, connector } = useAccount()
  const { isLoading } = useConnect()
  const { chain } = useNetwork()
  const { switchNetworkAsync } = useSwitchNetwork()
  const { data: signer } = useSigner()
  const { disconnect } = useDisconnect()
  const provider = useProvider<JsonRpcProvider>()

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
      connector,
      isConnected: !!address && !!connector,
      isLoading,
      isOverride: !!seeAddress,
      provider,
      signer,
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
      isLoading,
      seeAddress,
      signer,
      provider,
      disconnect,
      switchNetwork,
      openAccountModalSafe,
      openConnectModalSafe,
      removeSeeAddress,
    ]
  )
}
