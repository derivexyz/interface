import { PopulatedTransaction } from '@ethersproject/contracts'
import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Collapsible from '@lyra/ui/components/Collapsible'
import Flex from '@lyra/ui/components/Flex'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import Modal from '@lyra/ui/components/Modal'
import Shimmer from '@lyra/ui/components/Shimmer'
import Text from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import { Market, PoolHedgerParams } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import withSuspense from '@/app/hooks/data/withSuspense'
import useMarketOwner from '@/app/hooks/market/useMarketOwner'
import useAdminTransaction from '@/app/hooks/transaction/useAdminTransaction'
import useWallet from '@/app/hooks/wallet/useWallet'
import fromBigNumber from '@/app/utils/fromBigNumber'

type Props = {
  market: Market
  isExpanded: boolean
  onClickExpand: () => void
  onParamUpdate: () => void
}

const zeroDecimalKeys: (keyof PoolHedgerParams)[] = ['interactionDelay']

const AdminMarketPoolHedgerParams = withSuspense(
  ({ market, isExpanded, onClickExpand, onParamUpdate }: Props) => {
    const { account, isConnected } = useWallet()
    const owner = useMarketOwner(market.name)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [params, setParams] = useState<Partial<PoolHedgerParams>>({})
    const [newParams, setNewParams] = useState<Partial<PoolHedgerParams>>({})
    const [tx, setTx] = useState<PopulatedTransaction | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const execute = useAdminTransaction(owner)
    if (!market) {
      return null
    }
    return (
      <>
        <Box my={2}>
          <Collapsible
            header={<Text variant="heading2">Pool Hedger Parameters</Text>}
            onClickHeader={onClickExpand}
            isExpanded={isExpanded}
          >
            <Box px={4}>
              {Object.entries(market.marketParameters.poolHedgerParams).map(([key, value]) => {
                if (parseInt(key) || parseInt(key) === 0) {
                  return
                }
                const typedKey = key as keyof PoolHedgerParams
                const isZeroDecimals = zeroDecimalKeys.includes(typedKey)
                const val = params[typedKey] ?? ZERO_BN
                return (
                  <Flex flexDirection="column" my={2} key={key}>
                    <BigNumberInput
                      isDisabled={isLoading}
                      decimals={isZeroDecimals ? 0 : 18}
                      label={key}
                      value={val}
                      key={key}
                      placeholder={isZeroDecimals ? fromBigNumber(value, 0).toString() : value}
                      onEmpty={() => {
                        const toParams = { ...params }
                        delete toParams[typedKey]
                        setParams(toParams)
                      }}
                      onChange={val => {
                        const toParams = {
                          ...params,
                          [key]: val,
                        }
                        setParams(toParams)
                      }}
                    />
                  </Flex>
                )
              })}
              <Button
                label="Update"
                isDisabled={!isConnected}
                isLoading={isLoading}
                onClick={async () => {
                  if (!account) {
                    return
                  }
                  setIsLoading(true)
                  const { tx, params: newParams } = await market.setPoolHedgerParams(account, params)
                  setIsLoading(false)
                  setNewParams(newParams)
                  setTx(tx)
                  setIsConfirmOpen(true)
                }}
              />
            </Box>
          </Collapsible>
        </Box>
        <Modal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          title="Confirm New Pool Hedger Parameters"
        >
          <CardBody>
            <Box px={4}>
              {newParams
                ? Object.entries(newParams).map(([key, value]) => {
                    if (parseInt(key) || parseInt(key) === 0) {
                      return
                    }
                    const typedKey = key as keyof PoolHedgerParams
                    const isZeroDecimals = zeroDecimalKeys.includes(typedKey)
                    const val = value ?? ZERO_BN
                    return (
                      <Flex my={2} key={key} justifyContent="space-between">
                        <Text color="secondaryText">{key}</Text>
                        <Text ml={1}>{formatNumber(fromBigNumber(val, isZeroDecimals ? 0 : 18), { minDps: 0 })}</Text>
                      </Flex>
                    )
                  })
                : null}
            </Box>
            <Button
              my={4}
              variant="primary"
              label="Confirm"
              onClick={() => {
                if (tx) {
                  setIsLoading(true)
                  execute(tx, {
                    onComplete: () => {
                      onParamUpdate()
                      setIsLoading(false)
                      setIsConfirmOpen(false)
                    },
                    onError: () => {
                      setIsLoading(false)
                    },
                  })
                }
              }}
            />
          </CardBody>
        </Modal>
      </>
    )
  },
  () => <Shimmer height={56} my={2} />
)

export default AdminMarketPoolHedgerParams
