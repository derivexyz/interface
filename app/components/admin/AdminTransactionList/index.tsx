import { BigNumber } from '@ethersproject/bignumber'
import List from '@lyra/ui/components/List'
import React from 'react'

import AdminTransactionListItem from '@/app/containers/admin/AdminTransactionListItem'

type Props = {
  transactionIds: BigNumber[]
  onConfirm: () => void
}

const AdminTransactionList = ({ transactionIds, onConfirm }: Props) => {
  return (
    <List>
      {transactionIds
        ? transactionIds.map(transactionId => (
            <AdminTransactionListItem
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
