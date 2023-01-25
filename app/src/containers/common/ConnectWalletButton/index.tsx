import Button, { ButtonSize } from '@lyra/ui/components/Button'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import { Network } from '@lyrafinance/lyra-js'
import React, { useEffect, useRef, useState } from 'react'
import { LayoutProps, MarginProps } from 'styled-system'

import { LogEvent } from '@/app/constants/logEvents'
import useWallet from '@/app/hooks/account/useWallet'
import withSuspense from '@/app/hooks/data/withSuspense'
import formatTruncatedAddress from '@/app/utils/formatTruncatedAddress'
import getChainForChainId from '@/app/utils/getChainForChainId'
import { getChainIdForNetwork } from '@/app/utils/getChainIdForNetwork'
import getNetworkConfig from '@/app/utils/getNetworkConfig'
import logEvent from '@/app/utils/logEvent'
import { MAINNET_NETWORK_CONFIG } from '@/app/utils/mainnetProvider'

type Props = {
  network: Network | 'ethereum'
  size?: ButtonSize
} & LayoutProps &
  MarginProps

// TODO: @dappbeast Show override status + exit (for see param)
const ConnectWalletButton = withSuspense(
  ({ size, network, ...styleProps }: Props): JSX.Element => {
    const {
      account,
      isLoading,
      isConnected,
      chainId: walletChainId,
      isOverride,
      switchNetwork,
      walletType,
      openAccountModal,
      openConnectModal,
      removeSeeAddress,
    } = useWallet()

    const targetChainId = network === 'ethereum' ? 1 : getChainIdForNetwork(network)
    const targetNetworkConfig =
      network === 'ethereum' ? MAINNET_NETWORK_CONFIG : getNetworkConfig(getChainForChainId(targetChainId))
    const isWrongNetwork = isConnected && walletChainId !== targetChainId

    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false)

    // HACK to track wallet connect action
    const wasConnectModalOpen = useRef(isConnectModalOpen)
    useEffect(() => {
      if (isConnectModalOpen && !wasConnectModalOpen.current) {
        logEvent(LogEvent.ConnectWalletOpen)
      } else if (!isConnectModalOpen && wasConnectModalOpen.current) {
        logEvent(LogEvent.ConnectWalletClose)
        if (isConnected && !isWrongNetwork) {
          logEvent(LogEvent.ConnectWalletSuccess)
        }
      }
      wasConnectModalOpen.current = isConnectModalOpen
    }, [isConnectModalOpen, isConnected, isWrongNetwork, walletChainId, walletType])

    let buttonLabel = 'Connected'
    if (isOverride && account) {
      buttonLabel = `Watching ${formatTruncatedAddress(account)}`
    } else if (isWrongNetwork) {
      buttonLabel = `Switch to ${targetNetworkConfig.shortName}`
    } else if (!isConnected) {
      buttonLabel = 'Connect Wallet'
    }

    const variant = isOverride ? 'warning' : 'primary'

    const onClick = async () => {
      if (isOverride) {
        // Unset override
        removeSeeAddress()
      } else if (isWrongNetwork) {
        logEvent(LogEvent.ConnectWalletSwitchNetworkSubmit, {
          fromChainId: walletChainId,
          toChainId: targetChainId,
        })
        const connectedChainId = targetChainId ? await switchNetwork(targetChainId) : null
        if (targetChainId === connectedChainId) {
          logEvent(LogEvent.ConnectWalletSwitchNetworkSuccess, {
            fromChainId: walletChainId,
            toChainId: targetChainId,
          })
          logEvent(LogEvent.ConnectWalletSuccess)
        }
      } else if (!isConnected) {
        // connected
        openConnectModal()
        setIsConnectModalOpen(true)
      } else {
        // connected, correct network
        openAccountModal()
      }
    }

    return (
      <Button
        {...styleProps}
        size={size}
        isLoading={isLoading && isConnectModalOpen}
        isDisabled={isConnected && !isWrongNetwork}
        variant={variant}
        label={buttonLabel}
        onClick={onClick}
      />
    )
  },
  ({ size, ...styleProps }: Props) => <ButtonShimmer size={size} {...styleProps} />
)

export default ConnectWalletButton
