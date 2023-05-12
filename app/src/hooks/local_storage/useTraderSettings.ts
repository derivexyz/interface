import { LOCAL_STORAGE_TRADER_SETTINGS_KEY } from '@/app/constants/localStorage'

import useLocalStorage from './useLocalStorage'

export enum CustomColumnOption {
  Delta = 'delta',
  OI = 'openInterest',
  IV = 'iv',
  Vega = 'vega',
  Gamma = 'gamma',
  Theta = 'theta',
}

export type TraderSettings = {
  customCol1: CustomColumnOption
  customCol2: CustomColumnOption
  isAdvancedMode: boolean
}

export const DEFAULT_TRADER_SETTINGS: TraderSettings = {
  customCol1: CustomColumnOption.Delta,
  customCol2: CustomColumnOption.OI,
  isAdvancedMode: false,
}

export default function useTraderSettings(): [TraderSettings, (partialSettings: Partial<TraderSettings>) => void] {
  const [_traderSettings, _setTraderSettings] = useLocalStorage(LOCAL_STORAGE_TRADER_SETTINGS_KEY)
  const traderSettings: TraderSettings = JSON.parse(_traderSettings) ?? DEFAULT_TRADER_SETTINGS
  const setTraderSetting = (partialSettings: Partial<TraderSettings>) => {
    _setTraderSettings(
      JSON.stringify({
        ...traderSettings,
        ...partialSettings,
      })
    )
  }
  return [traderSettings, setTraderSetting]
}
