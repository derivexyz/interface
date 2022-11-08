import Alert from '@lyra/ui/components/Alert'
import Box from '@lyra/ui/components/Box'
import Button, { BaseButtonProps } from '@lyra/ui/components/Button'
import Link from '@lyra/ui/components/Link'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import React, { useState } from 'react'
import { SxStyleProp } from 'rebass'

import { TERMS_OF_USE_URL } from '@/app/constants/links'
import { LOCAL_STORAGE_TERMS_OF_USE_KEY } from '@/app/constants/localStorage'
import { TransactionType } from '@/app/constants/screen'
import TermsOfUseModal from '@/app/containers/common/TermsOfUseModal'
import withSuspense from '@/app/hooks/data/withSuspense'
import useLocalStorage from '@/app/hooks/local_storage/useLocalStorage'
import useIsReady from '@/app/hooks/wallet/useIsReady'
import useScreenTransaction from '@/app/hooks/wallet/useScreenTransaction'
import useWallet from '@/app/hooks/wallet/useWallet'
import isScreeningEnabled from '@/app/utils/isScreeningEnabled'
import isTermsOfUseEnabled from '@/app/utils/isTermsOfUseEnabled'

import ConnectWalletButton from '../ConnectWalletButton'

type Props = {
  transactionType: TransactionType
  hideIfNotReady?: boolean
  helperButton?: React.ReactNode
  sx?: SxStyleProp
} & BaseButtonProps

const EMPTY_TERMS = {}

const TransactionButton = withSuspense(
  React.forwardRef(
    ({ transactionType, helperButton, hideIfNotReady, onClick, isDisabled, sx, ...buttonProps }: Props, ref) => {
      const { account } = useWallet()
      const [termsStr, setTermsStr] = useLocalStorage(LOCAL_STORAGE_TERMS_OF_USE_KEY)
      const termsDict: Record<string, number> = JSON.parse(termsStr) ?? EMPTY_TERMS
      const isTermsAccepted = account && !!termsDict[account]
      const [isTermsOpen, setIsTermsOpen] = useState(false)
      const screenData = useScreenTransaction(transactionType)
      const isReady = useIsReady()

      return (
        <Box sx={sx}>
          {isScreeningEnabled() && (!screenData || screenData.isBlocked) ? (
            <Alert
              variant="error"
              mb={3}
              description={
                screenData?.blockDescription ? (
                  <>
                    {screenData.blockDescription} &nbsp; Learn more in our{' '}
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
          {!isReady ? <ConnectWalletButton mb={3} width="100%" size={buttonProps.size} /> : null}
          {!hideIfNotReady || (isReady && hideIfNotReady) ? (
            <>
              {helperButton}
              <Button
                {...buttonProps}
                mt={helperButton ? 3 : 0}
                width="100%"
                onClick={e => {
                  // Execute action if terms are accepted or not enabled
                  if (isTermsAccepted || !isTermsOfUseEnabled()) {
                    if (onClick) {
                      onClick(e)
                    }
                  } else {
                    setIsTermsOpen(true)
                  }
                }}
                ref={ref}
                isDisabled={!isReady || !screenData || screenData?.isBlocked || isDisabled}
              />
            </>
          ) : null}
          <TermsOfUseModal
            isOpen={isTermsOpen}
            onConfirm={e => {
              if (account) {
                setTermsStr(
                  JSON.stringify({
                    ...termsDict,
                    [account]: Date.now() / 1000,
                  })
                )
              }
              if (onClick) {
                onClick(e)
              }
            }}
            onClose={() => setIsTermsOpen(false)}
          />
        </Box>
      )
    }
  ),
  ({ transactionType, helperButton, onClick, sx, ...buttonProps }) => (
    <Box sx={sx}>
      <ButtonShimmer width="100%" {...buttonProps} />
    </Box>
  )
)

export default TransactionButton
