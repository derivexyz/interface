import Box from '@lyra/ui/components/Box'
import Flex, { FlexProps } from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import Tooltip, { TooltipElement } from '@lyra/ui/components/Tooltip'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedNumber from '@lyra/ui/utils/formatTruncatedNumber'
import React from 'react'

import { STAKING_REWARDS_DOC_URL } from '@/app/constants/links'
import TokenImage from '@/app/containers/common/TokenImage'
import useOptimismToken from '@/app/hooks/data/useOptimismToken'

type Props = {
  children: React.ReactNode
  marketName: string
  lyraApy: number
  opApy: number
  apyMultiplier?: number
  stakedLyraBalance?: number
} & FlexProps

export default function VaultAPYTooltip({
  marketName,
  children,
  lyraApy,
  opApy,
  apyMultiplier,
  stakedLyraBalance,
  ...flexProps
}: Props): TooltipElement {
  const opToken = useOptimismToken('op')
  const stkLyraToken = useOptimismToken('stkLyra')
  return (
    <Tooltip
      tooltip={
        <Box>
          <Text variant="secondary" color="secondaryText" mb={4}>
            Earn staked LYRA and/or OP tokens when you deposit sUSD to the {marketName} Vault.
          </Text>
          {apyMultiplier && apyMultiplier > 1 && stakedLyraBalance && stakedLyraBalance > 0 ? (
            <Text variant="secondary" color="secondaryText" mb={4}>
              You staked{' '}
              <Text as="span" color="primaryText">
                {formatTruncatedNumber(stakedLyraBalance)} LYRA
              </Text>{' '}
              for a{' '}
              <Text as="span" color="primaryText">
                {formatNumber(apyMultiplier)}x
              </Text>{' '}
              boost.
            </Text>
          ) : null}
          <Flex alignItems="center" mb={2}>
            <TokenImage size={24} nameOrAddress="stkLyra" />
            <Text ml={2} variant="secondary" color="secondaryText">
              {stkLyraToken?.symbol}
            </Text>
            <Text variant="secondary" ml="auto" color={lyraApy === 0 ? 'secondaryText' : 'primaryText'}>
              {formatPercentage(lyraApy, true)}
            </Text>
          </Flex>
          <Flex alignItems="center">
            <TokenImage size={24} nameOrAddress="OP" />

            <Text ml={2} variant="secondary" color="secondaryText">
              {opToken?.symbol}
            </Text>
            <Text variant="secondary" ml="auto" color={opApy === 0 ? 'secondaryText' : 'primaryText'}>
              {formatPercentage(opApy, true)}
            </Text>
          </Flex>
        </Box>
      }
      href={STAKING_REWARDS_DOC_URL}
      showInfoIcon
      target="_blank"
      placement="top"
      title={`${apyMultiplier && apyMultiplier > 1 ? 'Boosted' : 'Rewards'} APY`}
      {...flexProps}
    >
      {children}
    </Tooltip>
  )
}
