import Box from '@lyra/ui/components/Box'
import Collapsible from '@lyra/ui/components/Collapsible'
import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import formatDateTime from '@lyra/ui/utils/formatDateTime'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { AdminMarketGlobalCache, Market } from '@lyrafinance/lyra-js'
import React from 'react'

import { UNIT } from '@/app/constants/bn'
import { TransactionType } from '@/app/constants/screen'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import useAdmin from '@/app/hooks/admin/useAdmin'
import useAdminTransaction from '@/app/hooks/admin/useAdminTransaction'
import fromBigNumber from '@/app/utils/fromBigNumber'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  market: Market
  globalCache: AdminMarketGlobalCache
  isExpanded: boolean
  onClickExpand: () => void
}

const QUEUE_LIMIT = 100

const AdminMarketGuardianProcess = ({ market, globalCache, isExpanded, onClickExpand }: Props) => {
  const account = useWalletAccount()
  const admin = useAdmin(market.lyra.network)
  const execute = useAdminTransaction(market.lyra.network, market.params.owner)
  const pctPriceChange = market.spotPrice
    .sub(globalCache?.minUpdatedAtPrice ?? 0)
    .mul(UNIT)
    .div(market.spotPrice)
  return (
    <Collapsible
      onClickHeader={onClickExpand}
      header={<Text variant="heading2">Guardian Process</Text>}
      isExpanded={isExpanded}
    >
      <Box p={6}>
        <Flex flexDirection="column">
          <Box mb={4}>
            <Text variant="secondary" color="secondaryText">
              Cache is{' '}
              <Text as="span" color={globalCache?.isGlobalCacheStale ? 'warningText' : 'primaryText'}>
                {globalCache?.isGlobalCacheStale ? 'stale' : 'not stale'}
              </Text>
            </Text>
            <Text variant="secondary" color="secondaryText">
              Last updated at:{' '}
              {formatDateTime(globalCache?.minUpdatedAt.toNumber() ?? 0, { hideYear: true, hideMins: false })}
            </Text>
            <Text variant="secondary" color="secondaryText">
              Current spot price: {formatUSD(market.spotPrice)}
            </Text>
            <Text variant="secondary" color="secondaryText">
              Spot price at last update: {formatUSD(globalCache?.maxUpdatedAtPrice ?? 0)}
            </Text>
            <Text variant="secondary" color="secondaryText">
              {formatPercentage(fromBigNumber(pctPriceChange))} spot move since last update
            </Text>
          </Box>
          <Flex mb={4}>
            <TransactionButton
              mr={4}
              transactionType={TransactionType.Admin}
              network={market.lyra.network}
              isDisabled={!account || globalCache?.isGlobalCacheStale}
              label={`Process next ${QUEUE_LIMIT} deposits`}
              onClick={async () => {
                const tx = await admin.processDepositQueue(market.address, QUEUE_LIMIT)
                await execute(tx)
              }}
            />
            <TransactionButton
              transactionType={TransactionType.Admin}
              network={market.lyra.network}
              isDisabled={!account || globalCache?.isGlobalCacheStale}
              label={`Process next ${QUEUE_LIMIT} withdrawals`}
              onClick={async () => {
                const tx = await admin.processWithdrawalQueue(market.address, QUEUE_LIMIT)
                await execute(tx)
              }}
            />
          </Flex>
        </Flex>
      </Box>
    </Collapsible>
  )
}

export default AdminMarketGuardianProcess
