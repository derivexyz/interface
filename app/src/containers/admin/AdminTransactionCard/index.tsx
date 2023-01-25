import IconButton from '@lyra/ui/components/Button/IconButton'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import { Network } from '@lyrafinance/lyra-js'
import React from 'react'
import { useState } from 'react'

import AdminTransactionList from '@/app/components/admin/AdminTransactionList'
import { ZERO_BN } from '@/app/constants/bn'
import { ADMIN_TRANSACTIONS_CARD_WIDTH } from '@/app/constants/layout'
import useMultiSigTransactionCount, {
  useMutateMultiSigTransactionCount,
} from '@/app/hooks/admin/useMultiSigTransactionCount'
import useMultiSigTransactionIds, { useMutateMultiSigTransactionIds } from '@/app/hooks/admin/useMultiSigTransactionIds'
import withSuspense from '@/app/hooks/data/withSuspense'
import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'

export const NUM_TRANSACTIONS = 20

type Props = { network: Network; globalOwner: string }

const AdminTransactionCard = withSuspense(
  ({ network, globalOwner }: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const transactionCount = useMultiSigTransactionCount(network, globalOwner)
    const mutateTransactionCount = useMutateMultiSigTransactionCount(network, globalOwner)
    const _from = transactionCount?.sub(NUM_TRANSACTIONS) ?? ZERO_BN
    const from = _from.lt(ZERO_BN) ? ZERO_BN : _from
    const transactionIds = useMultiSigTransactionIds(network, globalOwner, from, transactionCount ?? ZERO_BN) ?? []
    const mutateTransactionIds = useMutateMultiSigTransactionIds(
      network,
      globalOwner,
      from,
      transactionCount ?? ZERO_BN
    )
    return (
      <Card width={ADMIN_TRANSACTIONS_CARD_WIDTH}>
        <CardBody noPadding>
          <Flex alignItems="center" p={6}>
            <Text variant="heading">
              {getNetworkDisplayName(network)} Transactions ({transactionCount?.toNumber() ?? 0})
            </Text>
            <IconButton
              ml="auto"
              icon={IconType.Refresh}
              isLoading={isLoading}
              onClick={async () => {
                setIsLoading(true)
                await Promise.all([mutateTransactionCount(), mutateTransactionIds()])
                setIsLoading(false)
              }}
            />
          </Flex>
          <AdminTransactionList
            network={network}
            globalOwner={globalOwner}
            transactionIds={transactionIds}
            onConfirm={() => {
              mutateTransactionCount()
              mutateTransactionIds()
            }}
          />
        </CardBody>
      </Card>
    )
  },
  () => (
    <Card width={ADMIN_TRANSACTIONS_CARD_WIDTH}>
      <CardBody>
        <Center height="100%">
          <Spinner />
        </Center>
      </CardBody>
    </Card>
  )
)

export default AdminTransactionCard
