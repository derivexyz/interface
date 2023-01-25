import { BigNumber } from '@ethersproject/bignumber'
import List from '@lyra/ui/components/List'
import { Network } from '@lyrafinance/lyra-js'
import React from 'react'

import AdminTransactionListItem from '@/app/containers/admin/AdminTransactionListItem'

type Props = {
  network: Network
  globalOwner: string
  transactionIds: BigNumber[]
  onConfirm: () => void
}

const AdminTransactionList = ({ network, globalOwner, transactionIds, onConfirm }: Props) => {
  return (
    <List>
      {transactionIds
        ? transactionIds.map(transactionId => (
            <AdminTransactionListItem
              network={network}
              globalOwner={globalOwner}
              key={transactionId.toNumber()}
              transactionId={transactionId}
              onConfirm={onConfirm}
            />
          ))
        : null}
    </List>
  )
}

export default AdminTransactionList
