import { useCallback } from 'react'

import { LOCAL_STORAGE_REFERRALS_TERMS_OF_USE_KEY } from '@/app/constants/localStorage'
import isTermsOfUseEnabled from '@/app/utils/isTermsOfUseEnabled'

import useWalletAccount from '../account/useWalletAccount'
import useLocalStorage from '../local_storage/useLocalStorage'

const EMPTY_TERMS = {}

export default function useIsReferralTermsAccepted(): [boolean, () => void] {
  const account = useWalletAccount()
  const [termsStr, setTermsStr] = useLocalStorage(LOCAL_STORAGE_REFERRALS_TERMS_OF_USE_KEY)
  const termsDict: Record<string, number> = JSON.parse(termsStr) ?? EMPTY_TERMS
  const isTermsAccepted = (account && !!termsDict[account]) || !isTermsOfUseEnabled()
  const setIsTermsAccepted = useCallback(() => {
    if (account) {
      setTermsStr(
        JSON.stringify({
          ...termsDict,
          [account]: Date.now() / 1000,
        })
      )
    }
  }, [account, setTermsStr, termsDict])

  return [isTermsAccepted, setIsTermsAccepted]
}
