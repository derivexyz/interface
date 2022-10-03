import { PageId } from '@lyra/app/constants/pages'
import React from 'react'

import MetaTags from '../page_helpers/common/MetaTags'
import VaultsIndexPageHelper from '../page_helpers/VaultsIndexPageHelper'
import getPagePath from '../utils/getPagePath'

export default function VaultsIndexPage(): JSX.Element {
  return (
    <>
      <MetaTags title="Vaults" url={getPagePath({ page: PageId.VaultsIndex })} />
      <VaultsIndexPageHelper />
    </>
  )
}
