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
    title,
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
          <Text variant="title" sx={{ fontWeight: 300 }}>
            {title}
          </Text>
          <Flex flexDirection={isMobile ? 'column' : 'row'} justifyContent="space-between" mt={8}>
            <Flex flexDirection="row" alignItems="center">
              <Token
                label={proposalState.toUpperCase()}
                variant={getProposalStateVariant(proposalState)}
                sx={{
                  height: 24,
                  paddingTop: '2px',
                  fontSize: 12,
                  fontFamily: 'body',
                  fontWeight: 'medium',
                  lineHeight: '21px',
                  letterSpacing: 'body',
                }}
                mr={4}
              />
              {proposalState !== ProposalState.Active ? (
                <Text variant="secondary" color="secondaryText">
                  {proposalState === ProposalState.Pending ? (
                    <Text variant="secondary" color="secondaryText">
                      Voting phase begins in <Countdown timestamp={startTimestamp} />
                    </Text>
                  ) : (
                    `Voting phase ended ${formatDate(endTimestamp)}`
                  )}
                </Text>
              ) : (
                <Flex flexDirection="row">
                  <Text variant="secondary" color="secondaryText" mr={2}>
                    {currentTimestamp.current() >= endTimestamp ? '' : `Ends in${' '}`}
                  </Text>
                  <Countdown
                    timestamp={endTimestamp}
                    fallback="Voting phase has passed"
                    color="secondaryText"
                    variant="secondary"
                  />
                </Flex>
              )}
            </Flex>
            <Flex mt={[4, 0]}>
              <Button
                label="IPFS"
                size="sm"
                leftIcon={IconType.Link2}
                target="_blank"
                href={`${getIPFSHashUrl(ipfsHash)}`}
                mr={2}
              />
              <Button
                label="Share"
                size="sm"
                leftIcon={IconType.Twitter}
                target="_blank"
                href={`${TWITTER_URL}/share?url=https://app.lyra.finance/vote/proposal/${proposalId}`}
                mr={2}
              />
              <Button label="Discuss" size="sm" leftIcon={IconType.PenTool} target="_blank" href={`${FORUMS_URL}`} />
            </Flex>
          </Flex>
          <Text variant="heading2" mt={8} mb={4}>
            Summary
          </Text>
          <Text variant="body" mb={4}>
            {summary}
          </Text>
          <Text variant="heading2" mt={8} mb={4}>
            Motivation
          </Text>
          <Text variant="body" mb={4}>
            {motivation}
          </Text>
          <Text variant="heading2" mt={8} mb={4}>
            Specification
          </Text>
          <Text variant="body" mb={4}>
            {specification}
          </Text>
          <Text variant="heading2" mt={8} mb={4}>
            References
          </Text>
          <Text variant="body" mb={4}>
            {references}
          </Text>
          <Text variant="heading2" mt={8} mb={4}>
            Copyright
          </Text>
          <Text variant="body" mb={4}>
            Copyright and related rights waived via{' '}
            <Link variant="secondary" href={CREATIVE_COMMONS_URL} showRightIcon target="_blank">
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
