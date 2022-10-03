import { PageId } from '@lyra/app/constants/pages'
import React from 'react'

import MetaTags from '@/app/page_helpers/common/MetaTags'
import HistoryPageHelper from '@/app/page_helpers/HistoryPageHelper'
import getPagePath from '@/app/utils/getPagePath'

export default function HistoryPage(): JSX.Element {
  return (
    <>
      <MetaTags title="History" url={getPagePath({ page: PageId.History })} />
      <HistoryPageHelper />
    </>
  )
}
