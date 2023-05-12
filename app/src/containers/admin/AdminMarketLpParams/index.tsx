import { BigNumber } from '@ethersproject/bignumber'
import { PopulatedTransaction } from '@ethersproject/contracts'
import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Collapsible from '@lyra/ui/components/Collapsible'
import Flex from '@lyra/ui/components/Flex'
import Input from '@lyra/ui/components/Input'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import Modal from '@lyra/ui/components/Modal'
import Text from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import { AdminLiquidityPoolParams, Market } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { TransactionType } from '@/app/constants/screen'
import TransactionButton from '@/app/containers/common/TransactionButton'
import useAdmin from '@/app/hooks/admin/useAdmin'
import useAdminTransaction from '@/app/hooks/admin/useAdminTransaction'
import fromBigNumber from '@/app/utils/fromBigNumber'

type Props = {
  market: Market
  isExpanded: boolean
  onClickExpand: () => void
}

const zeroDecimalKeys: (keyof AdminLiquidityPoolParams<any>)[] = ['depositDelay', 'withdrawalDelay', 'guardianDelay']

const AdminMarketLpParams = ({ market, isExpanded, onClickExpand }: Props) => {
  const admin = useAdmin(market.lyra.network)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [params, setParams] = useState<Partial<AdminLiquidityPoolParams<any>>>({})
  const [newParams, setNewParams] = useState<Partial<AdminLiquidityPoolParams<any>>>({})
  const [tx, setTx] = useState<PopulatedTransaction | null>(null)
  const execute = useAdminTransaction(market.lyra.network, market.params.owner)
  return (
    <>
      <Collapsible
        header={<Text variant="cardHeading">Liquidity Pool Parameters</Text>}
        isExpanded={isExpanded}
        onClickHeader={onClickExpand}
      >
        <Box p={4}>
          {Object.entries(market.__data.marketParameters.lpParams).map(([key, value]) => {
            if (parseInt(key) || parseInt(key) === 0) {
              return
            }
            const typedKey = key as keyof AdminLiquidityPoolParams<any>
            const isZeroDecimals = zeroDecimalKeys.includes(typedKey)
            if (typeof value === 'string') {
              const val = params[typedKey] ?? ''
              return (
                <Input
                  key={key}
                  label={key}
                  value={val.toString()}
                  placeholder={value}
                  onChange={evt => setParams({ ...params, [key]: evt.target.value })}
                />
              )
            }
            const val = (params[typedKey] ?? ZERO_BN) as BigNumber
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
            width={200}
            size="lg"
            variant="primary"
            onClick={async () => {
              const { tx, params: newParams } = await admin.setLiquidityPoolParams(
                market.lyra.version,
                market.address,
                params
              )
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
        title="Confirm New Liquidity Pools Parameters"
      >
        <CardBody>
          <Box>
            {newParams
              ? Object.entries(newParams).map(([key, value]) => {
                  if (parseInt(key) || parseInt(key) === 0) {
                    return
                  }
                  const typedKey = key as keyof AdminLiquidityPoolParams<any>
                  const isZeroDecimals = zeroDecimalKeys.includes(typedKey)
                  const val = value ?? ZERO_BN
                  return (
                    <Flex my={2} key={key} justifyContent="space-between">
                      <Text color="secondaryText">{key}</Text>
                      {typeof val === 'string' ? (
                        <Text ml={1}>{val}</Text>
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
}

export default AdminMarketLpParams
