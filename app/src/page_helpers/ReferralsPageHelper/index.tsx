import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import Link from '@lyra/ui/components/Link'
import Text from '@lyra/ui/components/Text'
import React from 'react'

import ReferralsTable from '@/app/components/common/ReferralsTable'
import { REFERRALS_DOC_URL, REFERRALS_TERMS_URL } from '@/app/constants/links'
import { PageId } from '@/app/constants/pages'
import ReferralsCreateCard from '@/app/containers/referrals/ReferralsCreateCard'
import ReferralsHeaderCard from '@/app/containers/referrals/ReferralsHeaderCard'
import { ReferralsPageData } from '@/app/hooks/referrals/useReferralsPageData'
import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'
import getPagePath from '@/app/utils/getPagePath'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

type Props = {
  data: ReferralsPageData
}

const ReferralsPageHelper = ({ data }: Props): JSX.Element => {
  const { latestGlobalRewardEpoch, allReferredTraders, referrerCode } = data
  return (
    <Page
      title="Referrals"
      subtitle="Refer traders to earn rewards"
      headerCard={<ReferralsHeaderCard data={data} />}
      showBackButton
      backHref={getPagePath({ page: PageId.RewardsIndex })}
    >
      <PageGrid>
        <Flex flexDirection="column">
          <Text variant="heading">
            Referrals
            <Text color="secondaryText" as="span">
              &nbsp;·&nbsp;{getNetworkDisplayName(latestGlobalRewardEpoch.lyra.network)}
            </Text>
          </Text>
          <Text color="secondaryText" mt={4}>
            Share your unique referral link with traders to earn rewards from their trading fees.{' '}
            <Link color="primaryText" href={REFERRALS_DOC_URL} target="_blank">
              Learn more
            </Link>{' '}
            and read our{' '}
            <Link color="primaryText" href={REFERRALS_TERMS_URL} target="_blank">
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
          <Card>
            <CardBody>
              <Text variant="small" color="secondaryText">
                You haven't referred any traders.
              </Text>
            </CardBody>
          </Card>
        )}
      </PageGrid>
    </Page>
  )
}

export default ReferralsPageHelper
