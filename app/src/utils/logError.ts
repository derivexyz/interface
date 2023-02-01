import * as Sentry from '@sentry/react'
import { BigNumber } from 'ethers'

import fromBigNumber from './fromBigNumber'

export type ErrorContext = Record<string, any>

export class TransactionSubmitError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'TransactionSubmitError'
  }
}
export class TransactionRevertError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'TransactionRevertError'
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function logError(error: any, context?: ErrorContext) {
  Sentry.withScope(() => {
    const appContext = (window as any).__APP_CONTEXT__
    const errorContext = { ...context, ...appContext }

    // Parse BigNumber
    const parsedErrorContext = Object.keys(errorContext).reduce((data, key) => {
      const dat = errorContext[key]
      if (dat === undefined) {
        return data
      } else {
        return {
          [key]: dat && BigNumber.isBigNumber(dat) ? fromBigNumber(dat) : dat,
          ...data,
        }
      }
    }, {})

    Sentry.captureException(error instanceof Error || typeof error === 'object' ? error : new Error(error), {
      extra: parsedErrorContext,
    })
  })
}
