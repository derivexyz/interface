import { BigNumber } from '@ethersproject/bignumber'
import posthog from 'posthog-js'

import { LogEvent } from '../constants/logEvents'
import fromBigNumber from './fromBigNumber'
import isServer from './isServer'

export type LogData = Record<string, any>

export default function logEvent(eventAction: LogEvent, logData?: LogData): void {
  // Insert app context
  const appContext = !isServer() ? (window as any).__APP_CONTEXT__ : null

  // Insert query params
  const queryParams = !isServer()
    ? Array.from(new URLSearchParams(window.location.search).entries()).reduce((queries, [key, val]) => {
        if (val === undefined) {
          return queries
        } else {
          return {
            ...queries,
            [key]: val,
          }
        }
      }, {})
    : null

  const logDataWithContext: LogData = { queryParams, ...appContext, ...logData }

  // Parse BigNumber
  const parsedLogDataWithContext = Object.keys(logDataWithContext).reduce((data, key) => {
    const dat = logDataWithContext[key]
    if (dat === undefined) {
      return data
    } else {
      return {
        [key]: dat && BigNumber.isBigNumber(dat) ? fromBigNumber(dat) : dat,
        ...data,
      }
    }
  }, {})

  const parsedEventAction = eventAction === LogEvent.PageView ? '$pageview' : eventAction

  posthog.capture(parsedEventAction, {
    ...parsedLogDataWithContext,
    $set: { address: appContext?.address ?? 'disconnected' },
  })
}
