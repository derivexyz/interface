import { useRouter } from 'next/router'
import React from 'react'

export default function Node({ children }: { children: React.ReactNode }): JSX.Element {
  const { isReady } = useRouter()
  return <>{isReady ? children : null}</>
}
