import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import { PageId } from '../constants/pages'
import getPagePath from '../utils/getPagePath'
import PortfolioPage from './portfolio'

export default function PortfolioRedirect(): JSX.Element {
  const { push } = useRouter()
  useEffect(() => {
    push(getPagePath({ page: PageId.Portfolio }), undefined, { shallow: true })
  }, [push])
  return <PortfolioPage />
}
