import React from 'react'

import { PageId } from '../constants/pages'
import LayoutPageError from '../page_helpers/common/Layout/LayoutPageError'
import MetaTags from '../page_helpers/common/MetaTags'
import getPagePath from '../utils/getPagePath'

export default function NotFoundPage(): JSX.Element {
  return (
    <>
      <MetaTags title="Not Found" url={getPagePath({ page: PageId.NotFound })} />
      <LayoutPageError error="Page not found" />
    </>
  )
}
