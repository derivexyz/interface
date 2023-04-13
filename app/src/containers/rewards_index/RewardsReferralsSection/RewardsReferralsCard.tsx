import IconButton from '@lyra/ui/components/Button/IconButton'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Network } from '@lyrafinance/lyra-js'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import NetworkImage from '@/app/components/common/NetworkImage'
import RewardTokenAmounts from '@/app/components/rewards/RewardTokenAmounts'
import { REWARDS_CARD_GRID_COLUMN_TEMPLATE } from '@/app/constants/layout'
import { PageId } from '@/app/constants/pages'
import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'
import getPagePath from '@/app/utils/getPagePath'

type Props = MarginProps

const RewardsReferralsCard = ({ ...marginProps }: Props) => {
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  return (
    <Card
      mb={4}
      onClick={() =>
        navigate(
          getPagePath({
            page: PageId.RewardsReferrals,
            network: Network.Arbitrum,
          })
        )
      }
      sx={{
        ':hover': {
          bg: 'cardNestedHover',
          cursor: 'pointer',
        },
        ':active': {
          bg: 'active',
          cursor: 'pointer',
        },
      }}
    >
      <CardBody>
        <Grid
          width="100%"
          sx={{
            gridTemplateColumns: REWARDS_CARD_GRID_COLUMN_TEMPLATE,
            gridColumnGap: 4,
            gridRowGap: 6,
            alignItems: 'center',
          }}
        >
          <Flex alignItems="center">
            <NetworkImage network={Network.Arbitrum} />
            <Text ml={2} variant="bodyLarge">
              Referrals · {getNetworkDisplayName(Network.Arbitrum)}
            </Text>
          </Flex>
          {!isMobile ? (
            <>
              <Flex>
                <Text mr={2} color="secondaryText" variant="bodyLarge">
                  Volume
                </Text>
                <Text variant="bodyLarge">{formatUSD(0)}</Text>
              </Flex>
              <Flex>
                <Text mr={2} color="secondaryText" variant="bodyLarge">
                  Traders
                </Text>
                <Text variant="bodyLarge">{0}</Text>
              </Flex>
              <Flex ml="auto">
                <Text mr={2} color="secondaryText" variant="bodyLarge">
                  Rewards
                </Text>
                <RewardTokenAmounts color={'text'} variant="bodyLarge" tokenAmounts={[]} hideTokenImages={true} />
              </Flex>
            </>
          ) : null}

          <Flex justifySelf="end">
            <IconButton
              icon={IconType.ArrowRight}
              href={getPagePath({
                page: PageId.RewardsReferrals,
                network: Network.Arbitrum,
              })}
            />
          </Flex>
        </Grid>
      </CardBody>
    </Card>
  )
}

export default RewardsReferralsCard
