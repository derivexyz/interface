import Alert from '@lyra/ui/components/Alert'
import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Link from '@lyra/ui/components/Link'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import { Network } from '@lyrafinance/lyra-js'
import React, { useCallback, useState } from 'react'

import { TERMS_OF_USE_URL } from '@/app/constants/links'
import { LOCAL_STORAGE_TERMS_OF_USE_KEY } from '@/app/constants/localStorage'
import { TransactionType } from '@/app/constants/screen'
import TermsOfUseModal from '@/app/containers/common/TermsOfUseModal'
import withSuspense from '@/app/hooks/data/withSuspense'
import useLocalStorage from '@/app/hooks/local_storage/useLocalStorage'
import useIsReady from '@/app/hooks/wallet/useIsReady'
import useScreenTransaction from '@/app/hooks/wallet/useScreenTransaction'
import useWallet from '@/app/hooks/wallet/useWallet'
import { getChainIdForNetwork } from '@/app/utils/getChainIdForNetwork'
import isScreeningEnabled from '@/app/utils/isScreeningEnabled'
import isTermsOfUseEnabled from '@/app/utils/isTermsOfUseEnabled'

import ConnectWalletButton from '../ConnectWalletButton'

type RequireTokenAllowance = {
  address: string
  symbol: string
  decimals: number
  onClick: () => void
}

type Props = {
  transactionType: TransactionType
  network: Network | 'ethereum'
  onClick: () => Promise<void>
  label: string
  isDisabled?: boolean
  requireAllowance?: RequireTokenAllowance
  // TODO: @dappbeast re-implement onboarding "swap" modal
  // requireBalance?: RequireTokenBalance
} & MarginProps &
  Omit<LayoutProps, 'size'>

const EMPTY_TERMS = {}

const TransactionButton = withSuspense(
  React.forwardRef(
    ({ transactionType, onClick, isDisabled, requireAllowance, network, label, ...marginProps }: Props, ref) => {
      const { account } = useWallet()
      const [termsStr, setTermsStr] = useLocalStorage(LOCAL_STORAGE_TERMS_OF_USE_KEY)
      const termsDict: Record<string, number> = JSON.parse(termsStr) ?? EMPTY_TERMS
      const isTermsAccepted = account && !!termsDict[account]
      const [isTermsOpen, setIsTermsOpen] = useState(false)
      const targetChainId = network === 'ethereum' ? 1 : getChainIdForNetwork(network)
      const screenData = useScreenTransaction(targetChainId, transactionType)
      const isReady = useIsReady(targetChainId)

      const [isLoading, setIsLoading] = useState(false)
      const [isApproveLoading, setIsApproveLoading] = useState(false)

      const handleClickApprove = useCallback(async () => {
        if (requireAllowance) {
          setIsApproveLoading(true)
          await requireAllowance.onClick()
          setIsApproveLoading(false)
        }
      }, [requireAllowance])

      const handleClick = useCallback(async () => {
        setIsLoading(true)
        await onClick()
        setIsLoading(false)
      }, [onClick])

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
          ) : // TODO: @dappbeast Swap prompt
          requireAllowance ? (
            // Approve prompt
            <Button
              label={`Allow Lyra to use your ${requireAllowance.symbol}`}
              width="100%"
              onClick={async () => {
                if (isTermsAccepted || !isTermsOfUseEnabled()) {
                  handleClickApprove()
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
            onClick={() => {
              if (isTermsAccepted || !isTermsOfUseEnabled()) {
                handleClick()
              } else {
                setIsTermsOpen(true)
              }
            }}
            ref={ref}
            isDisabled={!isReady || !screenData || screenData?.isBlocked || isDisabled || !!requireAllowance}
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
