import React, { FC, ReactNode, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

type Props = {
  children: ReactNode
  fallback?: JSX.Element
  error?: JSX.Element
}

function EmptyFallback(): JSX.Element {
  return <></>
}

// TODO: @dappbeast Add sentry error boundary
export const SafeSuspense = ({ children, fallback = <EmptyFallback />, error }: Props): JSX.Element => {
  return (
    <ErrorBoundary FallbackComponent={EmptyFallback}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  )
}

export default function withSuspense<T>(SuspendedComponent: FC<T>, FallbackComponent?: FC<T>) {
  const Suspended = (props: T) => {
    return (
      // TODO: @dappbeast Fix typing
      <SafeSuspense fallback={FallbackComponent != null ? <FallbackComponent {...(props as any)} /> : undefined}>
        <SuspendedComponent {...(props as any)} />
      </SafeSuspense>
    )
  }
  return Suspended
}
