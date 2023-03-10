import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client'
import { BigNumber } from 'ethers'

import { ClaimEvent } from '../account_reward_epoch'
import { Chain } from '../constants/chain'
import { CLAIM_FRAGMENT, ClaimAddedQueryResult } from '../constants/queries'
import Lyra from '../lyra'
import getLyraGovernanceSubgraphURI from './getLyraGovernanceSubgraphURI'

const claimQuery = gql`
  query claims($user: String!) {
    claims(where: { 
      claimer: $user
    }) {
      ${CLAIM_FRAGMENT}
    }
  }
`

type ClaimAddedVariables = {
  user: string
}

export default async function fetchClaimEvents(lyra: Lyra, chain: Chain, address: string): Promise<ClaimEvent[]> {
  const client = new ApolloClient({
    link: new HttpLink({ uri: getLyraGovernanceSubgraphURI(lyra, chain), fetch }),
    cache: new InMemoryCache(),
  })
  const { data } = await client.query<{ claims: ClaimAddedQueryResult[] }, ClaimAddedVariables>({
    query: claimQuery,
    variables: {
      user: address.toLowerCase(),
    },
  })
  return data.claims.map(ev => ({
    amount: BigNumber.from(ev.amount),
    blockNumber: ev.blockNumber,
    claimer: ev.claimer,
    rewardToken: ev.rewardToken,
    timestamp: ev.timestamp,
  }))
}
