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
import { GreekCacheParams, Market } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import useAdmin from '@/app/hooks/admin/useAdmin'
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

const zeroDecimalKeys: (keyof GreekCacheParams)[] = [
  'maxStrikesPerBoard',
  'staleUpdateDuration',
  'varianceIvGWAVPeriod',
  'varianceSkewGWAVPeriod',
  'optionValueIvGWAVPeriod',
  'optionValueSkewGWAVPeriod',
]

const AdminMarketGreekCacheParams = withSuspense(
  ({ market, isExpanded, onClickExpand, onParamUpdate }: Props) => {
    const { account, isConnected } = useWallet()
    const admin = useAdmin()
    const owner = useMarketOwner(market.name)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [params, setParams] = useState<Partial<GreekCacheParams>>({})
    const [newParams, setNewParams] = useState<Partial<GreekCacheParams>>({})
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
            onClickHeader={onClickExpand}
            header={<Text variant="heading2">Greek Cache Parameters</Text>}
            isExpanded={isExpanded}
          >
            <Box px={6}>
              {Object.entries(market.marketParameters.greekCacheParams).map(([key, value]) => {
                if (parseInt(key) || parseInt(key) === 0) {
                  return
                }
                const typedKey = key as keyof GreekCacheParams
                const isZeroDecimals = zeroDecimalKeys.includes(typedKey)
                const val = params[typedKey] ?? ZERO_BN
                return (
                  <Flex flexDirection="column" my={2} key={key}>
                    <BigNumberInput
                      isDisabled={isLoading}
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
                        const newGreekCacheParams = {
                          ...params,
                          [key]: val,
                        }
                        setParams(newGreekCacheParams)
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
                  if (!account || !admin) {
                    return
                  }
                  setIsLoading(true)
                  const { tx, params: newParams } = await admin.setGreekCacheParams(market, account, params)
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
          title="Confirm New Greek Cache Parameters"
        >
          <CardBody>
            <Box>
              {newParams
                ? Object.entries(newParams).map(([key, value]) => {
                    if (parseInt(key) || parseInt(key) === 0) {
                      return
                    }
                    const typedKey = key as keyof GreekCacheParams
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
              width="100%"
              mt={4}
              mx={[4, 0]}
              variant="primary"
              label="Confirm"
              onClick={async () => {
                if (tx) {
                  setIsLoading(true)
                  execute(tx, {
                    onComplete: () => {
                      setIsLoading(false)
                      setIsConfirmOpen(false)
                      onParamUpdate()
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

export default AdminMarketGreekCacheParams
