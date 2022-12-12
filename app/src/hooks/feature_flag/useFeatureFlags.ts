import { fetchAndActivate, getAll } from 'firebase/remote-config'

import { DEFAULT_FEATURE_FLAGS, FeatureFlag, FeatureFlags } from '@/app/constants/featureFlag'
import { remoteConfig as getRemoteConfig } from '@/app/utils/firebaseRemoteConfig'

import useFetch from '../data/useFetch'

const fetcher = async () => {
  const remoteConfig = await getRemoteConfig()
  if (!remoteConfig) {
    return DEFAULT_FEATURE_FLAGS
  } else {
    await fetchAndActivate(remoteConfig)
    const featureFlags: FeatureFlags = {
      ...DEFAULT_FEATURE_FLAGS,
    }
    const allFlags = getAll(remoteConfig)
    for (const featureFlag in allFlags) {
      featureFlags[featureFlag as FeatureFlag] = JSON.parse(allFlags[featureFlag].asString())
    }
    return featureFlags
  }
}

export default function useFeatureFlags(): FeatureFlags {
  const [featureFlags] = useFetch('FeatureFlags', [], fetcher)
  return featureFlags ?? DEFAULT_FEATURE_FLAGS
}
