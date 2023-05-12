import Box from '@lyra/ui/components/Box'
import Flex, { FlexProps } from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import Tooltip, { TooltipElement } from '@lyra/ui/components/Tooltip'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import React from 'react'

import { STAKING_REWARDS_DOC_URL } from '@/app/constants/links'
import TokenImage from '@/app/containers/common/TokenImage'

type Props = {
  children: React.ReactNode
  lyraApy: number
} & FlexProps

export default function StakeAPYTooltip({ children, lyraApy, ...flexProps }: Props): TooltipElement {
  return (
    <Tooltip
      tooltip={
        <Box>
          <Text color="secondaryText" mb={4}>
            Earn stkLYRA when you stake LYRA.
          </Text>
          <Flex alignItems="center" mb={2}>
            <TokenImage size={24} nameOrAddress="stkLyra" />
            <Text ml={2} color="secondaryText">
              stkLYRA
            </Text>
            <Text ml="auto" color="primaryText">
              {formatPercentage(lyraApy, true)}
            </Text>
          </Flex>
        </Box>
      }
      href={STAKING_REWARDS_DOC_URL}
      target="_blank"
      placement="top"
      title="Staking APY"
      showInfoIcon
      {...flexProps}
    >
      {children}
    </Tooltip>
  )
}
