import Alert from '@lyra/ui/components/Alert'
import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import { IconType } from '@lyra/ui/components/Icon'
import Link from '@lyra/ui/components/Link'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import { BigNumber } from 'ethers'
import React, { useCallback, useState } from 'react'

import { TERMS_OF_USE_URL } from '@/app/constants/links'
import { LOCAL_STORAGE_TERMS_OF_USE_KEY } from '@/app/constants/localStorage'
import { LyraNetwork, Network } from '@/app/constants/networks'
import { TransactionType } from '@/app/constants/screen'
import TermsOfUseModal from '@/app/containers/common/TermsOfUseModal'
import useEthBalance from '@/app/hooks/account/useEthBalance'
import useIsReady from '@/app/hooks/account/useIsReady'
import useIsSmartContractWallet from '@/app/hooks/account/useIsSmartContractWallet'
import useScreenTransaction from '@/app/hooks/account/useScreenTransaction'
import useTransaction from '@/app/hooks/account/useTransaction'
import useWallet from '@/app/hooks/account/useWallet'
import withSuspense from '@/app/hooks/data/withSuspense'
import useLocalStorage from '@/app/hooks/local_storage/useLocalStorage'
import useMutateDrip from '@/app/hooks/mutations/useMutateDrip'
import coerce from '@/app/utils/coerce'
import { getChainIdForNetwork } from '@/app/utils/getChainIdForNetwork'
import getLyraSDK from '@/app/utils/getLyraSDK'
import getNetworkConfig from '@/app/utils/getNetworkConfig'
import isMainnet from '@/app/utils/isMainnet'
import isScreeningEnabled from '@/app/utils/isScreeningEnabled'
import isTermsOfUseEnabled from '@/app/utils/isTermsOfUseEnabled'

import ConnectWalletButton from '../ConnectWalletButton'
import OnboardingModal from '../OnboardingModal'

type RequireTokenAllowance = {
  address: string
  symbol: string
  decimals: number
  onClick: () => void
}

type RequireTokenBalance = {
  address: string
  symbol: string
  balance: BigNumber
  requiredBalance: BigNumber
  context: string
}

export type TransactionButtonProps = {
  transactionType: TransactionType
  network: Network
  onClick: () => Promise<void>
  label: string
  isDisabled?: boolean
  requireAllowance?: RequireTokenAllowance
  requireBalance?: RequireTokenBalance
} & MarginProps &
  Omit<LayoutProps, 'size'>

const EMPTY_TERMS = {}

