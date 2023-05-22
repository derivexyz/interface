import { PopulatedTransaction } from '@ethersproject/contracts'
import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import ToggleButton from '@lyra/ui/components/Button/ToggleButton'
import ToggleButtonItem from '@lyra/ui/components/Button/ToggleButtonItem'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Collapsible from '@lyra/ui/components/Collapsible'
import Flex from '@lyra/ui/components/Flex'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import Modal from '@lyra/ui/components/Modal'
import Shimmer from '@lyra/ui/components/Shimmer'
import Text from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import { FuturesPoolHedgerParams, Market } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { TransactionType } from '@/app/constants/screen'
import useAdmin from '@/app/hooks/admin/useAdmin'
import useAdminTransaction from '@/app/hooks/admin/useAdminTransaction'
import withSuspense from '@/app/hooks/data/withSuspense'
import fromBigNumber from '@/app/utils/fromBigNumber'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  market: Market
  isExpanded: boolean
  onClickExpand: () => void
}

const zeroDecimalKeys: (keyof FuturesPoolHedgerParams)[] = ['minCancelDelay']

const AdminMarketFuturesPoolHedgerParams = withSuspense(
  ({ market, isExpanded, onClickExpand }: Props) => {
    const admin = useAdmin(market.lyra.network)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [params, setParams] = useState<Partial<FuturesPoolHedgerParams>>({})
    const [newParams, setNewParams] = useState<Partial<FuturesPoolHedgerParams>>({})
    const [tx, setTx] = useState<PopulatedTransaction | null>(null)
    const execute = useAdminTransaction(market.lyra.network, market.params.owner)
    if (!market.params.hedgerView) {
      return null
    }
    return (
      <>
        <Collapsible
          header={<Text variant="cardHeading">Futures Pool Hedger Parameters</Text>}
          onClickHeader={onClickExpand}
          isExpanded={isExpanded}
        >
          <Box p={4}>
            {Object.entries(market.params.hedgerView.futuresPoolHedgerParams ?? {}).map(([key, value]) => {
              if (parseInt(key) || parseInt(key) === 0) {
                return
              }

              const typedKey = key as keyof FuturesPoolHedgerParams
              const isZeroDecimals = zeroDecimalKeys.includes(typedKey)
              const val = params[typedKey] ?? ZERO_BN

              if (typeof value === 'boolean' || typeof val === 'boolean') {
                return (
                  <Box key={key} mb={4}>
                    <Text color="secondaryText" variant="small">
                      {typedKey}
                    </Text>
                    <ToggleButton my={2}>
                      <ToggleButtonItem
                        id="false"
                        label="false"
                        isSelected={val.toString() === 'false'}
                        onSelect={() => {
                          setParams({ ...params, [key]: false })
                        }}
                      />
                      <ToggleButtonItem
                        id="true"
                        label="true"
                        isSelected={val.toString() === 'true'}
                        onSelect={() => {
                          setParams({ ...params, [key]: true })
                        }}
                      />
                    </ToggleButton>
                  </Box>
                )
              }

              return (
                <Flex flexDirection="column" mb={4} key={key}>
                  <BigNumberInput
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
              size="lg"
              variant="primary"
              width={200}
              onClick={async () => {
                const { tx, params: newParams } = await admin.setFuturesPoolHedgerParams(market.address, params)
                setNewParams(newParams)
                setTx(tx)
                setIsConfirmOpen(true)
              }}
            />
          </Box>
        </Collapsible>
        <Modal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          title="Confirm New Futures Pool Hedger Parameters"
        >
          <CardBody>
            <Box px={4}>
              {newParams
                ? Object.entries(newParams).map(([key, value]) => {
                    if (parseInt(key) || parseInt(key) === 0) {
                      return
                    }
                    const typedKey = key as keyof FuturesPoolHedgerParams
                    const isZeroDecimals = zeroDecimalKeys.includes(typedKey)
                    const val = value ?? ZERO_BN
                    return (
                      <Flex my={2} key={key} justifyContent="space-between">
                        <Text color="secondaryText">{key}</Text>
                        {typeof val === 'boolean' ? (
                          <Text>{val.toString()}</Text>
                        ) : (
                          <Text ml={1}>{formatNumber(fromBigNumber(val, isZeroDecimals ? 0 : 18), { minDps: 0 })}</Text>
                        )}
                      </Flex>
                    )
                  })
                : null}
            </Box>
            <TransactionButton
              transactionType={TransactionType.Admin}
              network={market.lyra.network}
              label="Confirm"
              onClick={async () => {
                if (tx) {
                  await execute(tx)
                  setIsConfirmOpen(false)
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

export default AdminMarketFuturesPoolHedgerParams
