import lyra from '@/app/utils/lyra'

import useFetch from '../data/useFetch'

const fetcher = async () => await lyra.admin().globalOwner()

export default function useAdminGlobalOwner(): string | null {
  const [globalOwner] = useFetch('GlobalOwner', [], fetcher)
  return globalOwner
}
