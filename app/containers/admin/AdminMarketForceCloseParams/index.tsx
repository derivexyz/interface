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
import { ForceCloseParams, Market } from '@lyrafinance/lyra-js'
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
const zeroDecimalKeys: (keyof ForceCloseParams)[] = ['ivGWAVPeriod', 'skewGWAVPeriod']

const AdminMarketForceCloseParams = withSuspense(
  ({ market, isExpanded, onClickExpand, onParamUpdate }: Props) => {
    const { account, isConnected } = useWallet()
    const owner = useMarketOwner(market.name)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [params, setParams] = useState<Partial<ForceCloseParams>>({})
    const [newParams, setNewParams] = useState<Partial<ForceCloseParams>>({})
    const [tx, setTx] = useState<PopulatedTransaction | null>(null)
    const execute = useAdminTransaction(owner)
    const [isLoading, setIsLoading] = useState(false)
    if (!market) {
      return null
    }
    return (
      <>
        <Collapsible
          my={2}
          onClickHeader={onClickExpand}
          header={<Text variant="heading2">Force Close Parameters</Text>}
          isExpanded={isExpanded}
        >
          <Box px={4}>
            {Object.entries(market.marketParameters.forceCloseParams).map(([key, value]) => {
              if (parseInt(key) || parseInt(key) === 0) {
                return
              }
              const typedKey = key as keyof ForceCloseParams
              const isZeroDecimals = zeroDecimalKeys.includes(typedKey)
              const val = params[typedKey] ?? ZERO_BN
              return (
                <Flex flexDirection="column" my={2} key={key}>
                  <BigNumberInput
                    label={key}
                    decimals={isZeroDecimals ? 0 : 18}
                    isDisabled={isLoading}
                    value={val}
                    key={key}
                    placeholder={isZeroDecimals ? fromBigNumber(value, 0).toString() : value}
                    onEmpty={() => {
                      const toParams = { ...params }
                      delete toParams[typedKey]
                      setParams(toParams)
                    }}
                    onChange={val => {
                      const newForceCloseParams = {
                        ...params,
                        [key]: val,
                      }
                      setParams(newForceCloseParams)
                    }}
                  />
                </Flex>
              )
            })}
            <Button
              isDisabled={!isConnected}
              isLoading={isLoading}
              label="Update"
              onClick={async () => {
                if (!account) {
                  return
                }
                setIsLoading(true)
                const { tx, params: newParams } = await market.setForceCloseParams(account, params)
                setIsLoading(false)
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
          title="Confirm New Force Close Parameters"
        >
          <CardBody>
            <Box>
              {newParams
                ? Object.entries(newParams).map(([key, value]) => {
                    if (parseInt(key) || parseInt(key) === 0) {
                      return
                    }
                    const typedKey = key as keyof ForceCloseParams
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
              mt={4}
              variant="primary"
              label="Confirm"
              onClick={() => {
                if (tx) {
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

export default AdminMarketForceCloseParams
