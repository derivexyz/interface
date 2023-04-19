import React from 'react'

import withSuspense from '@/app/hooks/data/withSuspense'
import useEscrowPageData from '@/app/hooks/escrow/useEscrowPageData'

import EscrowPageHelper from '../page_helpers/EscrowPageHelper'

const EscrowPage = withSuspense(() => {
  const escrowPageData = useEscrowPageData()
  return <EscrowPageHelper escrowPageData={escrowPageData} />
})

export default EscrowPage
