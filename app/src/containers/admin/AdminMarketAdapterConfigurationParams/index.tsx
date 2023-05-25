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
import { AdminAdapterMarketConfigurationParams, Market } from '@lyrafinance/lyra-js'
import { SNXPerpV2Adapter } from '@lyrafinance/lyra-js/src/contracts/newport/typechain/NewportSNXPerpV2Adapter'
import { BigNumber } from 'ethers'
import React, { useState } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { TransactionType } from '@/app/constants/screen'
import useAdmin from '@/app/hooks/admin/useAdmin'
import useAdminTransaction from '@/app/hooks/admin/useAdminTransaction'
import fromBigNumber from '@/app/utils/fromBigNumber'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  market: Market
  isExpanded: boolean
  onClickExpand: () => void
}

const zeroDecimalKeys: (keyof AdminAdapterMarketConfigurationParams)[] = []

const AdminMarketAdapterConfigurationParams = ({ market, isExpanded, onClickExpand }: Props) => {
  const admin = useAdmin(market.lyra.network)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [params, setParams] = useState<Partial<AdminAdapterMarketConfigurationParams>>({})
  const [newParams, setNewParams] = useState<Partial<AdminAdapterMarketConfigurationParams>>({})
  const [tx, setTx] = useState<PopulatedTransaction | null>(null)
  const execute = useAdminTransaction(market.lyra.network, market.params.owner)
  if (!market.params.adapterView) {
    return null
  }
  const marketAdapterParams = (market.params.adapterView as SNXPerpV2Adapter.MarketAdapterStateStructOutput)?.config
  const marketAdapterParamsFlat = {
    staticEstimationDiscount: marketAdapterParams.staticEstimationDiscount,
    snxPerpV2MarketAddress: marketAdapterParams.snxPerpV2MarketAddress,
    pool: marketAdapterParams.uniswapInfo.pool,
    feeTier: marketAdapterParams.uniswapInfo.feeTier,
  }
  return (
    <>
      <Collapsible
        onClickHeader={onClickExpand}
        header={<Text variant="cardHeading">Adapter Market Configuration Parameters</Text>}
        isExpanded={isExpanded}
      >
        <Box p={4}>
          {Object.entries(marketAdapterParamsFlat).map(([key, value]) => {
            if (parseInt(key) || parseInt(key) === 0) {
              return
            }
            const typedKey = key as keyof AdminAdapterMarketConfigurationParams
            const isZeroDecimals = zeroDecimalKeys.includes(typedKey)
            if (typeof value === 'string') {
              const val = params[typedKey] ?? ''
              return (
                <Input
                  mb={4}
                  key={key}
                  label={key}
                  value={val.toString()}
                  placeholder={value}
                  onChange={evt => setParams({ ...params, [key]: evt.target.value })}
                />
              )
            } else if (typeof value === 'number') {
              const val = params[typedKey] ?? ''
              return (
                <Input
                  mb={4}
                  key={key}
                  label={key}
                  value={val.toString()}
                  placeholder={value.toString()}
                  onChange={evt => {
                    const toParams = { ...params, [key]: parseFloat(evt.target.value) }
                    if (evt.target.value === '') {
                      delete toParams[typedKey]
                    }
                    setParams(toParams)
                  }}
                />
              )
            }
            const val = (params[typedKey] ?? ZERO_BN) as BigNumber
            return (
              <Flex flexDirection="column" mb={4} key={key}>
                <BigNumberInput
                  decimals={isZeroDecimals ? 0 : 18}
                  label={key}
                  min={ZERO_BN}
                  value={val}
                  key={key}
                  placeholder={isZeroDecimals ? fromBigNumber(value, 0).toString() : value}
                  onEmpty={() => {
                    const toParams = { ...params }
                    delete toParams[typedKey]
                    setParams(toParams)
                  }}
                  onChange={val => {
                    const newParams = {
                      ...params,
                      [key]: val,
                    }
                    setParams(newParams)
                  }}
                />
              </Flex>
            )
          })}
          <Button
            width={200}
            size="lg"
            variant="primary"
            label="Update"
            onClick={async () => {
              const { tx, params: newParams } = await admin.setAdapterMarketConfigurationParams(market.address, params)
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
        title="Confirm New Adapter Market Configuration Params"
        desktopWidth={700}
      >
        <CardBody>
          <Box>
            {newParams
              ? Object.entries(newParams).map(([key, value]) => {
                  if (parseInt(key) || parseInt(key) === 0) {
                    return
                  }
                  const typedKey = key as keyof AdminAdapterMarketConfigurationParams
                  const isZeroDecimals = zeroDecimalKeys.includes(typedKey)
                  const val = value ?? ZERO_BN
                  return (
                    <Flex my={2} key={key} justifyContent="space-between">
                      <Text color="secondaryText">{key}</Text>
                      {typeof val === 'string' || typeof val === 'number' ? (
                        <Text ml={1}>{val}</Text>
                      ) : (
                        <Text ml={1}>
                          {formatNumber(fromBigNumber(val as BigNumber, isZeroDecimals ? 0 : 18), { minDps: 0 })}
                        </Text>
                      )}
                    </Flex>
                  )
                })
              : null}
          </Box>
          <TransactionButton
            transactionType={TransactionType.Admin}
            network={market.lyra.network}
            width="100%"
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

export default AdminMarketAdapterConfigurationParams
