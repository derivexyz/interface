import { PageId } from '@lyra/app/constants/pages'
import React from 'react'

import RewardsPageHelper from '@/app/page_helpers/RewardsPageHelper'

import MetaTags from '../page_helpers/common/MetaTags'
import getPagePath from '../utils/getPagePath'

export default function RewardsPage(): JSX.Element {
  return (
    <>
      <MetaTags title="Rewards" url={getPagePath({ page: PageId.Rewards })} />
      <RewardsPageHelper />
    </>
  )
}
