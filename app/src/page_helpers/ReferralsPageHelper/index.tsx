import Flex from '@lyra/ui/components/Flex'
import Link from '@lyra/ui/components/Link'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'

import ReferralsTable from '@/app/components/common/ReferralsTable'
import { REFERRALS_DOC_URL, REFERRALS_TERMS_URL } from '@/app/constants/links'
import ReferralsCreateCard from '@/app/containers/referrals/ReferralsCreateCard'
import ReferralsPageHeader from '@/app/containers/referrals/ReferralsPageHeader'
import { ReferralsPageData } from '@/app/hooks/referrals/useReferralsPageData'
import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

type Props = {
  data: ReferralsPageData
} & MarginProps

const ReferralsPageHelper = ({ data, ...marginProps }: Props): JSX.Element => {
  const { latestGlobalRewardEpoch, allReferredTraders, referrerCode } = data
  const isMobile = useIsMobile()
  return (
    <Page noHeaderPadding header={!isMobile ? <ReferralsPageHeader data={data} /> : null} {...marginProps}>
      <PageGrid>
        {isMobile ? <ReferralsPageHeader data={data} /> : null}
        <Flex flexDirection="column">
          <Flex mx={[6, 0]} mb={[2, 0]}>
            <Text variant="title">Referrals</Text>
            <Text color="secondaryText" variant="title">
              &nbsp;·&nbsp;{getNetworkDisplayName(latestGlobalRewardEpoch.lyra.network)}
            </Text>
          </Flex>
          <Text variant="secondary" color="secondaryText" mt={4}>
            Share your unique referral link with traders to earn rewards from their trading fees.{' '}
            <Link color="primaryText" textVariant="secondary" href={REFERRALS_DOC_URL} target="_blank">
              Learn more
            </Link>{' '}
            and read our{' '}
            <Link color="primaryText" textVariant="secondary" href={REFERRALS_TERMS_URL} target="_blank">
              Referral Terms
            </Link>
            .
          </Text>
        </Flex>
        <ReferralsCreateCard key={referrerCode} data={data} />
        <Text variant="heading" color="text" mt={[4, 8]} ml={[4, 0]}>
          Traders you referred
        </Text>
        {allReferredTraders && Object.values(allReferredTraders).length > 0 ? (
          <ReferralsTable referredTraders={allReferredTraders} />
        ) : (
          <Text variant="body" color="secondaryText">
            No traders referred.
          </Text>
        )}
      </PageGrid>
    </Page>
  )
}

export default ReferralsPageHelper
