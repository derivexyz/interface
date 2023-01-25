import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Text from '@lyra/ui/components/Text'
import { Market } from '@lyrafinance/lyra-js'
import React from 'react'

import { TransactionType } from '@/app/constants/screen'
import useAdmin from '@/app/hooks/admin/useAdmin'
import useAdminTransaction from '@/app/hooks/admin/useAdminTransaction'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  market: Market
}

const AdminMarketPauseButton = ({ market }: Props) => {
  const admin = useAdmin(market.lyra.network)
  const execute = useAdminTransaction(market.lyra.network, market.params.owner)
  return (
    <Card>
      <CardBody>
        <Text mb={6} variant="heading">
          Market Paused: {market.params.isMarketPaused.toString()}
        </Text>
        <TransactionButton
          transactionType={TransactionType.Admin}
          network={market.lyra.network}
          width={200}
          label={market.params.isMarketPaused ? 'Unpause Market' : 'Pause Market'}
          onClick={async () => {
            const tx = await admin.setMarketPaused(market.address, !market.params.isMarketPaused)
            await execute(tx)
          }}
        />
      </CardBody>
    </Card>
  )
}

export default AdminMarketPauseButton
