import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Link from '@lyra/ui/components/Link'
import Text from '@lyra/ui/components/Text'
import Countdown from '@lyra/ui/components/Text/CountdownText'
import Token from '@lyra/ui/components/Token'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatDate from '@lyra/ui/utils/formatDate'
import React from 'react'
import { useRef } from 'react'

import { ProposalState } from '@/app/constants/governance'
import { CREATIVE_COMMONS_URL, FORUMS_URL, TWITTER_URL } from '@/app/constants/links'
import { VoteDetailsPageData } from '@/app/hooks/vote/useVoteDetailsPageData'
import getIPFSHashUrl from '@/app/utils/common/getIPFSHashUrl'
import getProposalStateVariant from '@/app/utils/vote/getProposalStateVariant'

type Props = {
  data: VoteDetailsPageData
} & MarginProps

const VoteDetailsCard = ({ data }: Props) => {
  const isMobile = useIsMobile()
  const currentTimestamp = useRef(() => new Date().getTime() / 1000)
  const { proposal } = data
  const {
    proposalState,
    startTimestamp,
    endTimestamp,
    ipfsHash,
    id: proposalId,
    summary,
    motivation,
    specification,
    references,
  } = proposal
  return (
    <Card>
      <CardBody>
        <Flex flexDirection="column">
          <Flex flexDirection={isMobile ? 'column' : 'row'} justifyContent="space-between">
            <Flex flexDirection="row" alignItems="center">
              <Token
                minWidth={100}
                label={proposalState.toUpperCase()}
                variant={getProposalStateVariant(proposalState)}
                mr={4}
              />
              {proposalState !== ProposalState.Active ? (
                <Text color="secondaryText">
                  {proposalState === ProposalState.Pending ? (
                    <Text color="secondaryText">
                      Voting phase begins in <Countdown as="span" timestamp={startTimestamp} />
                    </Text>
                  ) : (
                    `Voting phase ended ${formatDate(endTimestamp)}`
                  )}
                </Text>
              ) : (
                <Text color="secondaryText" mr={2}>
                  {currentTimestamp.current() >= endTimestamp ? '' : `Ends in${' '}`}
                  <Countdown
                    as="span"
                    timestamp={endTimestamp}
                    fallback="Voting phase has passed"
                    color="secondaryText"
                  />
                </Text>
              )}
            </Flex>
            <Flex mt={[4, 0]}>
              <Button
                label="IPFS"
                leftIcon={IconType.Link2}
                target="_blank"
                href={`${getIPFSHashUrl(ipfsHash)}`}
                mr={2}
              />
              <Button
                label="Share"
                leftIcon={IconType.Twitter}
                target="_blank"
                href={`${TWITTER_URL}/share?url=https://app.lyra.finance/vote/proposal/${proposalId}`}
                mr={2}
              />
              <Button label="Discuss" leftIcon={IconType.PenTool} target="_blank" href={`${FORUMS_URL}`} />
            </Flex>
          </Flex>
          <Text variant="cardHeading" mt={6}>
            Summary
          </Text>
          <Box>
            {summary
              .split('\n')
              .filter(chunk => chunk.length > 0)
              .map(chunk => (
                <Text key={chunk} mt={3}>
                  {chunk}
                </Text>
              ))}
          </Box>
          <Text variant="cardHeading" mt={6}>
            Motivation
          </Text>
          <Box>
            {motivation
              .split('\n')
              .filter(chunk => chunk.length > 0)
              .map(chunk => (
                <Text key={chunk} mt={3}>
                  {chunk}
                </Text>
              ))}
          </Box>
          <Text variant="cardHeading" mt={6}>
            Specification
          </Text>
          <Text>
            {specification
              .split('\n')
              .filter(chunk => chunk.length > 0)
              .map(chunk => (
                <Text key={chunk} mt={3}>
                  {chunk}
                </Text>
              ))}
          </Text>
          <Text variant="cardHeading" mt={6}>
            References
          </Text>
          <Text>
            {references
              .split('\n')
              .filter(chunk => chunk.length > 0)
              .map(chunk => (
                <Text key={chunk} mt={3}>
                  {chunk}
                </Text>
              ))}
          </Text>
          <Text variant="cardHeading" mt={6}>
            Copyright
          </Text>
          {/* TODO: include in proposal IPFS */}
          <Text mt={3}>
            Copyright and related rights waived via{' '}
            <Link href={CREATIVE_COMMONS_URL} showRightIcon target="_blank">
              CC0
            </Link>
            .
          </Text>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default VoteDetailsCard
