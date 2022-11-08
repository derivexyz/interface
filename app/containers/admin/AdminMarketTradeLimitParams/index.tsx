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
import { Market, TradeLimitParams } from '@lyrafinance/lyra-js'
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

const zeroDecimalKeys: (keyof TradeLimitParams)[] = ['tradingCutoff']

const AdminMarketTradeLimitParams = withSuspense(
  ({ market, isExpanded, onClickExpand, onParamUpdate }: Props) => {
    const { account, isConnected } = useWallet()
    const owner = useMarketOwner(market.name)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [params, setParams] = useState<Partial<TradeLimitParams>>({})
    const [newParams, setNewParams] = useState<Partial<TradeLimitParams>>({})
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
            header={<Text variant="heading2">Trade Limit Parameters</Text>}
            onClickHeader={onClickExpand}
            isExpanded={isExpanded}
          >
            <Box px={4}>
              {Object.entries(market.marketParameters.tradeLimitParams).map(([key, value]) => {
                if (parseInt(key) || parseInt(key) === 0) {
                  return
                }
                const typedKey = key as keyof TradeLimitParams
                const isZeroDecimals = zeroDecimalKeys.includes(typedKey)
                const toVal = params[typedKey] ?? ZERO_BN
                if (typeof value === 'boolean' || typeof toVal === 'boolean') {
                  return (
                    <Box key={key} my={2}>
                      <Text color="secondaryText" variant="small">
                        {typedKey}
                      </Text>
                      <ToggleButton my={2}>
                        <ToggleButtonItem
                          id="false"
                          label="false"
                          isSelected={toVal.toString() === 'false'}
                          onSelect={() => {
                            setParams({ ...params, [key]: false })
                          }}
                        />
                        <ToggleButtonItem
                          id="true"
                          label="true"
                          isSelected={toVal.toString() === 'true'}
                          onSelect={() => {
                            setParams({ ...params, [key]: true })
                          }}
                        />
                      </ToggleButton>
                    </Box>
                  )
                }
                return (
                  <Flex flexDirection="column" my={2} key={key}>
                    <BigNumberInput
                      isDisabled={isLoading}
                      decimals={isZeroDecimals ? 0 : 18}
                      label={key}
                      value={toVal}
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
                  const { tx, params: newParams } = await market.setTradeLimitParams(account, params)
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
          title="Confirm New Trade Limit Parameters"
        >
          <CardBody>
            <Box>
              {newParams
                ? Object.entries(newParams).map(([key, value]) => {
                    if (parseInt(key) || parseInt(key) === 0) {
                      return
                    }
                    const typedKey = key as keyof TradeLimitParams
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

export default AdminMarketTradeLimitParams
