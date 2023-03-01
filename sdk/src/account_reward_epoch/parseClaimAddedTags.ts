import { ClaimAddedEvent, RewardEpochTokenAmount } from '..'
import { GlobalRewardEpochData } from '../utils/fetchGlobalRewardEpochData'
import fromBigNumber from '../utils/fromBigNumber'

enum ClaimAddedProgramTags {
  MMV = 'MMV',
  // TRADING tag includes fee rebates + short collateral rewards
  TRADING = 'TRADING',
  STAKING = 'STAKING',
  WETHLYRA = 'UNI-STAKING-OP',
}

export default function parseClaimAddedEvents(
  claimAddedEvents: ClaimAddedEvent[],
  globalRewardEpoch: GlobalRewardEpochData
): {
  vaultRewards: Record<string, RewardEpochTokenAmount[]>
  tradingRewards: RewardEpochTokenAmount[]
  stakingRewards: RewardEpochTokenAmount[]
  wethLyraRewards: RewardEpochTokenAmount[]
  totalRewards: RewardEpochTokenAmount[]
} {
  const vaultRewards: Record<string, RewardEpochTokenAmount[]> = {}
  let tradingRewards: RewardEpochTokenAmount[] = []
  let stakingRewards: RewardEpochTokenAmount[] = []
  let wethLyraRewards: RewardEpochTokenAmount[] = []

  claimAddedEvents.forEach(event => {
    const tag = event.tag
    const amount = fromBigNumber(event.amount)
    const rewardTokenAddress = event.rewardToken
    if (tag.startsWith(ClaimAddedProgramTags.MMV)) {
      const [_program, marketKey] = tag.split('-')
      const token = globalRewardEpoch.MMVConfig[marketKey]?.tokens?.find(
        token => token.address.toLowerCase() === rewardTokenAddress
      )
      if (!vaultRewards[marketKey]) {
        vaultRewards[marketKey] = []
      }
      const claimableToken = vaultRewards[marketKey]?.find(t => t.address.toLowerCase() === rewardTokenAddress)
      if (!claimableToken) {
        vaultRewards[marketKey] = token ? [...vaultRewards[marketKey], { ...token, amount }] : vaultRewards[marketKey]
        return
      }
      claimableToken.amount += amount
    } else if (tag.startsWith(ClaimAddedProgramTags.TRADING)) {
      const token = globalRewardEpoch.tradingRewardConfig.tokens.find(
        token => token.address.toLowerCase() === rewardTokenAddress
      )
      if (!token) {
        return
      }
      const claimableToken = tradingRewards.find(t => t.address.toLowerCase() === rewardTokenAddress)
      if (!claimableToken) {
        tradingRewards = [...tradingRewards, { ...token, amount }]
        return
      }
      claimableToken.amount += amount
    } else if (tag.startsWith(ClaimAddedProgramTags.STAKING)) {
      const token = globalRewardEpoch.stakingRewardConfig.find(
        token => token.address.toLowerCase() === rewardTokenAddress
      )
      if (!token) {
        return
      }
      const claimableToken = stakingRewards.find(t => t.address.toLowerCase() === rewardTokenAddress)
      if (!claimableToken) {
        stakingRewards = [...stakingRewards, { ...token, amount }]
        return
      }
      claimableToken.amount += amount
    } else if (tag.startsWith(ClaimAddedProgramTags.WETHLYRA)) {
      const token = globalRewardEpoch.wethLyraStakingRewardConfig?.find(
        token => token.address.toLowerCase() === rewardTokenAddress
      )
      if (!token) {
        return
      }
      const claimableToken = wethLyraRewards.find(t => t.address.toLowerCase() === rewardTokenAddress)
      if (!claimableToken) {
        wethLyraRewards = [...wethLyraRewards, { ...token, amount }]
        return
      }
      claimableToken.amount += amount
    }
  })

  const totalRewards = Object.values(
    [...tradingRewards, ...wethLyraRewards, ...stakingRewards, ...Object.values(vaultRewards).flat()].reduce(
      (map, rewardTokenAmount) => {
        if (!map[rewardTokenAmount.address]) {
          map[rewardTokenAmount.address] = rewardTokenAmount
          return map
        }
        map[rewardTokenAmount.address].amount += rewardTokenAmount.amount
        return map
      },
      {} as Record<string, RewardEpochTokenAmount>
    )
  )

  return { vaultRewards, tradingRewards, stakingRewards, wethLyraRewards, totalRewards }
}
