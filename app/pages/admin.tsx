import React from 'react'

import { PageId } from '@/app/constants/pages'
import AdminPageHelper from '@/app/page_helpers/AdminPageHelper'

import MetaTags from '../page_helpers/common/MetaTags'
import getPagePath from '../utils/getPagePath'

export default function AdminPage(): JSX.Element {
  return (
    <>
      <MetaTags title="Admin" url={getPagePath({ page: PageId.Admin })} />
      <AdminPageHelper />
    </>
  )
}
