import Alert from '@lyra/ui/components/Alert'
import Button from '@lyra/ui/components/Button'
import IconButton from '@lyra/ui/components/Button/IconButton'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Input from '@lyra/ui/components/Input'
import Link from '@lyra/ui/components/Link'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import { Network } from '@lyrafinance/lyra-js'
import React from 'react'

import { REFERRALS_TERMS_OF_USE_URL } from '@/app/constants/links'
import { TransactionType } from '@/app/constants/screen'
import useScreenTransaction from '@/app/hooks/account/useScreenTransaction'
import useWallet from '@/app/hooks/account/useWallet'
import withSuspense from '@/app/hooks/data/withSuspense'
import { getChainIdForNetwork } from '@/app/utils/getChainIdForNetwork'
import getReferralLink from '@/app/utils/referrals/getReferralLink'

type ReferralsInputProps = {
  network: Network
  isCopied: boolean
  referrerCode: string | null | undefined
  isCreateMode: boolean
  isInvalidCode: boolean
  isTakenCode: boolean
  onChangeReferralCode: (referrerCode: string) => void
  onClickCopy: (value: string) => void
  onClickCreate: (value: string) => void
} & MarginProps

const ReferralsInput = withSuspense(
  ({
    network,
    isCreateMode,
    referrerCode,
    isCopied,
    isInvalidCode,
    isTakenCode,
    onChangeReferralCode,
    onClickCreate,
    onClickCopy,
    ...marginProps
  }: ReferralsInputProps) => {
    const { isConnected, connectedAccount, account } = useWallet()
    const isOwnAccount = !!account && !!connectedAccount && account === connectedAccount
    const value = referrerCode
      ? getReferralLink(referrerCode)
      : account
      ? 'No referral code for wallet address'
      : 'Connect wallet to create a referral code'
    const screenData = useScreenTransaction(getChainIdForNetwork(network), TransactionType.Referral)
    const isScreened = !screenData || screenData.isBlocked
    const isCreateDisabled = !isConnected || !isCreateMode || !isOwnAccount || isInvalidCode || isScreened
    const isCopyDisabled = isCreateMode

    return (
      <Flex flexDirection="column" {...marginProps}>
        {isScreened ? (
          <Alert
            variant="error"
            mb={3}
            description={
              screenData?.blockDescription ? (
                <>
                  {screenData.blockDescription}&nbsp;Learn more in our{' '}
                  <Link
                    variant="small"
                    color="errorText"
                    showRightIcon
                    href={REFERRALS_TERMS_OF_USE_URL}
                    target="_blank"
                  >
                    Referral Terms
                  </Link>
                </>
              ) : !screenData ? (
                'Something went wrong while verifying this transaction.'
              ) : null
            }
          />
        ) : null}
        <Input
          inputContainerStyles={{
            borderWidth: `1px`,
            borderStyle: 'solid',
            borderColor:
              isInvalidCode || isTakenCode ? 'errorButtonBg' : isScreened ? 'disabledButtonBg' : 'primaryText',
            borderRadius: 25,
            cursor: 'pointer',
          }}
          rebassInputStyles={{
            color: isCreateMode ? '#95A4B5' : null,
            cursor: isScreened ? 'not-allowed' : 'text',
          }}
          isDisabled={!isCreateMode || isScreened}
          width="100%"
          value={isCreateMode ? referrerCode ?? undefined : value}
          placeholder={isCreateMode ? 'Enter a custom code for your referral link' : ''}
          onChange={event => {
            if (isCreateMode) {
              onChangeReferralCode(event.target.value)
            }
          }}
          rightContent={
            <Flex my={2} height={36} alignItems="center">
              {isCopied ? (
                <Text color="primaryText" textAlign="center" mr={2}>
                  Copied!
                </Text>
              ) : (
                <>
                  {referrerCode && !isCreateMode ? (
                    <IconButton
                      icon={IconType.Copy}
                      isTransparent
                      size="md"
                      onClick={() => onClickCopy(value ?? '')}
                      isDisabled={isCopyDisabled}
                      variant={isCreateMode ? 'default' : 'primary'}
                      sx={{ color: `${isCopyDisabled ? 'defaultText' : 'primaryText'}` }}
                    />
                  ) : null}
                  {isOwnAccount && isCreateMode ? (
                    <Button
                      my={2}
                      size="md"
                      label={isTakenCode ? 'Taken' : 'Create'}
                      isTransparent
                      variant={isCreateMode ? 'primary' : 'default'}
                      sx={{ color: `${isCreateDisabled ? 'defaultText' : isTakenCode ? 'errorText' : 'primaryText'}` }}
                      isDisabled={isCreateDisabled}
                      onClick={() => {
                        if (referrerCode) {
                          onClickCreate(referrerCode)
                        }
                      }}
                    />
                  ) : null}
                </>
              )}
            </Flex>
          }
        />
      </Flex>
    )
  },
  () => <ButtonShimmer width="100%" size="lg" />
)
export default ReferralsInput
