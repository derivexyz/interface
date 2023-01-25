import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Text from '@lyra/ui/components/Text'
import React from 'react'

import { TransactionType } from '@/app/constants/screen'
import useNetwork from '@/app/hooks/account/useNetwork'
import useAdmin from '@/app/hooks/admin/useAdmin'
import useAdminTransaction from '@/app/hooks/admin/useAdminTransaction'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  isGlobalPaused: boolean
  globalOwner: string
}

const AdminGlobalInfo = ({ isGlobalPaused, globalOwner }: Props) => {
  const network = useNetwork()
  const admin = useAdmin(network)
  const execute = useAdminTransaction(network, globalOwner)
  return (
    <Card>
      <CardBody>
        <Text variant="heading" mb={6}>
          Global Paused: {isGlobalPaused?.toString()}
        </Text>
        <TransactionButton
          width={200}
          network={network}
          transactionType={TransactionType.Admin}
          label={isGlobalPaused ? 'Unpause Global' : 'Pause Global'}
          onClick={async () => {
            const tx = await admin.setGlobalPaused(!isGlobalPaused)
            await execute(tx)
          }}
        />
      </CardBody>
    </Card>
  )
}

export default AdminGlobalInfo
