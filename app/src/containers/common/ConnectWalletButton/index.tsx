import Button, { ButtonSize } from '@lyra/ui/components/Button'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import React, { useEffect, useRef, useState } from 'react'
import { LayoutProps, MarginProps } from 'styled-system'

import { LogEvent } from '@/app/constants/logEvents'
import { Network } from '@/app/constants/networks'
import useWallet from '@/app/hooks/account/useWallet'
import withSuspense from '@/app/hooks/data/withSuspense'
import formatTruncatedAddress from '@/app/utils/formatTruncatedAddress'
import { getChainIdForNetwork } from '@/app/utils/getChainIdForNetwork'
import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'
import logEvent from '@/app/utils/logEvent'

type Props = {
  network: Network
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
      openAccountModal,
      openConnectModal,
      removeSeeAddress,
    } = useWallet()

    const targetChainId = getChainIdForNetwork(network)
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
    }, [isConnectModalOpen, isConnected, isWrongNetwork, walletChainId])

    let buttonLabel = 'Connected'
    if (isOverride && account) {
      buttonLabel = `Watching ${formatTruncatedAddress(account)}`
    } else if (isWrongNetwork) {
      buttonLabel = `Switch to ${getNetworkDisplayName(network)}`
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
