import { TokenVariant } from '@lyra/ui/components/Token'

import { ProposalState } from '@/app/constants/governance'

export default function getProposalStateVariant(state: ProposalState): TokenVariant {
  switch (state) {
    case ProposalState.Active:
    case ProposalState.Executed:
    case ProposalState.Succeeded:
      return 'primary'
    case ProposalState.Canceled:
      return 'default'
    case ProposalState.Queued:
    case ProposalState.Pending:
      return 'warning'
    case ProposalState.Expired:
    case ProposalState.Failed:
      return 'error'
  }
}
