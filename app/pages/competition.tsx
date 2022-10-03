import { PageId } from '@lyra/app/constants/pages'
import React from 'react'

import MetaTags from '../page_helpers/common/MetaTags'
import CompetitionPageHelper from '../page_helpers/CompetitionPageHelper'
import getPagePath from '../utils/getPagePath'

export default function CompetitionPage(): JSX.Element {
  return (
    <>
      <MetaTags title="Competition" url={getPagePath({ page: PageId.Competition })} />
      <CompetitionPageHelper />
    </>
  )
}
