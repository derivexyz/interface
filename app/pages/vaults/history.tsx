import { PageId } from '@lyra/app/constants/pages'
import React from 'react'

import MetaTags from '@/app/page_helpers/common/MetaTags'
import VaultsHistoryPageHelper from '@/app/page_helpers/VaultsHistoryPageHelper'
import getPagePath from '@/app/utils/getPagePath'

export default function VaultsHistoryPage(): JSX.Element {
  return (
    <>
      <MetaTags title="Vaults History" url={getPagePath({ page: PageId.VaultsHistory })} />
      <VaultsHistoryPageHelper />
    </>
  )
}
