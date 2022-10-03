import { PageId } from '@lyra/app/constants/pages'
import React from 'react'

import RewardsHistoryPageHelper from '@/app/page_helpers/RewardsHistoryPageHelper'

import MetaTags from '../../page_helpers/common/MetaTags'
import getPagePath from '../../utils/getPagePath'

export default function RewardsHistoryPage(): JSX.Element {
  return (
    <>
      <MetaTags title="Rewards History" url={getPagePath({ page: PageId.RewardsHistory })} />
      <RewardsHistoryPageHelper />
    </>
  )
}
