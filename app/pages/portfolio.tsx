import { PageId } from '@lyra/app/constants/pages'
import React from 'react'

import PortfolioPageHelper from '@/app/page_helpers/PortfolioPageHelper'

import MetaTags from '../page_helpers/common/MetaTags'
import getPagePath from '../utils/getPagePath'

export default function PortfolioPage(): JSX.Element {
  return (
    <>
      <MetaTags title="Portfolio" url={getPagePath({ page: PageId.Portfolio })} />
      <PortfolioPageHelper />
    </>
  )
}
