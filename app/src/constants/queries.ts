export const PROPOSAL_FRAGMENT = `
  id
  executor {
    id
  }
  timestamp
  ipfsHash
  state
  title
  summary
  motivation
  specification
  references
  executionTime
`

export const VOTE_FRAGMENT = `
  id
  user {
    id
  }
  timestamp
  support
  votingPower
`

export type ProposalCreatedQueryResult = {
  id: string
  executor: {
    id: string
  }
  timestamp: number
  ipfsHash: string
  state: string
  title: string
  summary: string
  motivation: string
  specification: string
  references: string
  executionTime: string | null
}

export type VoteQueryResult = {
  id: string
  user: {
    id: string
  }
  timestamp: number
  support: boolean
  votingPower: string
}
