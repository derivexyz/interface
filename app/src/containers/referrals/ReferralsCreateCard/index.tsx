import Box from '@lyra/ui/components/Box'
import Card from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import Countdown from '@lyra/ui/components/Text/CountdownText'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatDate from '@lyra/ui/utils/formatDate'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import copy from 'copy-to-clipboard'
import React from 'react'
import { useEffect, useState } from 'react'
import { useCallback } from 'react'

import LabelItem from '@/app/components/common/LabelItem'
// import RewardTokenAmounts from '@/app/components/rewards/RewardTokenAmounts'
import useWallet from '@/app/hooks/account/useWallet'
import withSuspense from '@/app/hooks/data/withSuspense'
import useIsReferralTermsAccepted from '@/app/hooks/referrals/useIsReferralTermsAccepted'
import { ReferralsPageData } from '@/app/hooks/referrals/useReferralsPageData'
import checkReferrerCode from '@/app/utils/referrals/checkReferrerCode'
import createReferrerCode from '@/app/utils/referrals/createReferrerCode'
import validateReferrerCode from '@/app/utils/referrals/validateReferrerCode'

import ConnectWalletButton from '../../common/ConnectWalletButton'
import ReferralsTermsOfUseModal from '../../common/ReferralsTermsOfUseModal'
import ReferralsInput from './ReferralsInput'

type Props = {
  data: ReferralsPageData
} & MarginProps

const ReferralsCreateCard = withSuspense(
  ({ data, ...marginProps }: Props) => {
    const {
      referrerCode: referrerCodeData,
      currentEpochReferredTradersCount,
      currentEpochReferredTradersRewards,
      currentEpochReferredTradersVolume,
      latestGlobalRewardEpoch,
    } = data
    const isMobile = useIsMobile()
    const { account, connectedAccount } = useWallet()
    const isOwnAccount = !!account && !!connectedAccount && account === connectedAccount
    const [isCreateMode, setIsCreateMode] = useState<boolean>(false)
    const [isInvalidCode, setIsInvalidCode] = useState<boolean>(false)
    const [isTakenCode, setIsTakenCode] = useState<boolean>(false)
    const [referrerCode, setReferrerCode] = useState<string | null | undefined>(null)
    const [isCopied, setIsCopied] = useState(false)

    const [isTermsOpen, setIsTermsOpen] = useState(false)
    const [isReferralTermsAccepted] = useIsReferralTermsAccepted()

    useEffect(() => {
      const showCreateMode = isOwnAccount && !referrerCodeData
      if (showCreateMode) {
        setIsCreateMode(true)
      } else {
        setIsCreateMode(false)
      }
    }, [isOwnAccount, referrerCodeData])

    useEffect(() => {
      if (!!referrerCodeData) {
        setReferrerCode(referrerCodeData)
      } else {
        setReferrerCode('')
      }
    }, [isOwnAccount, referrerCodeData])

    const onChangeReferralCode = useCallback(async (referrerCode: string) => {
      setReferrerCode(referrerCode)
      const isValid = validateReferrerCode(referrerCode)
      if (!isValid) {
        setIsInvalidCode(true)
      } else {
        setIsInvalidCode(false)
        setIsTakenCode(false)
        setReferrerCode(referrerCode)
      }
    }, [])

    const onClickCopy = useCallback((value: string) => {
      copy(value)
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 600)
    }, [])

    const onClickCreate = useCallback(
      async (value: string) => {
        const isAvailable = await checkReferrerCode(value)
        if (!isAvailable) {
          setIsTakenCode(true)
        } else if (isOwnAccount) {
          const createCodeResult = await createReferrerCode(account, value)
          if (createCodeResult) {
            setReferrerCode(createCodeResult)
            setIsCreateMode(false)
          }
        }
      },
      [account, isOwnAccount]
    )

    return (
      <>
        <Card {...marginProps}>
          <CardSection>
            <Text variant="heading" color="text">
              {isCreateMode ? 'Create Code' : 'Code Created'}
            </Text>
            <Text color="errorText" variant="smallMedium" mb={2} height={20}>
              {isInvalidCode
                ? 'Only lowercase letters, numbers and underscores are allowed. Minimum 4 letters.'
                : isTakenCode
                ? 'Referrer code is taken.'
                : ''}
            </Text>
            <Box width="50%">
              <ReferralsInput
                network={latestGlobalRewardEpoch.lyra.network}
                isCopied={isCopied}
                isCreateMode={isCreateMode}
                referrerCode={referrerCode}
                isInvalidCode={isInvalidCode}
                isTakenCode={isTakenCode}
                onClickCopy={onClickCopy}
                onChangeReferralCode={onChangeReferralCode}
                onClickCreate={value => {
                  if (isReferralTermsAccepted) {
                    onClickCreate(value)
                  } else {
                    setIsTermsOpen(true)
                  }
                }}
              />
            </Box>
          </CardSection>
          <CardSeparator isHorizontal />
          <CardSection flexDirection={isMobile ? 'column' : 'row'} noPadding>
            <CardSection isVertical sx={{ flexGrow: 1 }}>
              <Flex mb={8}>
                <Text variant="heading">Your Rewards</Text>
                <Text variant="heading" color="secondaryText">
                  &nbsp; · &nbsp;{formatDate(latestGlobalRewardEpoch.startTimestamp, true)} -{' '}
                  {formatDate(latestGlobalRewardEpoch.endTimestamp, true)}
                </Text>
              </Flex>
              {account ? (
                <>
                  <Grid sx={{ gridTemplateColumns: ['1fr', '1fr 1fr 1fr 1fr'] }}>
                    <LabelItem textVariant="body" label="Referred traders" value={currentEpochReferredTradersCount} />
                    <LabelItem
                      textVariant="body"
                      label="Referred volume"
                      value={formatTruncatedUSD(currentEpochReferredTradersVolume)}
                      valueColor="text"
                    />
                    <LabelItem
                      textVariant="body"
                      label="Pending Rewards"
                      // value={<RewardTokenAmounts tokenAmounts={currentEpochReferredTradersRewards} showDash={false} />}
                      value={'0 stkLYRA'}
                    />
                    <LabelItem
                      textVariant="body"
                      label="Ends In"
                      value={<Countdown timestamp={latestGlobalRewardEpoch.distributionTimestamp} />}
                      valueColor="text"
                    />
                  </Grid>
                </>
              ) : (
                <Flex>
                  <ConnectWalletButton width={150} size="lg" network={latestGlobalRewardEpoch.lyra.network} />
                </Flex>
              )}
            </CardSection>
          </CardSection>
        </Card>
        <ReferralsTermsOfUseModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      </>
    )
  },
  ({ ...marginProps }: Props) => {
    return (
      <Card {...marginProps}>
        <Center height="100%" width="100%">
          <Spinner />
        </Center>
      </Card>
    )
  }
)
export default ReferralsCreateCard
