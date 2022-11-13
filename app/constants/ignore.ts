// strikes to ignore
export type IgnoreStrike = {
  marketName: string
  strikeId: number
}

const IGNORE_STRIKE_LIST: IgnoreStrike[] = [
  {
    marketName: 'btc',
    strikeId: 36,
  },
]

export default IGNORE_STRIKE_LIST
