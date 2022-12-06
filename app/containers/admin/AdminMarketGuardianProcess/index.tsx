import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Collapsible from '@lyra/ui/components/Collapsible'
import Flex from '@lyra/ui/components/Flex'
import Shimmer from '@lyra/ui/components/Shimmer'
import Text from '@lyra/ui/components/Text'
import formatDateTime from '@lyra/ui/utils/formatDateTime'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Market } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'

import { UNIT } from '@/app/constants/bn'
import useAdmin from '@/app/hooks/admin/useAdmin'
import useGlobalCache, { useMutateGlobalCache } from '@/app/hooks/admin/useGlobalCache'
import withSuspense from '@/app/hooks/data/withSuspense'
import useMarketOwner from '@/app/hooks/market/useMarketOwner'
import useAdminTransaction from '@/app/hooks/transaction/useAdminTransaction'
import useWalletAccount from '@/app/hooks/wallet/useWalletAccount'
import fromBigNumber from '@/app/utils/fromBigNumber'

type Props = {
  market: Market
  isExpanded: boolean
  onClickExpand: () => void
  onParamUpdate: () => void
}

const QUEUE_LIMIT = 100

const AdminMarketGuardianProcess = withSuspense(
  ({ market, isExpanded, onClickExpand, onParamUpdate }: Props) => {
    const account = useWalletAccount()
    const admin = useAdmin()
    const owner = useMarketOwner(market.name)
    const globalCache = useGlobalCache(market.address)
    const mutateGlobalCache = useMutateGlobalCache(market.address)
    const [isDepositsLoading, setIsDespositsLoading] = useState(false)
    const [isWithdrawalsLoading, setIsWithdrawalsLoading] = useState(false)
    const execute = useAdminTransaction(owner)
    if (!market) {
      return null
    }
    const pctPriceChange = market.spotPrice
      .sub(globalCache?.minUpdatedAtPrice ?? 0)
      .mul(UNIT)
      .div(market.spotPrice)
    return (
      <>
        <Box my={2}>
          <Collapsible
            onClickHeader={onClickExpand}
            header={<Text variant="heading2">Guardian Process</Text>}
            isExpanded={isExpanded}
          >
            <Box px={4}>
              <Flex flexDirection="column" my={2}>
                <Box mb={2}>
                  <Text variant="secondary" color="secondaryText">
                    Cache is{' '}
                    <Text as="span" color={globalCache?.isGlobalCacheStale ? 'warningText' : 'primaryText'}>
                      {globalCache?.isGlobalCacheStale ? 'stale' : 'not stale'}
                    </Text>
                  </Text>
                  <Text variant="secondary" color="secondaryText">
                    Last updated at: {formatDateTime(globalCache?.minUpdatedAt.toNumber() ?? 0, false, false)}
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

                <Flex my={2}>
                  <Button
                    isDisabled={!account || globalCache?.isGlobalCacheStale}
                    variant="primary"
                    isLoading={isDepositsLoading}
                    label={`Process next ${QUEUE_LIMIT} deposits`}
                    onClick={async () => {
                      if (!account || !admin) {
                        return
                      }
                      setIsDespositsLoading(true)
                      const tx = admin.processDepositQueue(market, account, QUEUE_LIMIT)
                      if (tx) {
                        execute(tx, {
                          onComplete: () => {
                            onParamUpdate()
                            mutateGlobalCache()
                            setIsDespositsLoading(false)
                          },
                          onError: () => {
                            setIsDespositsLoading(false)
                          },
                        })
                      }
                      setIsDespositsLoading(false)
                    }}
                  />
                </Flex>
                <Flex>
                  <Button
                    isDisabled={!account || globalCache?.isGlobalCacheStale}
                    isLoading={isWithdrawalsLoading}
                    variant="primary"
                    label={`Process next ${QUEUE_LIMIT} withdrawals`}
                    onClick={async () => {
                      if (!account || !admin) {
                        return
                      }
                      setIsWithdrawalsLoading(true)
                      const tx = admin.processWithdrawalQueue(market, account, QUEUE_LIMIT)
                      if (tx) {
                        execute(tx, {
                          onComplete: () => {
                            onParamUpdate()
                            mutateGlobalCache()
                            setIsWithdrawalsLoading(false)
                          },
                          onError: () => {
                            setIsWithdrawalsLoading(false)
                          },
                        })
                      }
                      setIsWithdrawalsLoading(false)
                    }}
                  />
                </Flex>
              </Flex>
            </Box>
          </Collapsible>
        </Box>
      </>
    )
  },
  () => <Shimmer height={56} my={2} />
)

export default AdminMarketGuardianProcess
