import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client'
import { BigNumber } from 'ethers'

import { ClaimAddedEvent } from '../account_reward_epoch'
import { Chain } from '../constants/chain'
import { CLAIM_ADDED_FRAGMENT, ClaimAddedQueryResult } from '../constants/queries'
import getLyraGovernanceSubgraphURI from './getLyraGovernanceSubgraphURI'

const claimAddedQuery = gql`
  query claimAddeds($user: String!) {
    claimAddeds(where: { 
      claimer: $user
    }) {
      ${CLAIM_ADDED_FRAGMENT}
    }
  }
`

type ClaimAddedVariables = {
  user: string
}

export default async function fetchClaimAddedEvents(chain: Chain, address: string): Promise<ClaimAddedEvent[]> {
  const client = new ApolloClient({
    link: new HttpLink({ uri: getLyraGovernanceSubgraphURI(chain), fetch }),
    cache: new InMemoryCache(),
  })
  const { data } = await client.query<{ claimAddeds: ClaimAddedQueryResult[] }, ClaimAddedVariables>({
    query: claimAddedQuery,
    variables: {
      user: address.toLowerCase(),
    },
  })
  return data.claimAddeds.map(ev => ({
    amount: BigNumber.from(ev.amount),
    blockNumber: ev.blockNumber,
    claimer: ev.claimer,
    epochTimestamp: parseInt(ev.epochTimestamp),
    rewardToken: ev.rewardToken,
    timestamp: ev.timestamp,
    tag: ev.tag,
  }))
}
