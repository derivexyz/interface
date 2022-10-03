import React from 'react'

import { PageId } from '../constants/pages'
import MetaTags from '../page_helpers/common/MetaTags'
import StortyBookPageHelper from '../page_helpers/StortyBookPageHelper'
import getPagePath from '../utils/getPagePath'

export default function StorybookPage(): JSX.Element {
  return (
    <>
      <MetaTags title="Storybook" url={getPagePath({ page: PageId.Storybook })} />
      <StortyBookPageHelper />
    </>
  )
}
