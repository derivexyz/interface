import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import IconButton from '@lyra/ui/components/Button/IconButton'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import Input from '@lyra/ui/components/Input'
import Link from '@lyra/ui/components/Link'
import Text from '@lyra/ui/components/Text'
import Tooltip from '@lyra/ui/components/Tooltip'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { getAddress } from 'ethers/lib/utils'
import React, { useRef, useState } from 'react'
import { Card } from 'rebass'

import LabelItem from '@/app/components/common/LabelItem'
import TokenAmountText from '@/app/components/common/TokenAmountText'
import { CompetitionPool, CompetitionSeasonConfig } from '@/app/constants/competition'
import { DEFAULT_MARKET } from '@/app/constants/defaults'
import { HOP_URL } from '@/app/constants/links'
import { PageId } from '@/app/constants/pages'
import formatTruncatedAddress from '@/app/utils/formatTruncatedAddress'
import getOptimismExplorerUrl from '@/app/utils/getOptimismExplorerUrl'
import getPagePath from '@/app/utils/getPagePath'

import CompetitionLeaderboardTable from '../CompetitionLeaderboardTable'

type Props = {
  selectedSeason: CompetitionSeasonConfig
  selectedPool: CompetitionPool
  selectedPoolIdx: number
  onChangePool: (poolIdx: number) => void
}

const CompetitionGlobalPrizePoolCard = ({ selectedPool, selectedPoolIdx, selectedSeason, onChangePool }: Props) => {
  const isMobile = useIsMobile()
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const now = useRef(Math.floor(Date.now() / 1000))
  return (
    <Card>
      <CardBody>
        <Flex flexDirection={isMobile ? 'column' : 'row'} alignItems={isMobile ? 'flex-start' : 'center'}>
          <Box>
            <DropdownButton
              ml={-3}
              isTransparent
              textVariant="heading"
              onClick={() => setIsOpen(!isOpen)}
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              label={`Prize Pool ${selectedPoolIdx + 1}`}
            >
              {selectedSeason.pools.map((pool, idx) => (
                <DropdownButtonListItem
                  isSelected={pool.name === selectedPool.name}
                  label={`Prize Pool ${idx + 1}`}
                  key={pool.name}
                  onClick={() => {
                    onChangePool(idx)
                    setIsOpen(false)
                  }}
                />
              ))}
            </DropdownButton>
            <Text mr={6} mt={6} color="secondaryText" variant="secondary">
              {selectedPool.description}
            </Text>
          </Box>
          <Button
            mt={[6, 0]}
            size="lg"
            minWidth={200}
            variant="primary"
            label={selectedPool.isRandom ? 'Bridge on Hop' : 'Start Trading'}
            href={
              selectedPool.isRandom ? HOP_URL : getPagePath({ page: PageId.Trade, marketAddressOrName: DEFAULT_MARKET })
            }
            target={selectedPool.isRandom ? '_blank' : '_self'}
            rightIcon={selectedPool.isRandom ? IconType.ArrowUpRight : IconType.ArrowRight}
          />
        </Flex>
        <Box mt={10}>
          <Text mb={6} variant="bodyLarge">
            Prizes
          </Text>
          <Grid sx={{ gridTemplateColumns: `repeat(${isMobile ? 3 : 6}, 1fr)`, rowGap: 6 }}>
            {selectedPool.prizes.map(rankPrize => (
              <LabelItem
                key={rankPrize.name}
                label={rankPrize.name}
                value={
                  <Box>
                    <TokenAmountText mb={2} tokenNameOrAddress="op" amount={rankPrize.prize} />
                    {typeof rankPrize.winner === 'string' ? (
                      <Box>
                        <Link
                          textVariant="secondary"
                          variant="secondary"
                          href={getOptimismExplorerUrl(rankPrize.winner)}
                          target="_blank"
                          showRightIcon
                        >
                          {formatTruncatedAddress(getAddress(rankPrize.winner))}
                        </Link>
                      </Box>
                    ) : Array.isArray(rankPrize.winner) ? (
                      <Tooltip
                        title={`Winners (${rankPrize.winner.length})`}
                        tooltip={
                          <Flex flexDirection="column" maxHeight={600} overflowY="auto">
                            {rankPrize.winner.map((winner, idx) => (
                              <Text variant="secondary" color="secondaryText" key={winner} mb={2}>
                                {(Array.isArray(rankPrize.rank) ? rankPrize.rank[0] : rankPrize.rank) + idx}.{' '}
                                <Link
                                  textVariant="secondary"
                                  variant="secondary"
                                  href={getOptimismExplorerUrl(winner)}
                                  target="_blank"
                                  showRightIcon
                                >
                                  {formatTruncatedAddress(getAddress(winner))}
                                </Link>
                              </Text>
                            ))}
                          </Flex>
                        }
                      >
                        <Text variant="secondary" color="secondaryText">
                          {formatTruncatedAddress(getAddress(rankPrize.winner[0]))}, 0x...
                        </Text>
                      </Tooltip>
                    ) : (
                      <Text variant="secondary" color="secondaryText">
                        No Winner
                      </Text>
                    )}
                  </Box>
                }
              />
            ))}
          </Grid>
        </Box>
      </CardBody>
      <Box mt={4}>
        {!selectedPool.isRandom ? (
          <>
            <Flex px={6} mb={2} alignItems="center">
              <Text variant="bodyLarge">Leaderboard</Text>
              {now.current >= selectedSeason.startTimestamp ? (
                <Flex ml="auto">
                  <Input
                    placeholder="Search"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    rightContent={
                      search !== '' ? (
                        <IconButton
                          variant="light"
                          isTransparent
                          size="sm"
                          icon={IconType.X}
                          onClick={() => setSearch('')}
                        />
                      ) : null
                    }
                  />
                </Flex>
              ) : null}
            </Flex>
            <CompetitionLeaderboardTable search={search} season={selectedSeason} pool={selectedPool} />
          </>
        ) : null}
      </Box>
    </Card>
  )
}

export default CompetitionGlobalPrizePoolCard
