import { PopulatedTransaction } from '@ethersproject/contracts'
import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Collapsible from '@lyra/ui/components/Collapsible'
import Flex from '@lyra/ui/components/Flex'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import Modal from '@lyra/ui/components/Modal'
import Text from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import { AdminForceCloseParams, Market } from '@lyrafinance/lyra-js'
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
const zeroDecimalKeys: (keyof AdminForceCloseParams)[] = ['ivGWAVPeriod', 'skewGWAVPeriod']

const AdminMarketForceCloseParams = ({ market, isExpanded, onClickExpand }: Props) => {
  const admin = useAdmin(market.lyra.network)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [params, setParams] = useState<Partial<AdminForceCloseParams>>({})
  const [newParams, setNewParams] = useState<Partial<AdminForceCloseParams>>({})
  const [tx, setTx] = useState<PopulatedTransaction | null>(null)
  const execute = useAdminTransaction(market.lyra.network, market.params.owner)
  return (
    <>
      <Collapsible
        onClickHeader={onClickExpand}
        header={<Text variant="heading2">Force Close Parameters</Text>}
        isExpanded={isExpanded}
      >
        <Box p={4}>
          {Object.entries(market.__data.marketParameters.forceCloseParams).map(([key, value]) => {
            if (parseInt(key) || parseInt(key) === 0) {
              return
            }
            const typedKey = key as keyof AdminForceCloseParams
            const isZeroDecimals = zeroDecimalKeys.includes(typedKey)
            const val = params[typedKey] ?? ZERO_BN
            return (
              <Flex flexDirection="column" mb={4} key={key}>
                <BigNumberInput
                  label={key}
                  decimals={isZeroDecimals ? 0 : 18}
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
            size="lg"
            width={200}
            variant="primary"
            label="Update"
            onClick={async () => {
              const { tx, params: newParams } = await admin.setForceCloseParams(market.address, params)
              setNewParams(newParams)
              setTx(tx)
              setIsConfirmOpen(true)
            }}
          />
        </Box>
      </Collapsible>
      <Modal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} title="Confirm New Force Close Parameters">
        <CardBody>
          <Box>
            {newParams
              ? Object.entries(newParams).map(([key, value]) => {
                  if (parseInt(key) || parseInt(key) === 0) {
                    return
                  }
                  const typedKey = key as keyof AdminForceCloseParams
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

export default AdminMarketForceCloseParams
