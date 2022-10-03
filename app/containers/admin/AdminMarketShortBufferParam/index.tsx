import { BigNumber } from '@ethersproject/bignumber'
import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Collapsible from '@lyra/ui/components/Collapsible'
import Flex from '@lyra/ui/components/Flex'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import Shimmer from '@lyra/ui/components/Shimmer'
import Text from '@lyra/ui/components/Text'
import { Market } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import useShortBuffer from '@/app/hooks/admin/useShortBuffer'
import withSuspense from '@/app/hooks/data/withSuspense'
import useMarketOwner from '@/app/hooks/market/useMarketOwner'
import useAdminTransaction from '@/app/hooks/transaction/useAdminTransaction'
import useWallet from '@/app/hooks/wallet/useWallet'

type Props = {
  market: Market
  isExpanded: boolean
  onClickExpand: () => void
  onParamUpdate: () => void
}

const AdminMarketShortBufferParams = withSuspense(
  ({ market, isExpanded, onClickExpand, onParamUpdate }: Props) => {
    const { account, isConnected } = useWallet()
    const owner = useMarketOwner(market.name)
    const [newParam, setNewParam] = useState<BigNumber | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const execute = useAdminTransaction(owner)

    const currShortBuffer = useShortBuffer(market.address)
    if (!market) {
      return null
    }
    const currVal = currShortBuffer ?? ZERO_BN
    return (
      <>
        <Box my={2}>
          <Collapsible
            header={<Text variant="heading2">Short Buffer Parameter</Text>}
            onClickHeader={onClickExpand}
            isExpanded={isExpanded}
          >
            <Box px={4}>
              <Flex flexDirection="column" my={2}>
                <BigNumberInput
                  isDisabled={isLoading}
                  label="shortBuffer"
                  value={newParam ?? ZERO_BN}
                  placeholder={currVal}
                  onEmpty={() => setNewParam(null)}
                  onChange={val => {
                    setNewParam(val)
                  }}
                />
              </Flex>
              <Button
                label="Update"
                isDisabled={!isConnected || !newParam}
                isLoading={isLoading}
                onClick={async () => {
                  if (!account || !newParam) {
                    return
                  }
                  setIsLoading(true)
                  const { tx } = await market.setShortBuffer(account, newParam)
                  setIsLoading(false)
                  if (tx) {
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
            </Box>
          </Collapsible>
        </Box>
      </>
    )
  },
  () => <Shimmer height={56} my={2} />
)

export default AdminMarketShortBufferParams
