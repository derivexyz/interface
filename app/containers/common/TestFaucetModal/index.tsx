import withSuspense from '@lyra/app/hooks/data/withSuspense'
import useTransaction from '@lyra/app/hooks/transaction/useTransaction'
import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Modal from '@lyra/ui/components/Modal'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatUSD from '@lyra/ui/utils/formatUSD'
import React, { useState } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { DEFAULT_MARKET } from '@/app/constants/defaults'
import { OPTIMISM_FAUCET } from '@/app/constants/links'
import { Network } from '@/app/constants/networks'
import { TransactionType } from '@/app/constants/screen'
import useEthBalance from '@/app/hooks/erc20/useEthBalance'
import useBalances, { useMutateBalances } from '@/app/hooks/market/useBalances'
import useMarket from '@/app/hooks/market/useMarket'
import useWalletAccount from '@/app/hooks/wallet/useWalletAccount'
import getOptimismExplorerUrl from '@/app/utils/getOptimismExplorerUrl'
import lyra from '@/app/utils/lyra'

import MarketImage from '../../../components/common/MarketImage'
import TokenImage from '../TokenImage'
import TransactionButton from '../TransactionButton'

type Props = { isOpen: boolean; onClose: () => void }

const FaucetETHBalance = withSuspense(
  () => {
    const ethBalance = useEthBalance(Network.Optimism)
    const ethBalanceNum = formatNumber(ethBalance)
    const owner = useWalletAccount()
    return (
      <Button
        leftIcon={<MarketImage name="eth" />}
        rightIcon={ethBalance.gt(0) ? IconType.Check : null}
        label={`${ethBalanceNum} ETH`}
        variant="light"
        size="large"
        href={getOptimismExplorerUrl(owner ?? '')}
        target="_blank"
        minWidth={170}
      />
    )
  },
  () => <ButtonShimmer size="lg" width={170} />
)

const FaucetSUSDBalance = withSuspense(
  () => {
    const market = useMarket(DEFAULT_MARKET)
    const quoteToken = useBalances().stable('sUSD')
    const susdBalanceNum = formatUSD(quoteToken?.balance ?? ZERO_BN)
    if (!market) {
      return null
    }
    return (
      <Button
        leftIcon={<TokenImage nameOrAddress={market.quoteToken.symbol} />}
        rightIcon={quoteToken?.balance.gt(0) ? IconType.Check : null}
        label={`${susdBalanceNum} sUSD`}
        variant="light"
        size="large"
        href={getOptimismExplorerUrl(market.quoteToken.address)}
        target="_blank"
        minWidth={170}
      />
    )
  },
  () => <ButtonShimmer size="lg" width={170} />
)

const FaucetSETHBalance = withSuspense(
  () => {
    const market = useMarket(DEFAULT_MARKET)
    const balances = useBalances()
    if (!market) {
      return null
    }
    const baseBalance = balances.base(market.baseToken.symbol).balance
    const sethBalanceNum = formatNumber(baseBalance, { maxDps: 4 })
    return (
      <Button
        leftIcon={<TokenImage nameOrAddress={market.baseToken.symbol} />}
        rightIcon={baseBalance.gt(0) ? IconType.Check : null}
        label={`${sethBalanceNum} sETH`}
        variant="light"
        size="large"
        href={getOptimismExplorerUrl(market.baseToken.address)}
        target="_blank"
        minWidth={170}
      />
    )
  },
  () => <ButtonShimmer size="lg" width={170} />
)

const ClaimButton = withSuspense(
  ({ onDone }: { onDone: () => void }) => {
    const account = useWalletAccount()
    const [isClaimLoading, setIsClaimLoading] = useState(false)
    const executeTransaction = useTransaction()
    const ethBalance = useEthBalance(Network.Optimism)
    const hasStables = useBalances().stables.some(stable => stable.balance?.gt(0))
    const mutate = useMutateBalances()

    const claim = async () => {
      if (!account) {
        console.warn('Not connected')
        return
      }
      setIsClaimLoading(true)
      await executeTransaction(lyra.drip(account), {
        onComplete: async () => await mutate(),
      })
      setIsClaimLoading(false)
    }

    if (ethBalance.isZero()) {
      return (
        <TransactionButton
          transactionType={TransactionType.Faucet}
          label="Claim ETH from Optimism Faucet"
          rightIcon={IconType.ExternalLink}
          variant="primary"
          size="large"
          href={OPTIMISM_FAUCET}
          target="_blank"
          sx={{ width: '100%' }}
        />
      )
    } else if (!hasStables) {
      return (
        <TransactionButton
          transactionType={TransactionType.Faucet}
          isLoading={isClaimLoading}
          label={'Claim Synths'}
          variant="primary"
          size="large"
          onClick={claim}
          sx={{ width: '100%' }}
        />
      )
    } else {
      return <Button label="Done" size="large" width="100%" variant="primary" onClick={onDone} />
    }
  },
  () => <ButtonShimmer width={'100%'} size="lg" />
)

const HelpText = withSuspense(
  () => {
    const ethBalance = useEthBalance(Network.Optimism)

    return ethBalance.isZero() ? (
      <Text textAlign="center" color="secondaryText">
        Claim Optimistic Goerli ETH from the Optimism Faucet. Remember to check "Drip on additional networks".
      </Text>
    ) : (
      <Text textAlign="center" color="secondaryText">
        You need synths to trade on Lyra. Claim your tokens from our faucet below.
      </Text>
    )
  },
  () => <TextShimmer width="80%" />
)

export default function TestFaucetModal({ isOpen, onClose }: Props) {
  return (
    <Modal title="Testnet Faucet" isOpen={isOpen} onClose={onClose}>
      <CardBody>
        <Flex alignItems="center" flexDirection="column" width="100%">
          <HelpText />
          <Flex my={4} alignItems="center" flexDirection="column">
            <Flex>
              <FaucetETHBalance />
            </Flex>
            <Flex mt={2}>
              <Box mr={2}>
                <FaucetSUSDBalance />
              </Box>
              <FaucetSETHBalance />
            </Flex>
          </Flex>
          <Flex width="100%">
            <ClaimButton onDone={onClose} />
          </Flex>
        </Flex>
      </CardBody>
    </Modal>
  )
}
