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
  isCandleChart: boolean
  isChartExpanded: boolean
}

export const DEFAULT_TRADER_SETTINGS: TraderSettings = {
  customCol1: CustomColumnOption.Delta,
  customCol2: CustomColumnOption.OI,
  isAdvancedMode: false,
  isCandleChart: false,
  isChartExpanded: true,
}

export default function useTraderSettings(): [
  TraderSettings,
  (key: keyof TraderSettings, value: boolean | CustomColumnOption | Partial<TraderSettings>) => void
] {
  const [_traderSettings, _setTraderSettings] = useLocalStorage(LOCAL_STORAGE_TRADER_SETTINGS_KEY)
  const traderSettings: TraderSettings = JSON.parse(_traderSettings) ?? DEFAULT_TRADER_SETTINGS
  const setTraderSetting = (
    key: keyof TraderSettings,
    value: boolean | CustomColumnOption | Partial<TraderSettings>
  ) => {
    if (typeof value === 'object') {
      _setTraderSettings(
        JSON.stringify({
          ...traderSettings,
          ...value,
        })
      )
    } else {
      _setTraderSettings(
        JSON.stringify({
          ...traderSettings,
          [key]: value,
        })
      )
    }
  }
  return [traderSettings, setTraderSetting]
}
