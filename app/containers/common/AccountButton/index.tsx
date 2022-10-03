import Button, { ButtonSize } from '@lyra/ui/components/Button'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import useIsDarkMode from '@lyra/ui/hooks/useIsDarkMode'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import React, { useCallback } from 'react'
import { LayoutProps, MarginProps } from 'styled-system'

import Avatar from '@/app/components/common/Avatar'
import useENS from '@/app/hooks/data/useENS'
import withSuspense from '@/app/hooks/data/withSuspense'
import useQueryParam from '@/app/hooks/url/useQueryParam'
import useWallet from '@/app/hooks/wallet/useWallet'
import formatTruncatedAddress from '@/app/utils/formatTruncatedAddress'

import ConnectWalletButton from '../ConnectWalletButton'

type Props = {
  size?: ButtonSize
} & LayoutProps &
  MarginProps

const AccountButton = withSuspense(
  ({ size, ...styleProps }: Props) => {
    const [isDarkMode] = useIsDarkMode()
    const { account, isLoading, isOverride } = useWallet()
    const ens = useENS()
    const [_, setSeeAddress] = useQueryParam('see')

    const getButtonLabel = useCallback(() => {
      const accountStr = account ? formatTruncatedAddress(account) : ''
      if (isOverride && account) {
        return formatTruncatedAddress(account)
      } else {
        return ens?.name ?? accountStr
      }
    }, [account, isOverride, ens])

    return (
      <>
        {account ? (
          <ConnectButton.Custom>
            {({ openAccountModal }) => {
              const variant = isOverride ? 'warning' : isDarkMode ? 'static' : 'white'
              const onClick = async () => {
                if (isOverride) {
                  // Unset override
                  setSeeAddress(null)
                } else if (account) {
                  openAccountModal()
                }
              }
              return (
                <Button
                  {...styleProps}
                  size={size}
                  rightIconSpacing={1}
                  rightIcon={<Avatar size={18} ensImage={ens?.avatarURL} address={account} />}
                  isLoading={isLoading}
                  variant={variant}
                  label={getButtonLabel()}
                  onClick={onClick}
                />
              )
            }}
          </ConnectButton.Custom>
        ) : (
          <ConnectWalletButton size={size} {...styleProps} />
        )}
      </>
    )
  },
  ({ size, ...styleProps }: Props) => <ButtonShimmer width={147} size={size} {...styleProps} />
)

export default AccountButton
