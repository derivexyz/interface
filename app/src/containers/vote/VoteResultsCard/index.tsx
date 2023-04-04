import { BigNumber } from '@ethersproject/bignumber'
import Box from '@lyra/ui/components/Box'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import LinearProgress from '@lyra/ui/components/LinearProgress'
import Link from '@lyra/ui/components/Link'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import formatDate from '@lyra/ui/utils/formatDate'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedNumber from '@lyra/ui/utils/formatTruncatedNumber'
import React from 'react'
import { useMemo } from 'react'

import Avatar from '@/app/components/common/Avatar'
import { Vote } from '@/app/constants/governance'
import { AppNetwork } from '@/app/constants/networks'
import { VoteDetailsPageData } from '@/app/hooks/vote/useVoteDetailsPageData'
import formatTruncatedAddress from '@/app/utils/formatTruncatedAddress'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getNetworkConfig from '@/app/utils/getNetworkConfig'
import isMainnet from '@/app/utils/isMainnet'

type Props = {
  data: VoteDetailsPageData
} & MarginProps

const VoteResultsCard = ({ data }: Props) => {
  const forVotes = data.proposal.forVotes
  const againstVotes = data.proposal.againstVotes
  const totalVotes = forVotes + againstVotes
  const forPercentage = totalVotes > 0 ? forVotes / totalVotes : 0
  const againstPercentage = totalVotes > 0 ? againstVotes / totalVotes : 0
  const proposalState = data.proposal.proposalState
  const creator = data.proposal.creator
  const createdTimestamp = data.proposal.timestamp
  const startTimestamp = data.proposal.startTimestamp
  const endTimestamp = data.proposal.endTimestamp
  const isQuorumValid = data.executor.isQuorumValid
  const isVoteDifferentialValid = data.executor.isVoteDifferentialValid
  const currentVoteDifferential = forVotes - againstVotes
  const totalVotingPower = data.strategy.totalVotingSupply
  const minimumVoteDifferential =
    (data.executor.minimumVoteDifferential / data.executor.oneHundredWithPrecision) * totalVotingPower
  const votes = useMemo(() => {
    return data.votes.length === 0
      ? []
      : data.votes
          .sort((a, b) => fromBigNumber(BigNumber.from(b.votingPower)) - fromBigNumber(BigNumber.from(a.votingPower)))
          .map(vote => {
            return {
              id: vote.id,
              address: vote.user.id,
              amount: fromBigNumber(BigNumber.from(vote.votingPower)),
              position: vote.support ? Vote.For : Vote.Against,
            }
          })
  }, [data])
  return (
    <Card>
      <CardBody>
        <Text variant="heading2" mb={4}>
          Results
        </Text>
        <Flex flexDirection="row" justifyContent="space-between" mb={2}>
          <Text variant="body">For: {formatNumber(forVotes)} LYRA</Text>
          <Text variant="body" color="secondaryText">
            {formatPercentage(forPercentage, true)}
          </Text>
        </Flex>
        <LinearProgress color="primaryText" progress={forPercentage} mb={4} />
        <Flex flexDirection="row" justifyContent="space-between" mb={2}>
          <Text variant="body">Against: {formatNumber(againstVotes)} LYRA</Text>
          <Text variant="body" color="secondaryText">
            {formatPercentage(againstPercentage, true)}
          </Text>
        </Flex>
        <LinearProgress color="errorText" progress={againstPercentage} mb={4} />
        <Flex flexDirection="row" justifyContent="space-between" my={2}>
          <Text variant="secondary" color="secondaryText">
            State
          </Text>
          <Text variant="secondary" color="text">
            {proposalState}
          </Text>
        </Flex>
        <Flex flexDirection="row" justifyContent="space-between" my={2}>
          <Text variant="secondary" color="secondaryText">
            Quorum
          </Text>
          <Text variant="secondary" color={'text'}>
            {isQuorumValid ? 'Reached' : 'Not Reached'}
          </Text>
        </Flex>
        <Flex flexDirection="row" justifyContent="space-between" my={2}>
          <Text variant="secondary" color="secondaryText">
            Current votes
          </Text>
          <Text variant="secondary" color="text">
            {formatTruncatedNumber(totalVotes)}
          </Text>
        </Flex>
        <Flex flexDirection="row" justifyContent="space-between" my={2}>
          <Text variant="secondary" color="secondaryText">
            Differential
          </Text>
          <Text variant="secondary" color={'text'}>
            {isVoteDifferentialValid ? 'Reached' : 'Not Reached'}
          </Text>
        </Flex>
        <Flex flexDirection="row" justifyContent="space-between" my={2}>
          <Flex flexDirection="column">
            <Text variant="secondary" color="secondaryText">
              Current differential
            </Text>
            <Text variant="small" color="secondaryText">
              Min. required
            </Text>
          </Flex>
          <Flex flexDirection="column" alignItems="flex-end">
            <Text variant="secondary" color="text">
              {formatTruncatedNumber(currentVoteDifferential)}
            </Text>
            <Text variant="small" color="secondaryText">
              {formatTruncatedNumber(minimumVoteDifferential)}
            </Text>
          </Flex>
        </Flex>
        <Flex flexDirection="row" justifyContent="space-between" my={2}>
          <Text variant="secondary" color="secondaryText">
            Total voting power
          </Text>
          <Text variant="secondary" color="text">
            {formatTruncatedNumber(totalVotingPower)} stkLYRA
          </Text>
        </Flex>
        <Text variant="heading2" mt={6} mb={2}>
          Timeline
        </Text>
        <Flex flexDirection="row" justifyContent="space-between" my={2}>
          <Text variant="secondary" color="secondaryText">
            Created by{' '}
            <Link
              showRightIcon
              target="_blank"
              textVariant="secondary"
              color="secondaryText"
              href={
                isMainnet()
                  ? `https://etherscan.io/address/${creator}`
                  : `https://goerli.etherscan.io/address/${creator}`
              }
            >
              {formatTruncatedAddress(creator)}
            </Link>
          </Text>
          <Text variant="secondary" color="text">
            {formatDate(createdTimestamp)}
          </Text>
        </Flex>
        <Flex flexDirection="row" justifyContent="space-between" my={2}>
          <Text variant="secondary" color="secondaryText">
            Started
          </Text>
          <Text variant="secondary" color="text">
            {formatDate(startTimestamp)}
          </Text>
        </Flex>
        <Flex flexDirection="row" justifyContent="space-between" my={2}>
          <Text variant="secondary" color="secondaryText">
            Ends
          </Text>
          <Text variant="secondary" color="text">
            {formatDate(endTimestamp)}
          </Text>
        </Flex>
        <Text variant="heading2" mt={6} mb={4}>
          Top Addresses
        </Text>
        {votes.length > 0 ? (
          <>
            <Flex flexDirection="row" justifyContent="space-between" my={2}>
              <Text variant="secondary" color="secondaryText">
                Address
              </Text>
              <Text variant="secondary" color="secondaryText">
                Votes
              </Text>
            </Flex>
            <Box sx={{ maxHeight: 200, overflowY: 'scroll' }}>
              {votes.slice(0, 7).map(vote => {
                const voter = vote.address
                return (
                  <Flex key={vote.id} flexDirection="row" justifyContent="space-between" my={4}>
                    <Flex>
                      <Avatar size={18} ensImage={null} address={voter} />
                      <Link
                        showRightIcon
                        target="_blank"
                        textVariant="secondary"
                        color="secondaryText"
                        ml={2}
                        href={`${getNetworkConfig(AppNetwork.Ethereum).blockExplorerUrl}/${voter}`}
                      >
                        {formatTruncatedAddress(voter)}
                      </Link>
                    </Flex>
                    <Flex>
                      <Text variant="secondary" color={vote.position === Vote.For ? 'primaryText' : 'errorText'} mr={2}>
                        {vote.position.toUpperCase()}
                      </Text>
                      <Text variant="secondary" color="secondaryText">
                        {formatNumber(vote.amount)}
                      </Text>
                    </Flex>
                  </Flex>
                )
              })}
            </Box>
          </>
        ) : (
          <Text variant="secondary" color="secondaryText">
            No votes recorded
          </Text>
        )}
      </CardBody>
    </Card>
  )
}

export default VoteResultsCard
