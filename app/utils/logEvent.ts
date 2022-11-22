import { BigNumber } from 'ethers'
import posthog from 'posthog-js'

import { LOCAL_STORAGE_TRADER_SETTINGS_KEY } from '../constants/localStorage'
import { LogEvent } from '../constants/logEvents'
import { DEFAULT_TRADER_SETTINGS } from '../hooks/local_storage/useTraderSettings'
import fromBigNumber from './fromBigNumber'
import isServer from './isServer'

export type LogData = Record<string, any>

export default function logEvent(eventAction: LogEvent, logData?: LogData): void {
  // Insert app context
  const appContext = !isServer() ? (window as any).__APP_CONTEXT__ : null

  // Insert trader settings
  const traderSettingsStr = !isServer() ? window.localStorage.getItem(LOCAL_STORAGE_TRADER_SETTINGS_KEY) : null
  const traderSettings = Object.entries(
    traderSettingsStr ? JSON.parse(traderSettingsStr) ?? DEFAULT_TRADER_SETTINGS : DEFAULT_TRADER_SETTINGS
  ).reduce(
    (dict, [key, val]) => ({
      ...dict,
      [`setting_${key}`]: JSON.stringify(val),
    }),
    {}
  )

  // Insert query params
  const queryParams = !isServer()
    ? Array.from(new URLSearchParams(window.location.search).entries()).reduce((queries, [key, val]) => {
        if (val === undefined) {
          return queries
        } else {
          return {
            ...queries,
            [key]: JSON.stringify(val),
          }
        }
      }, {})
    : null

  const parsedEventAction = eventAction === LogEvent.PageView ? '$pageview' : eventAction

  // Parse BigNumber
  const parsedLogData = logData
    ? Object.keys(logData).reduce((data, key) => {
        const dat = logData[key]
        if (dat === undefined) {
          return data
        } else {
          return {
            [key]: dat && BigNumber.isBigNumber(dat) ? fromBigNumber(dat) : dat,
            ...data,
          }
        }
      }, {} as LogData)
    : null

  try {
    posthog.capture(parsedEventAction, {
      queryParams,
      ...appContext,
      ...traderSettings,
      ...parsedLogData,
      $set: { address: appContext?.address ?? 'disconnected' },
    })
  } catch (e) {
    console.warn('posthog.capture error:', e)
  }
}