const TransactionButton = withSuspense(
  React.forwardRef(
    (
      {
        transactionType,
        onClick,
        isDisabled,
        requireAllowance,
        requireBalance,
        network,
        label,
        ...marginProps
      }: TransactionButtonProps,
      ref
    ) => {
      const { account } = useWallet()
      const [termsStr, setTermsStr] = useLocalStorage(LOCAL_STORAGE_TERMS_OF_USE_KEY)
      const termsDict: Record<string, number> = JSON.parse(termsStr) ?? EMPTY_TERMS
      const isTermsAccepted = account && !!termsDict[account]
      const [isTermsOpen, setIsTermsOpen] = useState(false)
      const targetChainId = getChainIdForNetwork(network)
      const screenData = useScreenTransaction(targetChainId, transactionType)
      const isReady = useIsReady(targetChainId)
      const ethBalance = useEthBalance(network)
      const isSmartContractWallet = useIsSmartContractWallet(network)

      const [isSwapOpen, setIsSwapOpen] = useState(false)

      const [isLoading, setIsLoading] = useState(false)
      const [isApproveLoading, setIsApproveLoading] = useState(false)

      const handleClickApprove = useCallback(async () => {
        if (requireAllowance) {
          setIsApproveLoading(true)
          await requireAllowance.onClick()
          setIsApproveLoading(false)
        }
      }, [requireAllowance])

      const lyraNetwork = coerce(LyraNetwork, network)

      const handleClick = useCallback(async () => {
        setIsLoading(true)
        await onClick()
        setIsLoading(false)
      }, [onClick])

      const execute = useTransaction(network)
      const mutateDrip = useMutateDrip()
      const handleDrip = useCallback(async () => {
        if (!account) {
          console.warn('Wallet not connected')
          return
        }
        if (!lyraNetwork) {
          console.warn('Network not supported for drip')
          return
        }
        await execute(getLyraSDK(lyraNetwork).drip(account), TransactionType.Faucet, { onComplete: () => mutateDrip() })
      }, [account, lyraNetwork, execute, mutateDrip])

      const onCloseSwap = useCallback(() => setIsSwapOpen(false), [])

      const requireEthBalance = ethBalance.isZero() && !isSmartContractWallet
      const requireSwap = requireBalance && requireBalance.requiredBalance.gt(requireBalance.balance)
      const requireApproval = !!requireAllowance

      return (
        <Box {...marginProps}>
          {isScreeningEnabled() && (!screenData || screenData.isBlocked) ? (
            <Alert
              variant="error"
              mb={3}
              description={
                screenData?.blockDescription ? (
                  <>
                    {screenData.blockDescription}&nbsp;Learn more in our{' '}
                    <Link
                      textVariant="small"
                      color="errorText"
                      variant="secondary"
                      showRightIcon
                      href={TERMS_OF_USE_URL}
                      target="_blank"
                    >
                      Terms of Use
                    </Link>
                  </>
                ) : !screenData ? (
                  'Something went wrong while verifying this transaction.'
                ) : null
              }
            />
          ) : null}
          {!isReady ? (
            // Switch networks prompt
            <ConnectWalletButton mb={3} width="100%" size="lg" network={network} />
          ) : requireEthBalance ? (
            isMainnet() ? (
              // Bridge ETH
              <Button
                label="Bridge ETH"
                width="100%"
                onClick={async () => {
                  if (isTermsAccepted || !isTermsOfUseEnabled()) {
                    setIsSwapOpen(true)
                  } else {
                    setIsTermsOpen(true)
                  }
                }}
                variant="primary"
                size="lg"
                mb={3}
              />
            ) : (
              // Drip ETH
              <Button
                label="Get Test ETH"
                width="100%"
                size="lg"
                rightIcon={IconType.ArrowUpRight}
                variant="primary"
                href={getNetworkConfig(network).faucetUrl ?? '#'}
                target="_blank"
                mb={3}
              />
            )
          ) : requireBalance && requireSwap && lyraNetwork ? (
            isMainnet() ? (
              // Swap to target token
              <Button
                label={`Swap to ${requireBalance.symbol}`}
                width="100%"
                onClick={async () => {
                  if (isTermsAccepted || !isTermsOfUseEnabled()) {
                    setIsSwapOpen(true)
                  } else {
                    setIsTermsOpen(true)
                  }
                }}
                variant="primary"
                size="lg"
                mb={3}
              />
            ) : (
              // Drip tokens
              <Button
                label={`Get Test ${requireBalance.symbol}`}
                onClick={handleDrip}
                width="100%"
                variant="primary"
                size="lg"
                mb={3}
              />
            )
          ) : requireAllowance ? (
            // Approve prompt
            <Button
              label={`Allow Lyra to use your ${requireAllowance.symbol}`}
              width="100%"
              onClick={async () => {
                if (isTermsAccepted || !isTermsOfUseEnabled()) {
                  await handleClickApprove()
                } else {
                  setIsTermsOpen(true)
                }
              }}
              isLoading={isApproveLoading}
              variant="primary"
              size="lg"
              mb={3}
            />
          ) : null}
          <Button
            label={label}
            variant="primary"
            size="lg"
            isLoading={isLoading}
            width="100%"
            onClick={async () => {
              if (isTermsAccepted || !isTermsOfUseEnabled()) {
                await handleClick()
              } else {
                setIsTermsOpen(true)
              }
            }}
            ref={ref}
            isDisabled={
              !isReady ||
              !screenData ||
              screenData?.isBlocked ||
              isDisabled ||
              requireApproval ||
              requireEthBalance ||
              requireSwap
            }
          />
          <TermsOfUseModal
            isOpen={isTermsOpen}
            onConfirm={() => {
              if (account) {
                setTermsStr(
                  JSON.stringify({
                    ...termsDict,
                    [account]: Date.now() / 1000,
                  })
                )
              }
              if (requireAllowance) {
                handleClickApprove()
              } else {
                handleClick()
              }
            }}
            onClose={() => setIsTermsOpen(false)}
          />
          {requireBalance && lyraNetwork ? (
            <OnboardingModal
              toToken={{ ...requireBalance, network: lyraNetwork }}
              isOpen={isSwapOpen}
              onClose={onCloseSwap}
              context={requireBalance.context}
            />
          ) : null}
        </Box>
      )
    }
  ),
  ({ transactionType, onClick, isDisabled, requireAllowance, network, label, ...marginProps }) => (
    <Box {...marginProps}>
      <ButtonShimmer width="100%" size="lg" />
    </Box>
  )
)

export default TransactionButton
