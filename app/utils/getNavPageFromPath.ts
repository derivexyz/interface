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
  if (rootPath === 'trade' || rootPath === 'position') {
    return PageId.Trade
  } else if (rootPath === 'portfolio') {
    return PageId.Portfolio
  } else if (rootPath === 'vaults') {
    return PageId.Vaults
  } else if (rootPath === 'rewards') {
    return PageId.Rewards
  } else if (rootPath === 'competition') {
    return PageId.Competition
  } else {
    return null
  }
}
