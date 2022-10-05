import { useEffect } from 'react'
import { chain, useConnect } from 'wagmi'

export default function useAutoConnect(): void {
  const { connect } = useConnect()

  useEffect(() => {
    const connectGnosisSafe = async () => {
      const GnosisSafe = (await import('@gnosis.pm/safe-apps-wagmi')).SafeConnector
      const connector = new GnosisSafe({ chains: [chain.optimism] })
      if (connector.ready) {
        connect({ connector })
      }
    }

    const id = setTimeout(() => {
      connectGnosisSafe()
    }, 300)

    return () => clearTimeout(id)
  }, [connect])
}
