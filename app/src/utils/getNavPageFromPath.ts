import { PageId } from '../constants/pages'

// HACK: determine which page is selected based on the path root
export const getNavPageFromPath = (path: string): PageId | null => {
  const parts = path
    .split('?')[0]
    .split('#')[0]
    .split('/')
    .filter(p => p !== '')
  const rootPath = parts[0]

  // TODO: Replace logic with TabId
  if (rootPath === 'trade') {
    return PageId.Trade
  } else if (rootPath === 'airdrop') {
    return PageId.Leaderboard
  } else if (rootPath === 'vaults') {
    return PageId.VaultsIndex
  } else if (rootPath === 'rewards') {
    return PageId.RewardsIndex
  } else if (rootPath === 'faucet') {
    return PageId.Faucet
  } else if (rootPath === 'vote') {
    return PageId.VoteIndex
  } else {
    return null
  }
}
