import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Text from '@lyra/ui/components/Text'
import formatBalance from '@lyra/ui/utils/formatBalance'
import { AccountBalances } from '@lyrafinance/lyra-js'
import { BigNumber } from 'ethers'
import React from 'react'
import { useCallback } from 'react'

import RowItem from '@/app/components/common/RowItem'
import { TransactionType } from '@/app/constants/screen'
import TransactionButton from '@/app/containers/common/TransactionButton'
import useNetwork from '@/app/hooks/account/useNetwork'
import useTransaction from '@/app/hooks/account/useTransaction'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import useMutateDrip from '@/app/hooks/mutations/useMutateDrip'
import getLyraSDK from '@/app/utils/getLyraSDK'
import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'
import isMainnet from '@/app/utils/isMainnet'
import setIsMainnet from '@/app/utils/setIsMainnet'

import Layout from '../common/Layout'
import PageError from '../common/Page/PageError'

type Props = {
  marketBalances: AccountBalances[]
  ethBalance: BigNumber
}

export default function FaucetPageHelper({ marketBalances, ethBalance }: Props) {
  const quoteToken = marketBalances.length > 0 ? marketBalances[0].quoteAsset : null
  const baseTokens = marketBalances.map(b => b.baseAsset)

  const network = useNetwork()
  const walletAddress = useWalletAccount()

  const execute = useTransaction(network)

  const mutateDrip = useMutateDrip()

  const handleDrip = useCallback(async () => {
    if (!walletAddress) {
      console.warn('Wallet not connected')
      return
    }
    await execute(getLyraSDK(network).drip(walletAddress), TransactionType.Faucet, { onComplete: () => mutateDrip() })
  }, [execute, mutateDrip, walletAddress, network])

  if (!quoteToken || !baseTokens.length) {
    return <PageError error="Failed to load market data" />
  }

  const isDripped = quoteToken.balance.gt(0) || !!baseTokens.find(b => b.balance.gt(0))

  return (
    <Layout>
      <Center height="100%">
        <Card minWidth={380}>
          <CardBody>
            <Box mb={6}>
              <Text variant="heading">Faucet</Text>
              <Text variant="secondary" color="secondaryText">
                Drip {getNetworkDisplayName(network)} test tokens
              </Text>
            </Box>
            {isMainnet() ? (
              <Button size="lg" variant="primary" label="Switch to Testnet" onClick={() => setIsMainnet(false)} />
            ) : (
              <>
                <Box mb={6}>
                  <RowItem
                    label={`ETH Balance`}
                    value={formatBalance({ amount: ethBalance, symbol: 'ETH', decimals: 18 })}
                  />
                  <RowItem label={`${quoteToken.symbol} Balance`} value={formatBalance(quoteToken)} />
                  {baseTokens.map(baseToken => (
                    <RowItem
                      key={baseToken.address}
                      label={`${baseToken.symbol} Balance`}
                      value={formatBalance(baseToken)}
                    />
                  ))}
                </Box>
                <TransactionButton
                  onClick={handleDrip}
                  transactionType={TransactionType.Faucet}
                  network={network}
                  label="Get Test Tokens"
                  isDisabled={isDripped}
                />
              </>
            )}
          </CardBody>
        </Card>
      </Center>
    </Layout>
  )
}
