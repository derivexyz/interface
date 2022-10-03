import useWallet from './useWallet'

export default function useWalletAccount(): string | null {
  const { account } = useWallet()
  return account ?? null
}
