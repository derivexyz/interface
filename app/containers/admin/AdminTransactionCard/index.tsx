import IconButton from '@lyra/ui/components/Button/IconButton'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Collapsible from '@lyra/ui/components/Collapsible'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import React, { useState } from 'react'

import AdminTransactionList from '@/app/components/admin/AdminTransactionList'
import { ZERO_BN } from '@/app/constants/bn'
import useAdminGlobalOwner from '@/app/hooks/admin/useAdminGlobalOwner'
import useMultiSigTransactionCount, {
  useMutateMultiSigTransactionCount,
} from '@/app/hooks/admin/useMultiSigTransactionCount'
import useMultiSigTransactionIds, { useMutateMultiSigTransactionIds } from '@/app/hooks/admin/useMultiSigTransactionIds'
import withSuspense from '@/app/hooks/data/withSuspense'

export const NUM_TRANSACTIONS = 20

type Props = { isCollapsible?: boolean } & MarginProps & LayoutProps

const AdminTransactionCard = withSuspense(
  ({ isCollapsible = false, ...styleProps }: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isExpanded, setIsExpanded] = useState(true)
    const globalOwner = useAdminGlobalOwner()
    const transactionCount = useMultiSigTransactionCount(globalOwner)
    const mutateTransactionCount = useMutateMultiSigTransactionCount(globalOwner)
    const from = transactionCount?.sub(NUM_TRANSACTIONS) ?? ZERO_BN
    const transactionIds = useMultiSigTransactionIds(globalOwner, from, transactionCount ?? ZERO_BN) ?? []
    const mutateTransactionIds = useMutateMultiSigTransactionIds(
      globalOwner,
      from.lt(ZERO_BN) ? ZERO_BN : from,
      transactionCount ?? ZERO_BN
    )
    return (
      <Card {...styleProps}>
        <Collapsible
          isExpanded={isExpanded}
          header={
            <Flex width="100%" alignItems="center">
              <Text variant="heading">Transactions ({transactionCount?.toNumber() ?? 0})</Text>
              {isLoading ? <Spinner ml={2} size="sm" /> : null}
              <IconButton
                ml="auto"
                isDisabled={isLoading}
                icon={IconType.Refresh}
                onClick={async () => {
                  setIsLoading(true)
                  await Promise.all([mutateTransactionCount(), mutateTransactionIds()])
                  setIsLoading(false)
                }}
              />
              {isCollapsible ? (
                <IconButton
                  ml={2}
                  icon={isExpanded ? IconType.Minimize2 : IconType.Expand}
                  onClick={() => setIsExpanded(!isExpanded)}
                />
              ) : null}
            </Flex>
          }
        >
          <AdminTransactionList
            transactionIds={transactionIds}
            onConfirm={() => {
              mutateTransactionCount()
              mutateTransactionIds()
            }}
          />
        </Collapsible>
      </Card>
    )
  },
  ({ isCollapsible, ...styleProps }: Props) => (
    <Card {...styleProps}>
      <CardBody>
        <Text variant="heading">Transactions</Text>
        <Center height="100%">
          <Spinner />
        </Center>
      </CardBody>
    </Card>
  )
)

export default AdminTransactionCard
